import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { runVerificationPipeline } from "@/lib/verification/pipeline";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";
import { sanitizeString, sanitizeUrl, sanitizeSkillList, sanitizeIdentifier } from "@/lib/security/validator";

export async function GET(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const evidenceList = await prisma.evidence.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, evidence: evidenceList || [] });
  } catch (err) {
    console.error("Evidence GET error:", err);
    return NextResponse.json({ error: "Failed to load evidence records." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const clientIp = getClientIp(request);
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Enforce AI Generation & OCR Abuse Protection Rate Limit (10 submissions per 10 mins)
    const rateLimitKey = `ai-evidence:${user.id}:${clientIp}`;
    const rateLimit = checkRateLimit(
      rateLimitKey,
      RATE_LIMIT_PRESETS.AI_GENERATION.maxRequests,
      RATE_LIMIT_PRESETS.AI_GENERATION.windowMs
    );

    if (!rateLimit.success) {
      logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
        ip: clientIp,
        user: { id: user.id, email: user.email },
        route: "/api/evidence",
        method: "POST",
        details: { reason: "AI evidence verification rate limit exceeded" },
      });
      return createRateLimitResponse(
        rateLimit.resetTime,
        "AI verification request limit exceeded. Please wait a few minutes before submitting new coursework or repositories."
      );
    }

    const body = await request.json();

    // Sanitize user-provided evidence fields
    const sanitizedTitle = sanitizeString(body.title, 200);
    const sanitizedDescription = sanitizeString(body.description, 2000);
    const sanitizedType = sanitizeString(body.type || "project", 50);
    const validatedFileUrl = body.fileUrl ? (sanitizeUrl(body.fileUrl).valid ? sanitizeUrl(body.fileUrl).url : "") : "";
    const sanitizedSkills = sanitizeSkillList(body.claimedSkills || [], 30, 50);

    if (!sanitizedTitle || sanitizedTitle.length < 2) {
      return NextResponse.json({ error: "Evidence title must be at least 2 characters long." }, { status: 400 });
    }

    const verifiedData = await runVerificationPipeline({
      ...body,
      title: sanitizedTitle,
      description: sanitizedDescription,
      type: sanitizedType,
      fileUrl: validatedFileUrl,
      claimedSkills: sanitizedSkills,
    });

    const created = await prisma.evidence.create({
      data: {
        userId: user.id,
        type: verifiedData.type,
        title: verifiedData.title,
        description: verifiedData.description,
        fileUrl: verifiedData.fileUrl,
        fileHash: verifiedData.fileHash,
        verificationTier: verifiedData.verificationTier,
        verificationReason: verifiedData.verificationReason,
        verificationStage: verifiedData.verificationStage,
        verifiedAt: new Date(verifiedData.verifiedAt),
        adminOverride: false,
        claimedSkills: verifiedData.claimedSkills || [],
      },
    });

    // Automatically sync claimed skills to User profile skills
    if (verifiedData.claimedSkills && verifiedData.claimedSkills.length > 0) {
      try {
        const currentSkills = user.skills || [];
        const mergedSkills = Array.from(
          new Set([...currentSkills, ...verifiedData.claimedSkills.map((s) => s.trim())])
        ).filter(Boolean);

        await prisma.user.update({
          where: { id: user.id },
          data: { skills: mergedSkills },
        });
      } catch (skillErr) {
        console.warn("Could not sync user skills:", skillErr.message);
      }
    }

    // Ensure passport exists and update timestamp & hash
    try {
      const studentTag = `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`;
      const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;
      const newHash = `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`;

      await prisma.passport.upsert({
        where: { userId: user.id },
        update: {
          updatedAt: new Date(),
          credentialHash: newHash,
        },
        create: {
          userId: user.id,
          studentId: studentTag,
          isPublic: true,
          shareToken,
          credentialHash: newHash,
          issuer: "SkillSync Verifiable Credential Engine",
        },
      });
    } catch (passErr) {
      console.warn("Could not update passport state:", passErr.message);
    }

    return NextResponse.json({ success: true, evidence: created }, { status: 201 });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/evidence",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to submit evidence" }, { status: 400 });
  }
}

export async function DELETE(request) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (!userId && !userEmail) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(userId ? [{ id: userId }] : []),
          ...(userEmail ? [{ email: userEmail }] : []),
        ],
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const rawId = searchParams.get("id");

    if (!rawId) {
      return NextResponse.json({ error: "Evidence ID is required." }, { status: 400 });
    }

    const { valid, id } = sanitizeIdentifier(rawId);
    if (!valid) {
      return NextResponse.json({ error: "Invalid evidence ID format." }, { status: 400 });
    }

    // Enforce strict ownership: user can ONLY delete evidence records that belong to them
    const existing = await prisma.evidence.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!existing) {
      logSecurityEvent(SecurityEvent.IDOR_ATTEMPT_BLOCKED, LogLevel.WARN, {
        user: { id: user.id, email: user.email },
        route: `/api/evidence?id=${id}`,
        method: "DELETE",
        details: { reason: "Attempt to delete unowned evidence record" },
      });
      return NextResponse.json(
        { error: "Evidence record not found or access denied." },
        { status: 404 }
      );
    }

    await prisma.evidence.delete({
      where: { id: existing.id },
    });

    return NextResponse.json({ success: true, message: "Evidence record successfully deleted." });
  } catch (err) {
    console.error("Evidence DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete evidence record." }, { status: 500 });
  }
}
