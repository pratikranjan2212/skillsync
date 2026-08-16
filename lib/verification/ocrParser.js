import { env } from "@/lib/config/env";

/**
 * Common academic & technical skill keywords for pattern matching.
 */
const KNOWN_SKILL_PATTERNS = [
  { pattern: /\bpython\b/i, skill: "Python" },
  { pattern: /\bsql\b|\bdatabase\b|\brdbms\b|\bpostgresql\b/i, skill: "SQL" },
  { pattern: /\breact\b|\breact\.js\b/i, skill: "React.js" },
  { pattern: /\btensorflow\b|\bkeras\b|\bdeep learning\b/i, skill: "TensorFlow" },
  { pattern: /\bdocker\b|\bcontainerization\b/i, skill: "Docker" },
  { pattern: /\brest api\b|\bapi design\b|\bgraphql\b/i, skill: "REST API design" },
  { pattern: /\btailwind\b|\bcss3\b/i, skill: "Tailwind CSS" },
  { pattern: /\bdata engineering\b|\betl\b|\bpandas\b|\bspark\b/i, skill: "Data Engineering" },
  { pattern: /\bnode\.js\b|\bexpress\b/i, skill: "Node.js" },
  { pattern: /\bmachine learning\b|\bai\b|\bneural network/i, skill: "Deep Learning" },
];

/**
 * Parses certificate or transcript text via OCR.Space or fallback regex heuristic.
 * @param {string} fileUrl
 * @param {string} rawText
 * @returns {Promise<{ isVerified: boolean, tier: string, reason: string, extractedSkills: string[] }>}
 */
export async function parseDocumentOcr(fileUrl = "", rawText = "") {
  let text = rawText || "";

  // 1. If OCR.Space API Key is available and fileUrl is provided, call OCR.Space API
  if (env.ocrSpaceApiKey && fileUrl && fileUrl.startsWith("http")) {
    try {
      const formData = new URLSearchParams();
      formData.append("apikey", env.ocrSpaceApiKey);
      formData.append("url", fileUrl);
      formData.append("language", "eng");
      formData.append("isOverlayRequired", "false");

      const res = await fetch("https://api.ocr.space/parse/image", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.ParsedResults?.[0]?.ParsedText) {
          text += ` ${data.ParsedResults[0].ParsedText}`;
        }
      }
    } catch (err) {
      console.warn("OCR.Space API call fallback:", err.message);
    }
  }

  // 2. Extract technical skills matching taxonomy
  const detectedSkills = new Set();
  const searchSource = `${fileUrl} ${text}`.toLowerCase();

  for (const { pattern, skill } of KNOWN_SKILL_PATTERNS) {
    if (pattern.test(searchSource)) {
      detectedSkills.add(skill);
    }
  }

  const extractedSkills = Array.from(detectedSkills);

  // 3. Determine tier based on document markers
  const hasAcademicMarker =
    searchSource.includes("grade") ||
    searchSource.includes("gpa") ||
    searchSource.includes("certificate") ||
    searchSource.includes("transcript") ||
    searchSource.includes("completed") ||
    searchSource.includes("university") ||
    searchSource.includes("coursera");

  if (hasAcademicMarker || extractedSkills.length > 0) {
    return {
      isVerified: true,
      tier: "verified-medium",
      reason: `OCR-parsed document verification completed (${extractedSkills.join(", ") || "Academic verification match"})`,
      extractedSkills,
    };
  }

  return {
    isVerified: false,
    tier: "flagged-low",
    reason: "Document text analysis did not identify verifiable institutional credentials",
    extractedSkills: [],
  };
}
