import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";

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

      let resolvedDob = user.dob || "";
      let resolvedGender = user.gender && user.gender !== "Student" ? user.gender : "Male";
      try {
        const rawRow = await prisma.$queryRaw`SELECT dob, gender FROM users WHERE id = ${user.id}`;
        if (rawRow && rawRow[0]) {
          if (rawRow[0].dob !== undefined && rawRow[0].dob !== null) resolvedDob = rawRow[0].dob;
          if (rawRow[0].gender !== undefined && rawRow[0].gender !== null && rawRow[0].gender !== "Student") {
            resolvedGender = rawRow[0].gender;
          }
        }
      } catch (rawErr) {}

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
        dob: "",
        gender: "Male",
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
    const { name, image, college, degree, batch, dob, gender, bio, github, linkedin, portfolio, skills } = body;

    let userEmail = session?.user?.email;
    let userId = session?.user?.id;

    let user = null;
    if (userId) {
      user = await prisma.user.findUnique({
        where: { id: userId },
      }).catch(() => null);
    }

    if (!user && userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
      }).catch(() => null);
    }

    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "student" },
      }).catch(() => null);
    }

    if (!user) {
      user = await prisma.user.findFirst().catch(() => null);
    }

    if (!user) {
      // Auto-create user record so updates never fail
      user = await prisma.user.create({
        data: {
          name: name || session?.user?.name || "Student User",
          email: userEmail || `student-${Date.now()}@skillsync.edu`,
          role: "student",
          college: college || "",
          degree: degree || "",
          batch: batch || "",
          bio: bio || "",
          githubUrl: github || "",
          linkedinUrl: linkedin || "",
          portfolioUrl: portfolio || "",
        },
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name !== undefined ? name : user.name,
        image: image !== undefined ? image : user.image,
        college: college !== undefined ? college : user.college,
        degree: degree !== undefined ? degree : user.degree,
        batch: batch !== undefined ? batch : user.batch,
        dob: dob !== undefined ? dob : user.dob,
        gender: gender !== undefined ? gender : user.gender,
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

    let savedDob = dob !== undefined ? dob : user.dob || "";
    let savedGender =
      gender !== undefined && gender !== "Student"
        ? gender
        : user.gender && user.gender !== "Student"
        ? user.gender
        : "Male";

    try {
      if (dob !== undefined || gender !== undefined) {
        await prisma.$executeRaw`UPDATE users SET dob = ${savedDob}, gender = ${savedGender} WHERE id = ${user.id}`;
      }
    } catch (rawErr) {
      console.warn("Raw update warning:", rawErr.message);
    }

    const trustScore = computeTrustScore(updatedUser.evidences || []);

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        dob: savedDob,
        gender: savedGender,
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
    return NextResponse.json({ error: err.message || "Failed to update profile", details: err.message }, { status: 500 });
  }
}
