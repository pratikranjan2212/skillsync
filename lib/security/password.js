import bcrypt from "bcryptjs";

const BCRYPT_SALT_ROUNDS = 12;

/**
 * Validates password strength against security standards.
 * Enforces:
 * - 8 to 128 characters (upper bound prevents DoS via hash computation)
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 numeric digit (0-9)
 * - At least 1 special character (!@#$%^&*()_+-=[]{};':"|,.<>/?`~)
 *
 * @param {string} password
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validatePassword(password) {
  const errors = [];

  if (!password || typeof password !== "string") {
    return { valid: false, errors: ["Password is required."] };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  }

  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one numeric digit (0-9).");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Hashes a plaintext password using bcrypt with 12 salt rounds.
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hashPassword(password) {
  const validation = validatePassword(password);
  if (!validation.valid) {
    throw new Error(`Password does not meet security requirements: ${validation.errors.join(" ")}`);
  }
  return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored bcrypt hash.
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(password, hash) {
  if (!password || !hash || typeof password !== "string" || typeof hash !== "string") {
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
