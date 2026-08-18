// In-memory sliding-window bucket store
const rateLimitStore = new Map();

// Periodic garbage collection every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

export const RATE_LIMIT_PRESETS = {
  AUTH_LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 },
  REGISTRATION: { maxRequests: 5, windowMs: 60 * 60 * 1000 },
  PASSWORD_RESET: { maxRequests: 3, windowMs: 60 * 60 * 1000 },
  EMAIL_VERIFY: { maxRequests: 10, windowMs: 15 * 60 * 1000 },
  AI_GENERATION: { maxRequests: 10, windowMs: 10 * 60 * 1000 },
  PDF_EXPORT: { maxRequests: 5, windowMs: 5 * 60 * 1000 },
  FEED_SCRAPING: { maxRequests: 30, windowMs: 60 * 1000 },
  GENERAL_API: { maxRequests: 60, windowMs: 60 * 1000 },
};

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Extracts client IP from request headers or socket.
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  if (!request || !request.headers) return "127.0.0.1";

  // Check headers commonly set by reverse proxies & CDNs (Vercel, Cloudflare, AWS ALB)
  const xForwardedFor = request.headers.get?.("x-forwarded-for");
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    if (ips[0]) return ips[0];
  }

  const xRealIp = request.headers.get?.("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const cfConnectingIp = request.headers.get?.("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Checks and updates rate limit for a given key.
 *
 * @param {string} key - Unique rate limit identifier (e.g. "auth:192.168.1.1:user@example.com")
 * @param {number} maxRequests - Maximum requests allowed within the window
 * @param {number} windowMs - Window duration in milliseconds
 * @returns {{ success: boolean, limit: number, remaining: number, resetTime: number }}
 */
export function checkRateLimit(key, maxRequests = 5, windowMs = 15 * 60 * 1000) {
  cleanupExpiredEntries();

  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.resetTime <= now) {
    const record = {
      count: 1,
      resetTime: now + windowMs,
    };
    rateLimitStore.set(key, record);
    return {
      success: true,
      limit: maxRequests,
      remaining: Math.max(0, maxRequests - 1),
      resetTime: record.resetTime,
    };
  }

  if (existing.count >= maxRequests) {
    return {
      success: false,
      limit: maxRequests,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  existing.count += 1;
  return {
    success: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - existing.count),
    resetTime: existing.resetTime,
  };
}

/**
 * Resets the rate limit for a key (e.g. on successful login).
 * @param {string} key
 */
export function resetRateLimit(key) {
  rateLimitStore.delete(key);
}

/**
 * Standard HTTP 429 Too Many Requests response builder with Retry-After header.
 * @param {number} resetTime
 * @param {string} message
 * @returns {Response}
 */
export function createRateLimitResponse(
  resetTime,
  message = "Too many requests. Please slow down and try again later."
) {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetTime - Date.now()) / 1000));

  return Response.json(
    {
      error: message,
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Reset": String(resetTime),
      },
    }
  );
}
