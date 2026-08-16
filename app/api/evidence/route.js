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

    return NextResponse.json({ success: true, evidence: created }, { status: 201 });
  } catch (err) {
    console.error("Evidence submission error:", err);
    return NextResponse.json({ error: "Failed to submit evidence" }, { status: 400 });
  }
}
