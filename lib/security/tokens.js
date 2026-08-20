import crypto from "crypto";
import prisma from "../prisma.js";

// ---------------------------------------------------------------------------
// OTP helpers
// ---------------------------------------------------------------------------

/**
 * Generates a cryptographically secure 6-digit OTP string.
 * @returns {string} e.g. "048372"
 */
export function generateOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

/**
 * Hashes a plaintext OTP with SHA-256 for safe storage.
 * @param {string} otp
 * @returns {string}
 */
function hashOtp(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

/**
 * Creates a 6-digit OTP, stores its hash in VerificationToken, and returns
 * the plaintext OTP to be sent to the user via email.
 *
 * @param {string} email
 * @returns {Promise<string>} Plaintext 6-digit OTP
 */
export async function createOtpToken(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const otp = generateOtp();
  const hashed = hashOtp(otp);
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const identifier = `otp-verify:${normalizedEmail}`;

  // Remove any existing OTP for this user before creating a new one
  try {
    await prisma.verificationToken.deleteMany({ where: { identifier } });
  } catch {
    // Ignore if no existing records
  }

  await prisma.verificationToken.create({
    data: { identifier, token: hashed, expires },
  });

  return otp; // Return plaintext — only this function ever sees it
}

/**
 * Validates a user-supplied OTP against the stored hash and deletes it
 * on success (single-use).
 *
 * @param {string} email
 * @param {string} otp  - Plaintext OTP entered by the user
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function validateAndConsumeOtp(email, otp) {
  if (!email || !otp) {
    return { valid: false, error: "Email and OTP are required." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const identifier = `otp-verify:${normalizedEmail}`;
  const hashed = hashOtp(String(otp).trim());

  try {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier, token: hashed },
    });

    if (!record) {
      return { valid: false, error: "Invalid OTP. Please check the code and try again." };
    }

    if (new Date(record.expires) <= new Date()) {
      await prisma.verificationToken
        .deleteMany({ where: { identifier } })
        .catch(() => {});
      return { valid: false, error: "This OTP has expired. Please request a new one." };
    }

    // Valid — delete so it cannot be reused
    await prisma.verificationToken
      .deleteMany({ where: { identifier } })
      .catch(() => {});

    return { valid: true };
  } catch (err) {
    console.error("OTP verification error:", err);
    return { valid: false, error: "An error occurred while validating the OTP." };
  }
}

/**
 * Generates a cryptographically secure random token (64 hex characters).
 * @returns {string}
 */
export function generateSecureToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Creates and stores an expiring verification or reset token.
 *
 * @param {string} email
 * @param {"email-verify" | "password-reset"} type
 * @param {number} expiryHours
 * @returns {Promise<string>} Plaintext token
 */
export async function createToken(email, type, expiryHours = 24) {
  const normalizedEmail = email.toLowerCase().trim();
  const token = generateSecureToken();
  const expires = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
  const identifier = `${type}:${normalizedEmail}`;

  // Clean up any existing tokens for this identifier and type
  try {
    await prisma.verificationToken.deleteMany({
      where: { identifier },
    });
  } catch (err) {
    // Ignore if no existing records found
  }

  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return token;
}

/**
 * Validates a token and deletes it upon successful consumption (single-use).
 *
 * @param {string} email
 * @param {"email-verify" | "password-reset"} type
 * @param {string} token
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function validateAndConsumeToken(email, type, token) {
  if (!email || !token) {
    return { valid: false, error: "Email and token are required." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const identifier = `${type}:${normalizedEmail}`;

  try {
    const record = await prisma.verificationToken.findFirst({
      where: {
        identifier,
        token,
      },
    });

    if (!record) {
      return { valid: false, error: "Invalid or expired token." };
    }

    if (new Date(record.expires) <= new Date()) {
      // Token is expired - remove it
      await prisma.verificationToken.deleteMany({
        where: { identifier, token },
      }).catch(() => {});
      return { valid: false, error: "This token has expired. Please request a new one." };
    }

    // Token is valid - delete it so it cannot be reused
    await prisma.verificationToken.deleteMany({
      where: { identifier, token },
    }).catch(() => {});

    return { valid: true };
  } catch (err) {
    console.error("Token verification error:", err);
    return { valid: false, error: "An error occurred while validating the token." };
  }
}
