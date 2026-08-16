import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_PASSPORT, INITIAL_EVIDENCE } from "@/app/data/mockData";
import { computePassportHash } from "@/lib/verification/cryptoHash";

let passportMemoryStore = { ...INITIAL_PASSPORT };

export async function GET(request) {
  try {
    const passport = await prisma.passport.findFirst({
      include: {
        user: {
          include: {
            evidences: true,
          },
        },
      },
    });

    if (passport) {
      const skills = [];
      for (const ev of passport.user.evidences || []) {
        for (const skillName of ev.claimedSkills || []) {
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

      return NextResponse.json({
        success: true,
        passport: {
          studentId: passport.studentId,
          studentName: passport.user.name || "Alex Chen",
          college: passport.user.college || "Ramaiah Institute of Technology",
          degree: passport.user.degree || "B.Tech in Computer Science & Engineering",
          batch: passport.user.batch || "2022 – 2026",
          verified: true,
          issuer: passport.issuer,
          credentialHash: passport.credentialHash,
          shareToken: passport.shareToken,
          isPublic: passport.isPublic,
          updatedAt: passport.updatedAt.toISOString(),
          skills: skills.length > 0 ? skills : INITIAL_PASSPORT.skills,
        },
      });
    }
  } catch (err) {
    console.warn("DB Passport GET fallback (offline mode):", err.message);
  }

  return NextResponse.json({ success: true, passport: passportMemoryStore });
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
