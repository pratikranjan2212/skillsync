import { NextResponse } from "next/server";
import { INITIAL_EVIDENCE } from "@/app/data/mockData";

// In-memory state for mock API persistence during session
let evidenceStore = [...INITIAL_EVIDENCE];

export async function GET(request) {
  // TODO: replace mock once /api/evidence backend service is live
  return NextResponse.json({ success: true, evidence: evidenceStore });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, title, description, fileUrl, claimedSkills = [], hasQrCode } = body;

    // Automated verification tier decision logic
    let tier = "verified-medium";
    let reason = "OCR-parsed document verification completed";

    if (hasQrCode || fileUrl?.includes("github.com") || fileUrl?.includes("coursera")) {
      tier = "verified-high";
      reason = "QR-confirmed institutional digital signature match";
    } else if (!fileUrl || fileUrl.length < 5) {
      tier = "flagged-low";
      reason = "Self-submitted link missing digital signature";
    }

    const newEvidence = {
      id: `ev-${Date.now()}`,
      studentId: "std-101",
      type: type || "coursework",
      title: title || "Submitted Evidence",
      description: description || "",
      fileUrl: fileUrl || "",
      fileHash: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      verificationTier: tier,
      verificationReason: reason,
      verificationStage: "completed",
      verifiedAt: new Date().toISOString(),
      adminOverride: null,
      claimedSkills: claimedSkills,
    };

    evidenceStore.unshift(newEvidence);

    return NextResponse.json({ success: true, evidence: newEvidence }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Failed to submit evidence" }, { status: 400 });
  }
}
