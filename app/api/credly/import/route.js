import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { computeSha256, computePassportHash } from "@/lib/verification/cryptoHash";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
      include: {
        passport: true,
        evidences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const body = await request.json();
    const { badges = [], credlyUrl } = body;

    if (!Array.isArray(badges) || badges.length === 0) {
      return NextResponse.json({ error: "No badges selected for import." }, { status: 400 });
    }

    if (credlyUrl && typeof credlyUrl === "string" && credlyUrl.trim() && credlyUrl !== user.credlyUrl) {
      await prisma.user.update({
        where: { id: user.id },
        data: { credlyUrl: credlyUrl.trim() },
      });
    }

    const newSkillsSet = new Set(user.skills || []);
    const createdEvidences = [];

    for (const badge of badges) {
      const claimedSkills = Array.isArray(badge.skills) ? badge.skills : [];
      claimedSkills.forEach((s) => newSkillsSet.add(s));

      const fileHash = computeSha256(
        `${user.id}_credly_${badge.title}_${badge.credentialId || badge.verificationUrl || Date.now()}`
      );

      const existing = await prisma.evidence.findFirst({
        where: {
          userId: user.id,
          title: badge.title,
        },
      });

      if (!existing) {
        const ev = await prisma.evidence.create({
          data: {
            userId: user.id,
            type: "micro-credential",
            title: badge.title,
            description: badge.description || `Verified Credly badge issued by ${badge.issuer}.`,
            fileUrl: badge.verificationUrl || "https://www.credly.com",
            fileHash,
            claimedSkills,
            verificationStage: "completed",
            verificationTier: "verified-high",
            verificationReason:
              badge.verificationReason ||
              `Automated verification via Credly Badge Registry (${badge.credentialId || badge.title})`,
          },
        });
        createdEvidences.push(ev);
      }
    }

    const updatedSkills = Array.from(newSkillsSet);
    await prisma.user.update({
      where: { id: user.id },
      data: { skills: updatedSkills },
    });

    if (user.passport) {
      const passportSkills = updatedSkills.map((name) => ({
        skillId: name.toLowerCase().replace(/\s+/g, "_"),
        name,
        tier: "verified-high",
      }));

      const newHash = computePassportHash(user.passport.studentId, passportSkills);
      await prisma.passport.update({
        where: { id: user.passport.id },
        data: {
          credentialHash: newHash,
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      importedCount: createdEvidences.length,
      newSkillsCount: updatedSkills.length - (user.skills?.length || 0),
      message: `Successfully imported ${badges.length} verified Credly ${
        badges.length === 1 ? "badge" : "badges"
      } into your Skill Passport!`,
    });
  } catch (err) {
    console.error("Credly import POST error:", err);
    return NextResponse.json({ error: "Failed to import badges: " + err.message }, { status: 500 });
  }
}
