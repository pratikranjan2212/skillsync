import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validatePassword, hashPassword } from "@/lib/security/password";
import { createToken } from "@/lib/security/tokens";
import { checkRateLimit, createRateLimitResponse, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";
import { validateHoneypot } from "@/lib/security/botProtection";

export async function POST(request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limit: 5 registrations per hour per IP
    const rateLimit = checkRateLimit(`register:${clientIp}`, 5, 60 * 60 * 1000);
    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/register",
        method: "POST",
        details: { reason: "Registration rate limit exceeded" },
      });
      return createRateLimitResponse(rateLimit.resetTime, "Too many registration attempts. Please try again later.");
    }

    const body = await request.json();

    // Honeypot bot protection: if hidden field is filled, silently drop automated bot submission
    if (!validateHoneypot(body, "website_hp")) {
      logSecurityEvent(SecurityEvent.SUSPICIOUS_TRAFFIC_DETECTED, LogLevel.ALERT, {
        ip: clientIp,
        route: "/api/auth/register",
        method: "POST",
        details: { reason: "Bot detected via honeypot trap field (website_hp)" },
      });
      return NextResponse.json(
        { success: true, message: "Registration processed.", verificationRequired: true },
        { status: 200 }
      );
    }

    const { fullName, email, password } = body;

    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: "Full name, email, and password are required." },
        { status: 400 }
      );
    }

    const trimmedName = sanitizeString(fullName, 100);
    if (trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Full name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    const emailCheck = validateAndSanitizeEmail(email);
    if (!emailCheck.valid) {
      return NextResponse.json(
        { error: emailCheck.error || "Please provide a valid email address." },
        { status: 400 }
      );
    }
    const normalizedEmail = emailCheck.email;

    // Validate password complexity
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: "Password does not meet security requirements.",
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password with 12 salt rounds
    const passwordHash = await hashPassword(password);

    const studentTag = `SS-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;

    const newUser = await prisma.user.create({
      data: {
        name: trimmedName,
        email: normalizedEmail,
        passwordHash,
        role: "student",
        passport: {
          create: {
            studentId: studentTag,
            isPublic: true,
            shareToken,
            credentialHash: `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
            issuer: "SkillSync Verifiable Credential Engine",
          },
        },
      },
      include: {
        passport: true,
      },
    });

    // Generate email verification token
    const verificationToken = await createToken(normalizedEmail, "email-verify", 24);

    logSecurityEvent(SecurityEvent.AUTH_REGISTRATION_SUCCESS, LogLevel.INFO, {
      ip: clientIp,
      user: { id: newUser.id, email: newUser.email },
      route: "/api/auth/register",
      method: "POST",
    });

    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV SECURITY LOG] New user registered: ${normalizedEmail}. Verification link: /verify-email?token=${verificationToken}&email=${encodeURIComponent(normalizedEmail)}`);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Registration successful. Please verify your email.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          emailVerified: null,
        },
        verificationRequired: true,
      },
      { status: 201 }
    );
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/auth/register",
      method: "POST",
      error: err,
    });
    return NextResponse.json(
      { error: "Failed to process registration. Please try again." },
      { status: 500 }
    );
  }
}
