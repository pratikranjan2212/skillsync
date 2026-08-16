import crypto from "crypto";

/**
 * Computes a standard SHA-256 hash for a given string or Buffer.
 * @param {string | Buffer} input
 * @returns {string} SHA-256 hex string prefixed with 'sha256:'
 */
export function computeSha256(input) {
  if (!input) {
    const randomSalt = crypto.randomBytes(16).toString("hex");
    return `sha256:${crypto.createHash("sha256").update(randomSalt).digest("hex")}`;
  }

  const hash = crypto.createHash("sha256").update(input).digest("hex");
  return `sha256:${hash}`;
}

/**
 * Computes a deterministic passport hash from a student's verified skills list.
 * @param {string} studentId
 * @param {Array<{ skillId: string, name: string, tier: string }>} skills
 * @returns {string}
 */
export function computePassportHash(studentId, skills = []) {
  const serialized = `${studentId}:${skills
    .map((s) => `${s.name || s.skillId}_${s.tier || "high"}`)
    .sort()
    .join(";")}`;

  const hex = crypto.createHash("sha256").update(serialized).digest("hex");
  return `0x${hex.substring(0, 40).toUpperCase()}`;
}
