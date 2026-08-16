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
        }
      }

      return NextResponse.json({
        success: true,
        passport: {
          studentId: passport.studentId,
          studentName: passport.user.name || "Student User",
          gender: passport.user.gender || "Student",
          dob: passport.user.dob || "Not Specified",
          college: passport.user.college || "Institution Not Specified",
          degree: passport.user.degree || "Degree Not Specified",
          batch: passport.user.batch || "Batch Not Specified",
          photoUrl: passport.user.image || null,
          verified: (passport.user.evidences && passport.user.evidences.length > 0) || skills.length > 0,
          issuer: passport.issuer,
          credentialHash: passport.credentialHash,
          shareToken: passport.shareToken,
          isPublic: passport.isPublic,
          updatedAt: passport.updatedAt.toISOString(),
          skills: skills.length > 0 ? skills : INITIAL_PASSPORT.skills,
          projects: projects.length > 0 ? projects : INITIAL_PASSPORT.projects,
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
