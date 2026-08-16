import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";

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

export async function GET(request) {
  try {
    const session = await auth();
    let userEmail = session?.user?.email;

    let user = null;
    if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
          passport: true,
          evidences: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "student" },
        include: {
          passport: true,
          evidences: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    if (user) {
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

      // If user's name looks like a raw username, query GitHub or format properly
      if (user.name && (!user.name.includes(" ") || user.name.includes("@"))) {
        try {
          const ghHandle = user.name.replace(/[^a-zA-Z0-9-_]/g, "");
          const ghRes = await fetch(`https://api.github.com/users/${ghHandle}`, {
            headers: { "User-Agent": "SkillSync-App" },
          });
          if (ghRes.ok) {
            const ghData = await ghRes.json();
            resolvedName = formatDisplayName(ghData.name, ghData.login || user.name);
            if (!resolvedImage && ghData.avatar_url) {
              resolvedImage = ghData.avatar_url;
            }
          }
        } catch (ghErr) {
          // Ignore network errors
        }

        // Persist the formatted name & avatar to the DB
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name: resolvedName,
            image: resolvedImage || user.image,
          },
        }).catch(() => {});
      }

      return NextResponse.json({
        success: true,
        profile: {
          id: user.id,
          name: resolvedName,
          email: user.email,
          role: user.role || "student",
          image: resolvedImage,
          studentId: passport?.studentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
          college: user.college || "",
          degree: user.degree || "",
          batch: user.batch || "",
          bio: user.bio || "",
          github: user.githubUrl || (resolvedName ? `https://github.com/${user.name || resolvedName}` : ""),
          linkedin: user.linkedinUrl || "",
          portfolio: user.portfolioUrl || "",
          skills: allSkills,
          customSkills: user.skills || [],
          evidenceCount: user.evidences?.length || 0,
          evidences: user.evidences || [],
          trustScore: trustScore,
          passport: passport,
        },
      });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: "usr-guest",
        name: session?.user?.name || "Student User",
        email: session?.user?.email || "student@skillsync.edu",
        role: session?.user?.role || "student",
        image: session?.user?.image || null,
        studentId: `SS-${new Date().getFullYear()}-USER01`,
        college: "",
        degree: "",
        batch: "",
        bio: "",
        github: "",
        linkedin: "",
        portfolio: "",
        skills: [],
        customSkills: [],
        evidenceCount: 0,
        evidences: [],
        trustScore: null,
        passport: null,
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
    const body = await request.json();
    const { name, image, college, degree, batch, bio, github, linkedin, portfolio, skills } = body;

    let userEmail = session?.user?.email;

    let user = null;
    if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      });
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "student" },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        image: image !== undefined ? image : user.image,
        college: college !== undefined ? college : user.college,
        degree: degree !== undefined ? degree : user.degree,
        batch: batch !== undefined ? batch : user.batch,
        bio: bio !== undefined ? bio : user.bio,
        githubUrl: github !== undefined ? github : user.githubUrl,
        linkedinUrl: linkedin !== undefined ? linkedin : user.linkedinUrl,
        portfolioUrl: portfolio !== undefined ? portfolio : user.portfolioUrl,
        skills: Array.isArray(skills) ? skills : user.skills,
      },
      include: {
        passport: true,
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
        image: updatedUser.image,
        studentId: updatedUser.passport?.studentId,
        college: updatedUser.college || "",
        degree: updatedUser.degree || "",
        batch: updatedUser.batch || "",
        bio: updatedUser.bio || "",
        github: updatedUser.githubUrl || "",
        linkedin: updatedUser.linkedinUrl || "",
        portfolio: updatedUser.portfolioUrl || "",
        skills: updatedUser.skills || [],
        customSkills: updatedUser.skills || [],
        evidenceCount: updatedUser.evidences?.length || 0,
        evidences: updatedUser.evidences || [],
        trustScore: trustScore,
        passport: updatedUser.passport,
      },
    });
  } catch (err) {
    console.error("Profile PUT route error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
