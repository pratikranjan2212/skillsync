import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export async function GET(request, { params }) {
  const { shareToken } = await params;

  try {
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
      if (!passport.isPublic) {
        return NextResponse.json({ error: "Passport is set to private by student" }, { status: 403 });
      }

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
    console.warn("DB Share Token GET fallback:", err.message);
  }

  // Fallback check
  if (shareToken === INITIAL_PASSPORT.shareToken || shareToken.startsWith("sp-token-")) {
    if (!INITIAL_PASSPORT.isPublic && shareToken !== INITIAL_PASSPORT.shareToken) {
      return NextResponse.json({ error: "Passport is set to private by student" }, { status: 403 });
    }
    return NextResponse.json({ success: true, passport: INITIAL_PASSPORT });
  }

  return NextResponse.json({ error: "Invalid share token" }, { status: 404 });
}
