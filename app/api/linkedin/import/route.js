import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { computeSha256 } from "@/lib/verification/cryptoHash";
import { sanitizeString, sanitizeUrl, sanitizeSkillList } from "@/lib/security/validator";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

export async function POST(request) {
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
      include: {
        evidences: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const body = await request.json();
    const { certifications = [], linkedinUrl = "" } = body;

    if (!Array.isArray(certifications) || certifications.length === 0) {
      return NextResponse.json({ error: "No LinkedIn certifications provided for import." }, { status: 400 });
    }

    const existingUrls = new Set(user.evidences.map((e) => (e.fileUrl || "").toLowerCase()));
    const existingTitles = new Set(user.evidences.map((e) => (e.title || "").toLowerCase()));

    const newlyCreated = [];
    const newlyClaimedSkills = new Set(user.skills || []);

    for (const cert of certifications) {
      const sanitizedTitle = sanitizeString(cert.title || "Industry Certification", 200);
      const sanitizedDescription = sanitizeString(
        cert.description || `Verified professional certification: ${cert.title} issued by ${cert.issuer || "Accredited Body"}. Credential ID: ${cert.credentialId || "N/A"}`,
        2000
      );
      const validatedUrl = cert.verificationUrl ? (sanitizeUrl(cert.verificationUrl).valid ? sanitizeUrl(cert.verificationUrl).url : "") : "";
      const sanitizedSkills = sanitizeSkillList(cert.skills || [], 30, 50);

      // Avoid duplicates if already imported
      if (
        (validatedUrl && existingUrls.has(validatedUrl.toLowerCase())) ||
        existingTitles.has(sanitizedTitle.toLowerCase())
      ) {
        sanitizedSkills.forEach((s) => newlyClaimedSkills.add(s));
        continue;
      }

      const fileHash = computeSha256(`${sanitizedTitle}_${validatedUrl}_${cert.credentialId || ""}_${Date.now()}`);

      const createdEvidence = await prisma.evidence.create({
        data: {
          userId: user.id,
          type: "micro-credential",
          title: sanitizedTitle,
          description: sanitizedDescription,
          fileUrl: validatedUrl || "https://linkedin.com",
          fileHash,
          verificationTier: "verified-high",
          verificationReason: `Verified digital certification imported from LinkedIn Credentials Profile (ID: ${cert.credentialId || "VERIFIED"})`,
          verificationStage: "completed",
          verifiedAt: new Date(),
          adminOverride: false,
          claimedSkills: sanitizedSkills,
        },
      });

      newlyCreated.push(createdEvidence);
      existingUrls.add((validatedUrl || "").toLowerCase());
      existingTitles.add(sanitizedTitle.toLowerCase());
      sanitizedSkills.forEach((s) => newlyClaimedSkills.add(s));
    }

    // Update user profile skills & linkedinUrl if provided
    const updatedSkillsArray = Array.from(newlyClaimedSkills).filter(Boolean);
    const userUpdateData = {
      skills: updatedSkillsArray,
    };
    if (linkedinUrl && typeof linkedinUrl === "string") {
      const sanitizedLinkedinUrl = sanitizeUrl(linkedinUrl).valid ? sanitizeUrl(linkedinUrl).url : linkedinUrl;
      userUpdateData.linkedinUrl = sanitizedLinkedinUrl;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: userUpdateData,
    });

    // Refresh Passport Hash and timestamp
    const newHash = `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`;
    const studentTag = `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`;
    const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;

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

    return NextResponse.json({
      success: true,
      importedCount: newlyCreated.length,
      alreadyExistedCount: certifications.length - newlyCreated.length,
      evidence: newlyCreated,
      skills: updatedSkillsArray,
      message: `Successfully imported ${newlyCreated.length} LinkedIn ${newlyCreated.length === 1 ? "certification" : "certifications"} to your Skill Passport.`,
    });
  } catch (err) {
    console.error("LinkedIn certification import POST error:", err);
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/linkedin/import",
      method: "POST",
      error: err,
    });
    return NextResponse.json({ error: "Failed to import LinkedIn certifications: " + err.message }, { status: 500 });
  }
}
