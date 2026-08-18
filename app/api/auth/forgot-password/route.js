import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 3 password reset requests per hour per IP/email
    const rateLimit = checkRateLimit(`forgot-pwd:${clientIp}:${normalizedEmail}`, 3, 60 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/forgot-password",
        method: "POST",
        details: { reason: "Forgot password rate limit exceeded", email: normalizedEmail },
      });
      return createRateLimitResponse(rateLimit.resetTime, "Too many password reset requests. Please wait an hour.");
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    logSecurityEvent(SecurityEvent.AUTH_PASSWORD_RESET_REQUEST, LogLevel.INFO, {
      ip: clientIp,
      route: "/api/auth/forgot-password",
      method: "POST",
      details: { accountFound: Boolean(user && user.passwordHash) },
    });

    // Only generate reset token if user exists and has a password
    if (user && user.passwordHash) {
      const resetToken = await createToken(normalizedEmail, "password-reset", 1); // 1 hour expiry
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV SECURITY LOG] Password Reset Link for ${normalizedEmail}: /reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`);
      }
    }

    // Always return constant-time generic response to prevent user enumeration
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, password reset instructions have been generated.",
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/auth/forgot-password",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to process password reset request." }, { status: 500 });
  }
}
