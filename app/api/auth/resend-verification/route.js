import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: 3 resend attempts per 15 minutes per IP/email
    const rateLimit = checkRateLimit(`resend-verify:${clientIp}:${normalizedEmail}`, 3, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return createRateLimitResponse(rateLimit.resetTime, "Too many verification requests. Please wait a few minutes.");
    }

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // If user exists and is not already verified, issue new token
    if (user && !user.emailVerified) {
      const token = await createToken(normalizedEmail, "email-verify", 24);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[DEV SECURITY LOG] Verification Link for ${normalizedEmail}: /verify-email?token=${token}&email=${encodeURIComponent(normalizedEmail)}`);
      }
    }

    // Always return generic success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: "If an unverified account with this email exists, a verification link has been sent.",
    });
  } catch (err) {
    console.error("Resend verification error:", err);
    return NextResponse.json({ error: "Failed to process request." }, { status: 500 });
  }
}
