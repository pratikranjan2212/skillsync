import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePassword, hashPassword } from "@/lib/security/password";
import { validateAndConsumeToken } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, token, password } = body;

    if (!email || !token || !password) {
      return NextResponse.json(
        { error: "Email, reset token, and new password are required." },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`reset-pwd:${clientIp}`, 5, 15 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/reset-password",
        method: "POST",
        details: { reason: "Reset password attempt rate limit exceeded" },
      });
      return createRateLimitResponse(rateLimit.resetTime);
    }

    // Validate new password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: "Password does not meet security requirements.", details: passwordValidation.errors },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Validate and consume the reset token (single-use)
    const tokenResult = await validateAndConsumeToken(normalizedEmail, "password-reset", token);
    if (!tokenResult.valid) {
      logSecurityEvent(SecurityEvent.ACCESS_DENIED_FORBIDDEN, LogLevel.WARN, {
        ip: clientIp,
        route: "/api/auth/reset-password",
        method: "POST",
        details: { reason: "Invalid or expired reset token attempted", email: normalizedEmail },
      });
      return NextResponse.json(
        { error: tokenResult.error || "Invalid or expired reset token." },
        { status: 400 }
      );
    }

    // Hash the new password with 12 salt rounds
    const newPasswordHash = await hashPassword(password);

    // Update user's password
    const updatedUser = await prisma.user.update({
      where: { email: normalizedEmail },
      data: { passwordHash: newPasswordHash },
    });

    logSecurityEvent(SecurityEvent.AUTH_PASSWORD_RESET_SUCCESS, LogLevel.INFO, {
      ip: clientIp,
      user: { id: updatedUser.id, email: updatedUser.email },
      route: "/api/auth/reset-password",
      method: "POST",
    });

    return NextResponse.json({
      success: true,
      message: "Your password has been successfully reset. Please sign in with your new password.",
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/auth/reset-password",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to reset password." }, { status: 500 });
  }
}
