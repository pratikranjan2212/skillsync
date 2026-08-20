import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAndConsumeOtp } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

/**
 * POST /api/auth/verify-email
 * Body: { email: string, otp: string }
 *
 * Validates the 6-digit OTP entered by the user and marks their email as verified.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);

    // Rate limit: 10 attempts per 15 minutes per IP to prevent brute-force
    const rateLimit = checkRateLimit(`verify-otp:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "POST",
        details: { reason: "OTP verification rate limit exceeded" },
      });
      return createRateLimitResponse(rateLimit.resetTime);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await validateAndConsumeOtp(normalizedEmail, otp);

    if (!result.valid) {
      logSecurityEvent(SecurityEvent.ACCESS_DENIED_FORBIDDEN, LogLevel.WARN, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "POST",
        details: { reason: "Invalid OTP used", email: normalizedEmail },
      });
      return NextResponse.json(
        { error: result.error || "Invalid OTP. Please try again." },
        { status: 400 }
      );
    }

    // Mark email as verified
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { emailVerified: new Date() },
    });

    logSecurityEvent(SecurityEvent.AUTH_EMAIL_VERIFIED, LogLevel.INFO, {
      ip: clientIp,
      user: { id: updatedUser.id, email: updatedUser.email },
      route: "/api/auth/verify-email",
      method: "POST",
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now sign in.",
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/auth/verify-email",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to verify email." }, { status: 500 });
  }
}
