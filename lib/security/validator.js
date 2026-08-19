/**
 * SkillSync Comprehensive Input Validation & Sanitization Engine
 * Prevents Script Injection (XSS), SQL/NoSQL Injection, Path Traversal,
 * Command Injection, and Malicious File Uploads.
 */

const DANGEROUS_HTML_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
};

const ALLOWED_UPLOAD_EXTENSIONS = new Set(["pdf", "png", "jpg", "jpeg", "webp", "txt"]);
const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "text/plain",
]);
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Escapes dangerous HTML/script characters to prevent cross-site scripting (XSS).
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"'/`]/g, (char) => DANGEROUS_HTML_MAP[char] || char);
}

/**
 * Strips null bytes, non-printable control characters, and enforces length bounds.
 * @param {any} input
 * @param {number} maxLength
 * @returns {string}
 */
export function sanitizeString(input, maxLength = 1000) {
  if (input === null || input === undefined) return "";
  if (typeof input !== "string") {
    input = String(input);
  }
  // Strip null bytes and non-printable control characters (except newline \n and carriage return \r)
  const cleaned = input.replace(/\0/g, "").replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.slice(0, maxLength);
}

/**
 * Strict email validation and normalization.
 * @param {string} email
 * @returns {{ valid: boolean, email: string, error?: string }}
 */
export function validateAndSanitizeEmail(email) {
  if (!email || typeof email !== "string") {
    return { valid: false, email: "", error: "Email is required." };
  }

  const cleaned = email.toLowerCase().trim();
  if (cleaned.length > 254) {
    return { valid: false, email: "", error: "Email address is too long." };
  }

  // Strict RFC 5322 regex for standard web addresses
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(cleaned)) {
    return { valid: false, email: "", error: "Please enter a valid email address format." };
  }

  return { valid: true, email: cleaned };
}

/**
 * Validates and sanitizes resource IDs (CUID, UUID, standard slug identifiers).
 * Rejects path traversal and dangerous characters.
 * @param {string} id
 * @param {number} maxLength
 * @returns {{ valid: boolean, id: string }}
 */
export function sanitizeIdentifier(id, maxLength = 128) {
  if (!id || typeof id !== "string") return { valid: false, id: "" };
  const cleaned = id.trim();

  // Reject path traversal attempts
  if (cleaned.includes("..") || cleaned.includes("/") || cleaned.includes("\\") || cleaned.includes("%")) {
    return { valid: false, id: "" };
  }

  // Must only contain safe alphanumeric, hyphen, underscore, or colon
  if (!/^[a-zA-Z0-9_\-:]+$/.test(cleaned) || cleaned.length > maxLength) {
    return { valid: false, id: "" };
  }

  return { valid: true, id: cleaned };
}

/**
 * Validates URLs ensuring strict https/http protocol and prevents javascript:/data: injection.
 * @param {string} url
 * @param {boolean} allowRelative
 * @returns {{ valid: boolean, url: string }}
 */
export function sanitizeUrl(url, allowRelative = false) {
  if (!url || typeof url !== "string") return { valid: false, url: "" };
  const cleaned = url.trim();

  // Block dangerous pseudo-protocols
  const lower = cleaned.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return { valid: false, url: "" };
  }

  // Check for CRLF injection
  if (/[\r\n]/.test(cleaned)) {
    return { valid: false, url: "" };
  }

  if (allowRelative && cleaned.startsWith("/") && !cleaned.startsWith("//")) {
    return { valid: true, url: cleaned };
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { valid: false, url: "" };
    }
    return { valid: true, url: parsed.toString() };
  } catch (err) {
    return { valid: false, url: "" };
  }
}

/**
 * Validates profile image URLs and safe base64 image data URIs.
 * Allows valid https/http URLs and data:image/(jpeg|jpg|png|webp|gif);base64,... up to 5MB.
 * Rejects javascript:, file:, and SVG script injection vectors.
 * @param {string} image
 * @returns {{ valid: boolean, url: string }}
 */
export function sanitizeImageUrl(image) {
  if (!image || typeof image !== "string") return { valid: false, url: "" };
  const cleaned = image.trim();

  // Check for CRLF injection
  if (/[\r\n]/.test(cleaned)) {
    return { valid: false, url: "" };
  }

  // Support base64 image data URLs (up to 5MB)
  if (cleaned.startsWith("data:image/")) {
    const dataUrlRegex = /^data:image\/(jpeg|jpg|png|webp|gif);base64,[A-Za-z0-9+/=]+$/i;
    if (cleaned.length <= 5 * 1024 * 1024 && dataUrlRegex.test(cleaned)) {
      return { valid: true, url: cleaned };
    }
    return { valid: false, url: "" };
  }

  // Block dangerous pseudo-protocols
  const lower = cleaned.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:") ||
    lower.startsWith("data:")
  ) {
    return { valid: false, url: "" };
  }

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { valid: false, url: "" };
    }
    return { valid: true, url: parsed.toString() };
  } catch (err) {
    return { valid: false, url: "" };
  }
}

/**
 * Sanitizes and deduplicates a list of claimed skill strings.
 * @param {any[]} skills
 * @param {number} maxCount
 * @param {number} maxLengthPerSkill
 * @returns {string[]}
 */
export function sanitizeSkillList(skills, maxCount = 50, maxLengthPerSkill = 50) {
  if (!Array.isArray(skills)) return [];
  const sanitized = [];
  const seen = new Set();

  for (const raw of skills) {
    if (sanitized.length >= maxCount) break;
    const clean = sanitizeString(raw, maxLengthPerSkill).replace(/[^a-zA-Z0-9\s#+\.\-_/]/g, "").trim();
    if (clean && clean.length >= 1) {
      const key = clean.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        sanitized.push(clean);
      }
    }
  }

  return sanitized;
}

/**
 * Validates bounded integer inputs (e.g. limit, page).
 * @param {any} val
 * @param {number} min
 * @param {number} max
 * @param {number} defaultVal
 * @returns {number}
 */
export function sanitizeInteger(val, min = 1, max = 100, defaultVal = 20) {
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) return defaultVal;
  return Math.min(Math.max(parsed, min), max);
}

/**
 * Validates file upload metadata for safety against executable files & oversized payloads.
 * @param {object} fileParams
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateFileUpload({ fileName, mimeType, sizeBytes }) {
  if (!fileName || typeof fileName !== "string") {
    return { valid: false, error: "File name is missing or invalid." };
  }

  // Check file size
  if (typeof sizeBytes === "number" && sizeBytes > MAX_UPLOAD_SIZE_BYTES) {
    return { valid: false, error: `File size exceeds maximum allowed limit of ${MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB.` };
  }

  // Extract and check extension
  const extMatch = fileName.split(".").pop();
  const ext = (extMatch || "").toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) {
    return {
      valid: false,
      error: `File type .${ext} is not supported. Please upload one of: ${Array.from(ALLOWED_UPLOAD_EXTENSIONS).join(", ")}.`,
    };
  }

  // Validate MIME type if supplied
  if (mimeType && typeof mimeType === "string") {
    const cleanMime = mimeType.toLowerCase().trim();
    if (!ALLOWED_UPLOAD_MIME_TYPES.has(cleanMime)) {
      return { valid: false, error: `MIME type ${cleanMime} is not allowed.` };
    }
  }

  // Prevent path traversal in file names
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return { valid: false, error: "Malicious file name detected." };
  }

  return { valid: true };
}
