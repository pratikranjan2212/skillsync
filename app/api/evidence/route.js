import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runVerificationPipeline } from "@/lib/verification/pipeline";
import { INITIAL_EVIDENCE } from "@/app/data/mockData";

let fallbackStore = [...INITIAL_EVIDENCE];

export async function GET(request) {
  try {
    const evidenceList = await prisma.evidence.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (evidenceList && evidenceList.length > 0) {
      return NextResponse.json({ success: true, evidence: evidenceList });
    }
  } catch (err) {
    console.warn("DB Evidence GET fallback (offline mode):", err.message);
  }

  return NextResponse.json({ success: true, evidence: fallbackStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const verifiedData = await runVerificationPipeline(body);

    try {
      // Attempt to find demo student user
      let student = await prisma.user.findFirst({
        where: { role: "student" },
      });

      if (!student) {
        student = await prisma.user.create({
          data: {
            name: "Alex Chen",
            email: "alex.chen@skillsync.edu",
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
          claimedSkills: verifiedData.claimedSkills,
        },
      });

      fallbackStore.unshift({ ...created, studentId: student.id });
      return NextResponse.json({ success: true, evidence: created }, { status: 201 });
    } catch (dbErr) {
      console.warn("DB Evidence POST fallback (offline mode):", dbErr.message);

      const fallbackItem = {
        id: `ev-${Date.now()}`,
        studentId: "std-101",
        ...verifiedData,
      };

      fallbackStore.unshift(fallbackItem);
      return NextResponse.json({ success: true, evidence: fallbackItem }, { status: 201 });
    }
  } catch (err) {
    console.error("Evidence submission error:", err);
    return NextResponse.json({ error: "Failed to submit evidence" }, { status: 400 });
  }
}
