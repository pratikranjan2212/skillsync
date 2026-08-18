import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateAndConsumeToken } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email parameters are required." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`verify-email:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "GET",
        details: { reason: "Email verification rate limit exceeded" },
      });
      return createRateLimitResponse(rateLimit.resetTime);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await validateAndConsumeToken(normalizedEmail, "email-verify", token);

    if (!result.valid) {
      logSecurityEvent(SecurityEvent.ACCESS_DENIED_FORBIDDEN, LogLevel.WARN, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "GET",
        details: { reason: "Invalid verification token used", email: normalizedEmail },
      });
      return NextResponse.json({ error: result.error || "Invalid verification token." }, { status: 400 });
    }

    // Update user record
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { emailVerified: new Date() },
    });

    logSecurityEvent(SecurityEvent.AUTH_EMAIL_VERIFIED, LogLevel.INFO, {
      ip: clientIp,
      user: { id: updatedUser.id, email: updatedUser.email },
      route: "/api/auth/verify-email",
      method: "GET",
    });

    return NextResponse.json({
      success: true,
      message: "Email verified successfully. You can now access all features.",
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/auth/verify-email",
      method: "GET",
      error: err,
    });
    return NextResponse.json({ error: "Failed to verify email." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token } = body;

    if (!token || !email) {
      return NextResponse.json(
        { error: "Token and email are required." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`verify-email:${clientIp}`, 10, 15 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "POST",
        details: { reason: "Email verification rate limit exceeded" },
      });
      return createRateLimitResponse(rateLimit.resetTime);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const result = await validateAndConsumeToken(normalizedEmail, "email-verify", token);

    if (!result.valid) {
      logSecurityEvent(SecurityEvent.ACCESS_DENIED_FORBIDDEN, LogLevel.WARN, {
        ip: clientIp,
        route: "/api/auth/verify-email",
        method: "POST",
        details: { reason: "Invalid verification token used", email: normalizedEmail },
      });
      return NextResponse.json({ error: result.error || "Invalid verification token." }, { status: 400 });
    }

    // Update user record
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
      message: "Email verified successfully.",
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
