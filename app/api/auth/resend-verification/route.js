import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createOtpToken } from "@/lib/security/tokens";
import { sendOtpEmail } from "@/lib/email/mailer";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";

/**
 * POST /api/auth/resend-verification
 * Body: { email: string }
 *
 * Generates a fresh 6-digit OTP and emails it to the user.
 * Always returns a generic success to prevent email enumeration attacks.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 3 resend attempts per 15 minutes per IP + email
    const rateLimit = checkRateLimit(`resend-otp:${clientIp}:${normalizedEmail}`, 3, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit.resetTime, "Too many verification requests. Please wait a few minutes.");
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Only send if user exists, is credentials-based, and is not already verified
    if (user && !user.emailVerified) {
      const otp = await createOtpToken(normalizedEmail);
      await sendOtpEmail(normalizedEmail, otp, user.name).catch((err) => {
        console.error("Resend OTP email error:", err.message);
      });
    }

    // Always return generic success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an unverified account with this email exists, a new OTP has been sent.",
    });
  } catch (err) {
    console.error("Resend OTP error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
