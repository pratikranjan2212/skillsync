import crypto from "crypto";
import prisma from "../prisma.js";

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
