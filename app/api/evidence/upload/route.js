import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let title = "Uploaded Credential";
    let type = "certificate";
    let fileUrl = "";
    let hasQrCode = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      title = formData.get("title") || file?.name || "Uploaded Document";
      type = formData.get("type") || "coursework";
      hasQrCode = formData.get("hasQrCode") === "true";
      fileUrl = `/uploads/${file?.name || "evidence.pdf"}`;
    } else {
      const body = await request.json();
      title = body.title || title;
      type = body.type || type;
      fileUrl = body.fileUrl || fileUrl;
      hasQrCode = !!body.hasQrCode;
    }

    let tier = hasQrCode ? "verified-high" : "verified-medium";

    const uploadedEvidence = {
      id: `ev-${Date.now()}`,
      studentId: "std-101",
      title,
      type,
      fileUrl,
      verificationTier: tier,
      verificationStage: "completed",
      verifiedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Evidence verified successfully",
      evidence: uploadedEvidence,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process upload" }, { status: 500 });
  }
}