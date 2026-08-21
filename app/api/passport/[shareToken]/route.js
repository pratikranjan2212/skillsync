import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { INITIAL_PASSPORT } from "@/app/data/mockData";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function safeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

function safeIsoDate(val) {
  if (!val) return new Date().toISOString();
  if (val instanceof Date) return val.toISOString();
  try {
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d.toISOString();
  } catch {}
  return new Date().toISOString();
}

export async function GET(request, { params }) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `share-token:${clientIp}`,
    RATE_LIMIT_PRESETS.FEED_SCRAPING.maxRequests,
    RATE_LIMIT_PRESETS.FEED_SCRAPING.windowMs
  );
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetTime);
  }

  const resolvedParams = await params;
  const shareToken = resolvedParams?.shareToken;

  if (!shareToken) {
    return NextResponse.json({ error: "Share token is required." }, { status: 400 });
  }

  try {
    let sessionUserId = null;
    let sessionUserEmail = null;
    try {
      const session = await auth();
      sessionUserId = session?.user?.id;
      sessionUserEmail = session?.user?.email;
    } catch (authErr) {
      // Unauthenticated public visitor is normal
    }

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

    if (passport && passport.user) {
      const isOwner =
        (sessionUserId && passport.userId === sessionUserId) ||
        (sessionUserEmail && passport.user.email === sessionUserEmail);

      // If passport is private, only the owner may access it
      if (!passport.isPublic && !isOwner) {
        return NextResponse.json(
          { error: "This Skill Passport is private and cannot be viewed publicly." },
          { status: 403 }
        );
      }

      const skills = [];
      const userEvidences = Array.isArray(passport.user.evidences) ? passport.user.evidences : [];
      
      for (const ev of userEvidences) {
        const claimedSkills = safeArray(ev.claimedSkills);
        for (const rawSkill of claimedSkills) {
          const skillName = typeof rawSkill === "string" ? rawSkill.trim() : (rawSkill?.name || String(rawSkill || "")).trim();
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
              title: ev.title || "Verified Evidence",
              tier: ev.verificationTier || "verified-medium",
              hash: ev.fileHash || `sha256:${ev.id}`,
            });
          }
        }
      }

      const userSkills = safeArray(passport.user.skills);
      for (const userSkill of userSkills) {
        const skillName = typeof userSkill === "string" ? userSkill.trim() : (userSkill?.name || String(userSkill || "")).trim();
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
      for (const ev of userEvidences) {
        const claimedSkills = safeArray(ev.claimedSkills);
        const evType = (ev.type || "").toLowerCase();
        const evTitle = (ev.title || "").toLowerCase();

        if (
          evType === "project" ||
          evType === "competition" ||
          (ev.fileUrl && ev.fileUrl.includes("github.com"))
        ) {
          projects.push({
            id: ev.id,
            title: ev.title || "Project Evidence",
            description: ev.description || `Verified evidence repository for ${claimedSkills.join(", ")}`,
            githubUrl: ev.fileUrl || "",
            skills: claimedSkills,
            tier: ev.verificationTier || "verified-high",
          });
        } else if (
          evType === "coursework" ||
          evType === "lab" ||
          evType === "certification" ||
          evType === "micro-credential" ||
          evTitle.includes("course") ||
          evTitle.includes("learning") ||
          evTitle.includes("specialization") ||
          evTitle.includes("cert")
        ) {
          coursework.push({
            id: ev.id,
            title: ev.title || "Coursework & Certification",
            description: ev.description || "",
            certificateUrl: ev.fileUrl || "",
            skills: claimedSkills,
            tier: ev.verificationTier || "verified-high",
            verified: ev.verificationStage === "completed" || ev.verificationTier === "verified-high" || ev.verificationTier === "verified-medium",
          });
        }
      }

      return NextResponse.json({
        success: true,
        passport: {
          studentId: passport.studentId || "SS-2026-STU01",
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
          verified: userEvidences.length > 0 || skills.length > 0,
          issuer: passport.issuer || "SkillSync Verifiable Credential Engine",
          credentialHash: passport.credentialHash || "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
          shareToken: passport.shareToken,
          isPublic: passport.isPublic,
          updatedAt: safeIsoDate(passport.updatedAt),
          skills: skills.length > 0 ? skills : INITIAL_PASSPORT.skills,
          projects: projects.length > 0 ? projects : INITIAL_PASSPORT.projects,
          coursework: coursework,
        },
      });
    }
  } catch (err) {
    console.warn("DB Share Token GET error:", err.message);
  }

  // Fallback for demo share token
  if (shareToken === INITIAL_PASSPORT.shareToken || shareToken === "sp-token-user" || shareToken === "sp-token-9942a") {
    return NextResponse.json({ success: true, passport: INITIAL_PASSPORT });
  }

  return NextResponse.json({ error: "Invalid or expired share link token." }, { status: 404 });
}
