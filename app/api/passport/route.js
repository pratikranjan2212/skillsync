import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth, formatDisplayName } from "@/lib/auth";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export const dynamic = "force-dynamic";

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

      // Merge any user self-reported skills
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

      let resolvedDob = user.dob || "Not Specified";
      let resolvedGender = user.gender && user.gender !== "Student" ? user.gender : "Male";
      try {
        const rawRow = await prisma.$queryRaw`SELECT dob, gender FROM users WHERE id = ${user.id}`;
        if (rawRow && rawRow[0]) {
          if (rawRow[0].dob) resolvedDob = rawRow[0].dob;
          if (rawRow[0].gender && rawRow[0].gender !== "Student") resolvedGender = rawRow[0].gender;
        }
      } catch (rawErr) {}

      const responsePayload = {
        studentId: passport?.studentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
        studentName: formatDisplayName(user.name, user.name || (user.email ? user.email.split("@")[0] : "Student User")),
        gender: resolvedGender,
        dob: resolvedDob,
        college: user.college || "Institution Not Specified",
        degree: user.degree || "Degree Not Specified",
        batch: user.batch || "Batch Not Specified",
        photoUrl: user.image || null,
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
    }
  } catch (err) {
    console.warn("DB Passport GET fallback (offline mode):", err.message);
  }

  return NextResponse.json(
    { success: true, passport: INITIAL_PASSPORT },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic === "boolean") {
      passportMemoryStore.isPublic = isPublic;
      passportMemoryStore.updatedAt = new Date().toISOString();

      try {
        await prisma.passport.updateMany({
          data: { isPublic },
        });
      } catch (dbErr) {
        console.warn("DB Passport POST update fallback:", dbErr.message);
      }
    }

    return NextResponse.json({ success: true, passport: passportMemoryStore });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update passport visibility" }, { status: 400 });
  }
}
