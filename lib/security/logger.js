/**
 * SkillSync Production Security & Audit Logging Engine
 * Provides structured JSON logging for authentication events, API exceptions,
 * rate limit violations, and suspicious traffic anomalies.
 */

import { getClientIp } from "./rateLimit.js";

export const LogLevel = {
  INFO: "INFO",
  WARN: "WARN",
  ALERT: "SECURITY_ALERT",
  ERROR: "ERROR",
};

export const SecurityEvent = {
  AUTH_SIGNIN_SUCCESS: "AUTH_SIGNIN_SUCCESS",
  AUTH_SIGNIN_FAILURE: "AUTH_SIGNIN_FAILURE",
  AUTH_REGISTRATION_SUCCESS: "AUTH_REGISTRATION_SUCCESS",
  AUTH_PASSWORD_RESET_REQUEST: "AUTH_PASSWORD_RESET_REQUEST",
  AUTH_PASSWORD_RESET_SUCCESS: "AUTH_PASSWORD_RESET_SUCCESS",
  AUTH_EMAIL_VERIFIED: "AUTH_EMAIL_VERIFIED",
  AUTH_RATE_LIMIT_EXCEEDED: "AUTH_RATE_LIMIT_EXCEEDED",
  ACCESS_DENIED_UNAUTHORIZED: "ACCESS_DENIED_UNAUTHORIZED",
  ACCESS_DENIED_FORBIDDEN: "ACCESS_DENIED_FORBIDDEN",
  IDOR_ATTEMPT_BLOCKED: "IDOR_ATTEMPT_BLOCKED",
  API_ERROR_500: "API_ERROR_500",
  SUSPICIOUS_TRAFFIC_DETECTED: "SUSPICIOUS_TRAFFIC_DETECTED",
};

// In-memory tracker for detecting anomalous traffic bursts
const anomalyTracker = new Map();
const ANOMALY_WINDOW_MS = 60 * 1000; // 1 minute
const ANOMALY_THRESHOLD = 30; // 30 suspicious events/min from same IP triggers alert

/**
 * Strips sensitive fields (passwords, tokens, secrets) before logging.
 */
function sanitizeDetails(details = {}) {
  if (!details || typeof details !== "object") return details;
  const sanitized = { ...details };
  const sensitiveKeys = ["password", "token", "secret", "passwordHash", "access_token", "refresh_token", "apiKey"];

  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof sanitized[key] === "object" && sanitized[key] !== null) {
      sanitized[key] = sanitizeDetails(sanitized[key]);
    }
  }
  return sanitized;
}

/**
 * Checks for rapid anomalies from a specific client IP.
 */
function trackAnomaly(ip, eventType) {
  const now = Date.now();
  const existing = anomalyTracker.get(ip) || [];
  const recent = existing.filter((t) => now - t < ANOMALY_WINDOW_MS);
  recent.push(now);
  anomalyTracker.set(ip, recent);

  if (recent.length >= ANOMALY_THRESHOLD) {
    // Log elevated security alert
    logSecurityEvent(SecurityEvent.SUSPICIOUS_TRAFFIC_DETECTED, LogLevel.ALERT, {
      ip,
      reason: `High frequency of suspicious actions (${recent.length} events in 1 minute). Possible brute-force or scanner activity.`,
      lastEvent: eventType,
    });
    // Reset tracker for this IP to prevent duplicate flooding of alert
    anomalyTracker.delete(ip);
  }
}

/**
 * Emits a structured security log entry to stderr/stdout or centralized SIEM.
 *
 * @param {string} event - One of SecurityEvent constants
 * @param {string} level - One of LogLevel constants (INFO, WARN, ALERT, ERROR)
 * @param {object} payload - Metadata including ip, user, route, details
 */
export function logSecurityEvent(event, level = LogLevel.INFO, payload = {}) {
  const { ip, user, route, method, details, error } = payload;

  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    level,
    ip: ip || "unknown",
    user: user ? { id: user.id || null, email: user.email || null } : null,
    route: route || null,
    method: method || null,
    details: sanitizeDetails(details),
    ...(error ? { error: error.message || String(error) } : {}),
  };

  const formattedOutput = JSON.stringify(logEntry);

  if (level === LogLevel.ALERT || level === LogLevel.ERROR) {
    console.error(`[SECURITY_ENGINE] ${formattedOutput}`);
  } else if (level === LogLevel.WARN) {
    console.warn(`[SECURITY_ENGINE] ${formattedOutput}`);
  } else {
    console.log(`[SECURITY_ENGINE] ${formattedOutput}`);
  }

  // Trigger anomaly tracking on security warnings & failures
  if (ip && (level === LogLevel.WARN || level === LogLevel.ALERT)) {
    trackAnomaly(ip, event);
  }

  return logEntry;
}

/**
 * Helper to log security events directly from Next.js route handlers.
 * @param {Request} request
 * @param {string} event
 * @param {string} level
 * @param {object} metadata
 */
export function logRouteSecurity(request, event, level = LogLevel.INFO, metadata = {}) {
  const ip = getClientIp(request);
  const route = request?.nextUrl?.pathname || request?.url || "unknown";
  const method = request?.method || "GET";

  return logSecurityEvent(event, level, {
    ip,
    route,
    method,
    ...metadata,
  });
}
