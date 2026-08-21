import { computeSha256 } from "@/lib/verification/cryptoHash";
import { verifyQrPayload } from "@/lib/verification/qrVerifier";
import { verifyGitHubEvidence } from "@/lib/verification/githubCheck";
import { parseDocumentOcr } from "@/lib/verification/ocrParser";

/**
 * Runs multi-stage automated verification pipeline on an evidence submission.
 * @param {object} submission
 * @returns {Promise<object>}
 */
export async function runVerificationPipeline(submission) {
  const {
    type = "project",
    title = "Submitted Evidence",
    description = "",
    fileUrl = "",
    rawContent = null,
    hasQrCode = false,
    qrData = null,
    claimedSkills = [],
  } = submission;

  // 1. Generate SHA-256 cryptographic file / record hash
  const fileHash = computeSha256(rawContent || fileUrl || `${title}_${description}_${Date.now()}`);

  const mergedSkills = new Set(
    Array.isArray(claimedSkills)
      ? claimedSkills.map((s) => (typeof s === "string" ? s.trim() : s.name)).filter(Boolean)
      : []
  );

  let verificationTier = "flagged-low";
  let verificationReason = "Self-submitted evidence without automated digital signature verification";
  let verificationStage = "flagged_review";

  // Stage 1: QR Code and Registry Signature Verification
  if (hasQrCode || qrData || fileUrl?.includes("/verify") || fileUrl?.includes("/badges/")) {
    const qrResult = verifyQrPayload(qrData || fileUrl);
    if (qrResult.isVerified) {
      verificationTier = qrResult.tier;
      verificationReason = qrResult.reason;
      verificationStage = "completed";
    }
  }

  // Stage 2: GitHub Repository & Commit Cross-Check
  if (
    (verificationTier === "flagged-low" || fileUrl?.includes("github.com")) &&
    fileUrl?.includes("github.com")
  ) {
    const ghResult = await verifyGitHubEvidence(fileUrl);
    if (ghResult.isVerified) {
      verificationTier = ghResult.tier;
      verificationReason = ghResult.reason;
      verificationStage = "completed";

      ghResult.languages.forEach((lang) => mergedSkills.add(lang));
    }
  }

  // Stage 3: OCR Academic Transcript / Certificate Analysis
  if (
    verificationTier === "flagged-low" &&
    (type === "coursework" || type === "micro-credential" || fileUrl?.length > 10)
  ) {
    const ocrResult = await parseDocumentOcr(fileUrl, `${title} ${description}`);
    if (ocrResult.isVerified) {
      verificationTier = ocrResult.tier;
      verificationReason = ocrResult.reason;
      verificationStage = "completed";

      ocrResult.extractedSkills.forEach((skill) => mergedSkills.add(skill));
    }
  }

  // Default fallback if minimal information provided
  if (!fileUrl || fileUrl.length < 5) {
    verificationTier = "flagged-low";
    verificationReason = "Self-submitted record missing digital evidence URL or signature";
    verificationStage = "flagged_review";
  }

  return {
    type,
    title,
    description,
    fileUrl,
    fileHash,
    verificationTier,
    verificationReason,
    verificationStage,
    verifiedAt: new Date().toISOString(),
    adminOverride: false,
    claimedSkills: Array.from(mergedSkills),
  };
}
