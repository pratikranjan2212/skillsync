import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";
import { formatDob } from "@/lib/opportunities/workModeUtils";

export const dynamic = "force-dynamic";

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
        evidences: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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

    // Aggregate skills and citations from all verified user evidences
    const skills = [];
    for (const ev of user.evidences || []) {
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

    // Merge user self-reported skills
    for (const userSkill of user.skills || []) {
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

    // Extract verified projects
    const projects = [];
    const coursework = [];
    for (const ev of user.evidences || []) {
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

    const responsePayload = {
      studentId: passport?.studentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
      studentName: formatDisplayName(user.name, user.name || (user.email ? user.email.split("@")[0] : "Student User")),
      gender: user.gender || "Male",
      dob: formatDob(user.dob),
      college: user.college || "Institution Not Specified",
      degree: user.degree || "Degree Not Specified",
      batch: user.batch || "Batch Not Specified",
      photoUrl: user.image || null,
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      portfolioUrl: user.portfolioUrl || "",
      verified: (user.evidences && user.evidences.length > 0) || skills.length > 0,
      issuer: passport?.issuer || "SkillSync Verifiable Credential Engine",
      credentialHash: passport?.credentialHash || `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
      shareToken: passport?.shareToken || `sp-token-${user.id.substring(0, 7)}`,
      isPublic: passport?.isPublic ?? true,
      updatedAt: passport?.updatedAt?.toISOString() || new Date().toISOString(),
      skills: skills,
      projects: projects,
      coursework: coursework,
    };

    return NextResponse.json(
      { success: true, passport: responsePayload },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("Passport GET error:", err);
    return NextResponse.json({ error: "Failed to load passport data." }, { status: 500 });
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

    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "Invalid visibility state." }, { status: 400 });
    }

    const updatedPassport = await prisma.passport.update({
      where: { userId: user.id },
      data: {
        isPublic,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, passport: updatedPassport });
  } catch (err) {
    console.error("Passport visibility update error:", err);
    return NextResponse.json({ error: "Failed to update passport visibility" }, { status: 500 });
  }
}
