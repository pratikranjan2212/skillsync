import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

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

      const skills = [];
      for (const ev of user.evidences || []) {
        for (const skillName of ev.claimedSkills || []) {
          const existing = skills.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
          if (!existing) {
            skills.push({
              name: skillName,
              category: "Technical Competency",
              tier: ev.verificationTier,
              evidence: [
                {
                  id: ev.id,
                  title: ev.title,
                  tier: ev.verificationTier,
                  hash: ev.fileHash,
                },
              ],
            });
          }
        }
      }

      for (const userSkill of user.skills || []) {
        if (!skills.some((s) => s.name.toLowerCase() === userSkill.toLowerCase())) {
          skills.push({
            name: userSkill,
            category: "Self-Reported Competency",
            tier: "verified-medium",
            evidence: [],
          });
        }
      }

      return NextResponse.json({
        success: true,
        passport: {
          studentId: passport?.studentId || `SS-${new Date().getFullYear()}-${user.id.substring(0, 6).toUpperCase()}`,
          studentName: user.name || (user.email ? user.email.split("@")[0] : "Student User"),
          college: user.college || "Institution Not Specified",
          degree: user.degree || "Degree Not Specified",
          batch: user.batch || "Batch Not Specified",
          verified: user.evidences && user.evidences.length > 0,
          issuer: passport?.issuer || "SkillSync Verifiable Credential Engine",
          credentialHash: passport?.credentialHash || `0x${Math.random().toString(16).substring(2, 42).toUpperCase()}`,
          shareToken: passport?.shareToken || `sp-token-${user.id.substring(0, 7)}`,
          isPublic: passport?.isPublic ?? true,
          updatedAt: passport?.updatedAt?.toISOString() || new Date().toISOString(),
          skills: skills,
        },
      });
    }
  } catch (err) {
    console.warn("DB Passport GET fallback (offline mode):", err.message);
  }

  return NextResponse.json({ success: true, passport: INITIAL_PASSPORT });
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
