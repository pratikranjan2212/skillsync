import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";
import { sanitizeString, sanitizeUrl, sanitizeImageUrl, sanitizeSkillList } from "@/lib/security/validator";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

function computeTrustScore(evidences) {
  if (!evidences || evidences.length === 0) return null;

  let totalScore = 0;
  let count = 0;

  for (const ev of evidences) {
    count++;
    if (ev.verificationTier === "verified-high") {
      totalScore += 98.4;
    } else if (ev.verificationTier === "verified-medium") {
      totalScore += 78.5;
    } else {
      totalScore += 45.0;
    }
  }

  return count > 0 ? (totalScore / count).toFixed(1) : null;
}

function normalizeProviderUrl(url, provider) {
  if (!url || typeof url !== "string") return "";
  let clean = url.trim();
  if (!clean) return "";
  if (provider === "github") {
    clean = clean.replace(/^(https?:\/\/)?(www\.)?github\.com\/?/, "");
    return clean ? `https://github.com/${clean}` : "";
  }
  if (provider === "linkedin") {
    clean = clean.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/?/, "");
    if (clean.startsWith("in/")) clean = clean.slice(3);
    return clean ? `https://linkedin.com/in/${clean}` : "";
  }
  if (provider === "coursera") {
    clean = clean.replace(/^(https?:\/\/)?(www\.)?coursera\.org\/?/, "");
    if (clean.startsWith("user/")) clean = clean.slice(5);
    return clean ? `https://coursera.org/user/${clean}` : "";
  }
  if (provider === "credly") {
    clean = clean.replace(/^(https?:\/\/)?(www\.)?credly\.com\/?/, "");
    if (clean.startsWith("users/")) clean = clean.slice(6);
    if (clean.startsWith("u/")) clean = clean.slice(2);
    if (clean.endsWith("/badges")) clean = clean.slice(0, -7);
    return clean ? `https://www.credly.com/users/${clean}/badges` : "";
  }
  if (provider === "portfolio") {
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      return `https://${clean}`;
    }
    return clean;
  }
  return clean;
}

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
      include: {
        passport: true,
        accounts: true,
        evidences: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    let passport = user.passport;
    if (!passport) {
      const studentTag = `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`;
      const shareToken = `sp-token-${Math.random().toString(36).substring(2, 9)}`;
      try {
        passport = await prisma.passport.create({
          data: {
            userId: user.id,
            studentId: studentTag,
            isPublic: true,
            shareToken,
            credentialHash: `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
            issuer: "SkillSync Verifiable Credential Engine",
          },
        });
      } catch (passErr) {
        console.warn("Passport creation warning:", passErr.message);
      }
    }

    const trustScore = computeTrustScore(user.evidences || []);
    const evidenceSkills = [];
    for (const ev of user.evidences || []) {
      for (const sk of ev.claimedSkills || []) {
        if (!evidenceSkills.includes(sk)) {
          evidenceSkills.push(sk);
        }
      }
    }

    const allSkills = Array.from(new Set([...(user.skills || []), ...evidenceSkills]));
    let resolvedName = formatDisplayName(user.name, user.name || (user.email ? user.email.split("@")[0] : "Student User"));
    let resolvedImage = user.image || null;

    let resolvedDob = user.dob || "";
    let resolvedGender = user.gender && user.gender !== "Student" ? user.gender : "Male";

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        name: resolvedName,
        email: user.email,
        role: user.role || "student",
        dob: resolvedDob,
        gender: resolvedGender,
        image: resolvedImage,
        studentId: passport?.studentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
        college: user.college || "",
        degree: user.degree || "",
        batch: user.batch || "",
        bio: user.bio || "",
        github: user.githubUrl || "",
        githubUrl: user.githubUrl || "",
        linkedin: user.linkedinUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        portfolio: user.portfolioUrl || "",
        portfolioUrl: user.portfolioUrl || "",
        coursera: user.courseraUrl || "",
        courseraUrl: user.courseraUrl || "",
        credly: user.credlyUrl || "",
        credlyUrl: user.credlyUrl || "",
        connectedProviders: user.accounts?.map((a) => a.provider) || [],
        skills: allSkills,
        customSkills: user.skills || [],
        evidenceCount: user.evidences?.length || 0,
        evidences: user.evidences || [],
        trustScore: trustScore,
        passport: passport,
        emailVerified: user.emailVerified,
      },
    });
  } catch (err) {
    console.error("Profile GET route error:", err);
    return NextResponse.json({ error: "Failed to load profile data" }, { status: 500 });
  }
}

export async function PUT(request) {
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
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    const body = await request.json();
    const { name, image, college, degree, batch, dob, gender, bio, github, linkedin, portfolio, coursera, credly, skills } = body;

    // Strict input validation & sanitization
    const sanitizedName = name !== undefined ? sanitizeString(name, 100) : user.name;
    const sanitizedCollege = college !== undefined ? sanitizeString(college, 150) : user.college;
    const sanitizedDegree = degree !== undefined ? sanitizeString(degree, 150) : user.degree;
    const sanitizedBatch = batch !== undefined ? sanitizeString(batch, 50) : user.batch;
    const sanitizedDob = dob !== undefined ? sanitizeString(dob, 50) : user.dob;
    const sanitizedGender = gender !== undefined ? sanitizeString(gender, 30) : user.gender;
    const sanitizedBio = bio !== undefined ? sanitizeString(bio, 1000) : user.bio;

    const rawGithub = github !== undefined ? normalizeProviderUrl(github, "github") : user.githubUrl;
    const rawLinkedin = linkedin !== undefined ? normalizeProviderUrl(linkedin, "linkedin") : user.linkedinUrl;
    const rawPortfolio = portfolio !== undefined ? normalizeProviderUrl(portfolio, "portfolio") : user.portfolioUrl;
    const rawCoursera = coursera !== undefined ? normalizeProviderUrl(coursera, "coursera") : user.courseraUrl;
    const rawCredly = credly !== undefined ? normalizeProviderUrl(credly, "credly") : user.credlyUrl;

    const validatedGithub = rawGithub ? (sanitizeUrl(rawGithub).valid ? sanitizeUrl(rawGithub).url : "") : (github !== undefined ? "" : user.githubUrl);
    const validatedLinkedin = rawLinkedin ? (sanitizeUrl(rawLinkedin).valid ? sanitizeUrl(rawLinkedin).url : "") : (linkedin !== undefined ? "" : user.linkedinUrl);
    const validatedPortfolio = rawPortfolio ? (sanitizeUrl(rawPortfolio).valid ? sanitizeUrl(rawPortfolio).url : "") : (portfolio !== undefined ? "" : user.portfolioUrl);
    const validatedCoursera = rawCoursera ? (sanitizeUrl(rawCoursera).valid ? sanitizeUrl(rawCoursera).url : "") : (coursera !== undefined ? "" : user.courseraUrl);
    const validatedCredly = rawCredly ? (sanitizeUrl(rawCredly).valid ? sanitizeUrl(rawCredly).url : "") : (credly !== undefined ? "" : user.credlyUrl);

    let validatedImage = user.image;
    if (image !== undefined) {
      if (!image || (typeof image === "string" && image.trim() === "")) {
        validatedImage = null;
      } else {
        const imgResult = sanitizeImageUrl(image);
        if (imgResult.valid) {
          validatedImage = imgResult.url;
        }
      }
    }

    const sanitizedSkills = skills !== undefined ? sanitizeSkillList(skills, 50, 50) : user.skills;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: sanitizedName,
        image: validatedImage,
        college: sanitizedCollege,
        degree: sanitizedDegree,
        batch: sanitizedBatch,
        dob: sanitizedDob,
        gender: sanitizedGender,
        bio: sanitizedBio,
        githubUrl: validatedGithub,
        linkedinUrl: validatedLinkedin,
        portfolioUrl: validatedPortfolio,
        courseraUrl: validatedCoursera,
        credlyUrl: validatedCredly,
        skills: sanitizedSkills,
      },
      include: {
        passport: true,
        accounts: true,
        evidences: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const trustScore = computeTrustScore(updatedUser.evidences || []);

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        dob: updatedUser.dob || "",
        gender: updatedUser.gender || "Male",
        image: updatedUser.image,
        studentId: updatedUser.passport?.studentId,
        college: updatedUser.college || "",
        degree: updatedUser.degree || "",
        batch: updatedUser.batch || "",
        bio: updatedUser.bio || "",
        github: updatedUser.githubUrl || "",
        githubUrl: updatedUser.githubUrl || "",
        linkedin: updatedUser.linkedinUrl || "",
        linkedinUrl: updatedUser.linkedinUrl || "",
        portfolio: updatedUser.portfolioUrl || "",
        portfolioUrl: updatedUser.portfolioUrl || "",
        coursera: updatedUser.courseraUrl || "",
        courseraUrl: updatedUser.courseraUrl || "",
        credly: updatedUser.credlyUrl || "",
        credlyUrl: updatedUser.credlyUrl || "",
        connectedProviders: updatedUser.accounts?.map((a) => a.provider) || [],
        skills: updatedUser.skills || [],
        customSkills: updatedUser.skills || [],
        evidenceCount: updatedUser.evidences?.length || 0,
        evidences: updatedUser.evidences || [],
        trustScore: trustScore,
        passport: updatedUser.passport,
        emailVerified: updatedUser.emailVerified,
      },
    });
  } catch (err) {
    logSecurityEvent(SecurityEvent.API_ERROR_500, LogLevel.ERROR, {
      route: "/api/profile",
      method: "PUT",
      error: err,
    });
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
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

    // Explicitly delete all related records in a transaction to avoid FK constraint issues
    await prisma.$transaction(async (tx) => {
      // Delete related records first
      await tx.passport.deleteMany({ where: { userId: user.id } });
      await tx.evidence.deleteMany({ where: { userId: user.id } });
      await tx.session.deleteMany({ where: { userId: user.id } });
      await tx.account.deleteMany({ where: { userId: user.id } });
      // Finally delete the user
      await tx.user.delete({ where: { id: user.id } });
    });

    return NextResponse.json({
      success: true,
      message: "Account and all associated records permanently deleted.",
    });
  } catch (err) {
    console.error("Profile DELETE route error:", err);
    return NextResponse.json(
      { error: "Failed to delete account", details: err.message || String(err) },
      { status: 500 }
    );
  }
}
