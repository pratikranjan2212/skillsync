import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { runVerificationPipeline } from "@/lib/verification/pipeline";

export async function GET(request) {
  try {
    const session = await auth();
    let userEmail = session?.user?.email;

    let user = null;
    if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    }

    if (user) {
      const evidenceList = await prisma.evidence.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      return NextResponse.json({ success: true, evidence: evidenceList || [] });
    }

    // Unauthenticated fallback
    const allEvidence = await prisma.evidence.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, evidence: allEvidence || [] });
  } catch (err) {
    console.warn("DB Evidence GET fallback:", err.message);
    return NextResponse.json({ success: true, evidence: [] });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const body = await request.json();
    const verifiedData = await runVerificationPipeline(body);

    let userEmail = session?.user?.email;
    let student = null;

    if (userEmail) {
      student = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    }

    if (!student) {
      student = await prisma.user.findFirst({
        where: { role: "student" },
      });
    }

    if (!student) {
      student = await prisma.user.create({
        data: {
          name: session?.user?.name || "Student User",
          email: userEmail || "student@skillsync.edu",
          role: "student",
        },
      });
    }

    const created = await prisma.evidence.create({
      data: {
        userId: student.id,
        type: verifiedData.type,
        title: verifiedData.title,
        description: verifiedData.description,
        fileUrl: verifiedData.fileUrl,
        fileHash: verifiedData.fileHash,
        verificationTier: verifiedData.verificationTier,
        verificationReason: verifiedData.verificationReason,
        verificationStage: verifiedData.verificationStage,
        verifiedAt: new Date(verifiedData.verifiedAt),
        adminOverride: false,
        claimedSkills: verifiedData.claimedSkills || [],
      },
    });

    // Automatically sync claimed skills to User profile skills
    if (verifiedData.claimedSkills && verifiedData.claimedSkills.length > 0) {
      try {
        const currentSkills = student.skills || [];
        const mergedSkills = Array.from(
          new Set([...currentSkills, ...verifiedData.claimedSkills.map((s) => s.trim())])
        ).filter(Boolean);

        await prisma.user.update({
          where: { id: student.id },
          data: { skills: mergedSkills },
        });
      } catch (skillErr) {
        console.warn("Could not sync user skills:", skillErr.message);
      }
    }

    // Ensure passport exists and update timestamp & hash
    try {
      const studentTag = `SS-${new Date().getFullYear()}-${student.id.substring(0, 6).toUpperCase()}`;
      const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;
      const newHash = `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`;

      await prisma.passport.upsert({
        where: { userId: student.id },
        update: {
          updatedAt: new Date(),
          credentialHash: newHash,
        },
        create: {
          userId: student.id,
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

    return NextResponse.json({ success: true, evidence: created }, { status: 201 });
  } catch (err) {
    console.error("Evidence submission error:", err);
    return NextResponse.json({ error: "Failed to submit evidence" }, { status: 400 });
  }
}
