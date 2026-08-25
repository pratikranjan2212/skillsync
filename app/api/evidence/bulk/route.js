import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { runVerificationPipeline } from "@/lib/verification/pipeline";
import { sanitizeString, sanitizeUrl, sanitizeSkillList } from "@/lib/security/validator";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

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
        evidences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const { items = [] } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No certificate items provided to import." }, { status: 400 });
    }

    const existingEvidences = user.evidences || [];
    const createdList = [];
    const allNewSkills = new Set(user.skills || []);

    for (const rawItem of items) {
      const sanitizedTitle = sanitizeString(rawItem.title || "Course Certificate", 200);
      const sanitizedDescription = sanitizeString(rawItem.description || "", 2000);
      const sanitizedType = sanitizeString(rawItem.type || "micro-credential", 50);
      const sanitizedSkills = sanitizeSkillList(rawItem.skills || rawItem.claimedSkills || [], 30, 50);
      const validatedFileUrl = rawItem.fileUrl && typeof rawItem.fileUrl === "string" ? rawItem.fileUrl : "";

      // Check if duplicate title exists in current records
      const isDuplicateTitle = existingEvidences.some(
        (ev) => ev.title.trim().toLowerCase() === sanitizedTitle.trim().toLowerCase()
      );

      if (isDuplicateTitle) {
        continue;
      }

      const verifiedData = await runVerificationPipeline({
        type: sanitizedType,
        title: sanitizedTitle,
        description: sanitizedDescription,
        fileUrl: validatedFileUrl,
        claimedSkills: sanitizedSkills,
        hasQrCode: true,
      });

      const created = await prisma.evidence.create({
        data: {
          userId: user.id,
          type: verifiedData.type,
          title: verifiedData.title,
          description: verifiedData.description,
          fileUrl: verifiedData.fileUrl || "",
          fileHash: verifiedData.fileHash,
          verificationTier: "verified-high",
          verificationReason: rawItem.verificationReason || verifiedData.verificationReason || `Multimodal Gemini AI verified credential extraction`,
          verificationStage: "completed",
          verifiedAt: new Date(),
          adminOverride: false,
          claimedSkills: verifiedData.claimedSkills || [],
        },
      });

      createdList.push(created);

      // Collect skills for user profile merge
      if (verifiedData.claimedSkills && Array.isArray(verifiedData.claimedSkills)) {
        verifiedData.claimedSkills.forEach((s) => allNewSkills.add(s.trim()));
      }
    }

    // Sync updated skills to user
    if (allNewSkills.size > (user.skills || []).length) {
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { skills: Array.from(allNewSkills).filter(Boolean) },
        });
      } catch (skillErr) {
        console.warn("Could not sync user skills:", skillErr.message);
      }
    }

    // Update passport timestamp & hash
    try {
      const studentTag = `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`;
      const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;
      const newHash = `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`;

      await prisma.passport.upsert({
        where: { userId: user.id },
        update: {
          updatedAt: new Date(),
          credentialHash: newHash,
        },
        create: {
          userId: user.id,
          studentId: studentTag,
          isPublic: true,
          shareToken,
          credentialHash: newHash,
          issuer: "SkillSync Verifiable Credential Engine",
        },
      });
    } catch (passErr) {
      console.warn("Could not update passport state:", passErr.message);
    }

    return NextResponse.json({
      success: true,
      count: createdList.length,
      created: createdList,
      message: `Successfully imported ${createdList.length} verified ${createdList.length === 1 ? "certificate" : "certificates"} to your Skill Passport.`,
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/evidence/bulk",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to import certificates: " + (err.message || String(err)) }, { status: 500 });
  }
}
