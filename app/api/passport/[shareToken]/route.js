import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { INITIAL_PASSPORT } from "@/app/data/mockData";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `share-token:${clientIp}`,
    RATE_LIMIT_PRESETS.GENERAL_API.maxRequests,
    RATE_LIMIT_PRESETS.GENERAL_API.windowMs
  );
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetTime);
  }

  const { shareToken } = await params;

  try {
    const session = await auth();
    const sessionUserId = session?.user?.id;
    const sessionUserEmail = session?.user?.email;

    const passport = await prisma.passport.findUnique({
      where: { shareToken },
      include: {
        user: {
          include: {
            evidences: true,
          },
        },
      },
    });

    if (passport) {
      const isOwner =
        (sessionUserId && passport.userId === sessionUserId) ||
        (sessionUserEmail && passport.user.email === sessionUserEmail);

      // If passport is private, only the owner may access it
      if (!passport.isPublic && !isOwner) {
        return NextResponse.json({ error: "Passport is set to private by student" }, { status: 403 });
      }

      const skills = [];
      for (const ev of passport.user.evidences || []) {
        for (const rawSkill of ev.claimedSkills || []) {
          const skillName = rawSkill.trim();
          if (!skillName) continue;

          let existing = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
          if (!existing) {
            existing = {
              name: skillName,
              category: "Technical Competency",
              tier: ev.verificationTier || "verified-medium",
              evidence: [],
            };
            skills.push(existing);
          }

          if (!existing.evidence.some((e) => e.id === ev.id)) {
            existing.evidence.push({
              id: ev.id,
              title: ev.title,
              tier: ev.verificationTier || "verified-medium",
              hash: ev.fileHash || `sha256:${ev.id}`,
            });
          }
        }
      }

      for (const userSkill of passport.user.skills || []) {
        const skillName = userSkill.trim();
        if (!skillName) continue;
        if (!skills.some((s) => s.name.toLowerCase() === skillName.toLowerCase())) {
          skills.push({
            name: skillName,
            category: "Technical Competency",
            tier: "verified-medium",
            evidence: [],
          });
        }
      }

      const projects = [];
      const coursework = [];
      for (const ev of passport.user.evidences || []) {
        if (
          ev.type === "project" ||
          ev.type === "competition" ||
          (ev.fileUrl && ev.fileUrl.includes("github.com"))
        ) {
          projects.push({
            id: ev.id,
            title: ev.title,
            description: ev.description || `Verified evidence repository for ${ev.claimedSkills.join(", ")}`,
            githubUrl: ev.fileUrl || "",
            skills: ev.claimedSkills || [],
            tier: ev.verificationTier,
          });
        } else if (
          ev.type === "coursework" ||
          ev.type === "lab" ||
          ev.type === "certification" ||
          ev.type === "micro-credential" ||
          (ev.title && (ev.title.toLowerCase().includes("course") || ev.title.toLowerCase().includes("learning") || ev.title.toLowerCase().includes("dbms") || ev.title.toLowerCase().includes("specialization")))
        ) {
          coursework.push({
            id: ev.id,
            title: ev.title,
            description: ev.description || "",
            certificateUrl: ev.fileUrl || "",
            skills: ev.claimedSkills || [],
            tier: ev.verificationTier || "verified-high",
            verified: ev.verificationStage === "completed" || ev.verificationTier === "verified-high" || ev.verificationTier === "verified-medium",
          });
        }
      }

      return NextResponse.json({
        success: true,
        passport: {
          studentId: passport.studentId,
          studentName: passport.user.name || "Student User",
          gender: passport.user.gender && passport.user.gender !== "Student" ? passport.user.gender : "Male",
          dob: passport.user.dob || "Not Specified",
          college: passport.user.college || "Institution Not Specified",
          degree: passport.user.degree || "Degree Not Specified",
          batch: passport.user.batch || "Batch Not Specified",
          photoUrl: passport.user.image || null,
          githubUrl: passport.user.githubUrl || "",
          linkedinUrl: passport.user.linkedinUrl || "",
          portfolioUrl: passport.user.portfolioUrl || "",
          verified: (passport.user.evidences && passport.user.evidences.length > 0) || skills.length > 0,
          issuer: passport.issuer,
          credentialHash: passport.credentialHash,
          shareToken: passport.shareToken,
          isPublic: passport.isPublic,
          updatedAt: passport.updatedAt.toISOString(),
          skills: skills.length > 0 ? skills : INITIAL_PASSPORT.skills,
          projects: projects.length > 0 ? projects : INITIAL_PASSPORT.projects,
          coursework: coursework,
        },
      });
    }
  } catch (err) {
    console.warn("DB Share Token GET error:", err.message);
  }

  // Fallback ONLY for the initial demo share token
  if (shareToken === INITIAL_PASSPORT.shareToken) {
    return NextResponse.json({ success: true, passport: INITIAL_PASSPORT });
  }

  return NextResponse.json({ error: "Invalid or expired share token." }, { status: 404 });
}
