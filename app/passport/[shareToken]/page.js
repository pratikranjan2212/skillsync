import React from "react";
import Link from "next/link";
import { Lock, ExternalLink, ArrowLeft } from "lucide-react";
import InteractivePassportCard from "@/app/components/passport/InteractivePassportCard";
import SkillPassportFolder from "@/app/components/passport/SkillPassportFolder";
import prisma from "@/lib/prisma";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export default async function PublicPassportPage({ params }) {
  const { shareToken } = await params;

  let passport = null;
  let errorState = null;

  try {
    const dbPassport = await prisma.passport.findUnique({
      where: { shareToken },
      include: {
        user: {
          include: {
            evidences: true,
          },
        },
      },
    });

    if (dbPassport) {
      if (!dbPassport.isPublic) {
        errorState = "This Skill Passport is private and cannot be viewed publicly.";
      } else {
        const user = dbPassport.user;
        const skillsMap = [];

        for (const ev of user.evidences || []) {
          for (const skillName of ev.claimedSkills || []) {
            const existing = skillsMap.find((s) => s.name.toLowerCase() === skillName.toLowerCase());
            if (existing) {
              existing.evidence.push({
                id: ev.id,
                title: ev.title,
                tier: ev.verificationTier,
                hash: ev.fileHash,
              });
            } else {
              skillsMap.push({
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
          if (!skillsMap.some((s) => s.name.toLowerCase() === userSkill.toLowerCase())) {
            skillsMap.push({
              name: userSkill,
              category: "Self-Reported Competency",
              tier: "verified-medium",
              evidence: [],
            });
          }
        }

        passport = {
          studentId: dbPassport.studentId,
          studentName: user.name || "Student User",
          gender: user.gender && user.gender !== "Student" ? user.gender : "Male",
          dob: user.dob || "Not Specified",
          college: user.college || "Institution Not Specified",
          degree: user.degree || "Degree Not Specified",
          batch: user.batch || "Batch Not Specified",
          photoUrl: user.image || null,
          verified: (user.evidences && user.evidences.length > 0) || (user.skills && user.skills.length > 0),
          issuer: dbPassport.issuer,
          credentialHash: dbPassport.credentialHash,
          shareToken: dbPassport.shareToken,
          isPublic: dbPassport.isPublic,
          updatedAt: dbPassport.updatedAt.toISOString(),
          skills: skillsMap,
        };
      }
    } else if (shareToken === "sp-token-9942a" || shareToken.startsWith("sp-token-")) {
      passport = INITIAL_PASSPORT;
    } else {
      errorState = "Invalid or expired share link token.";
    }
  } catch (err) {
    console.warn("Error fetching public passport:", err);
    if (shareToken === "sp-token-9942a") {
      passport = INITIAL_PASSPORT;
    } else {
      errorState = "Could not fetch public passport.";
    }
  }

  if (errorState || !passport) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#111111]">Passport Unavailable</h1>
          <p className="text-xs text-[#494D4D]">{errorState}</p>
          <Link
            href="/"
            className="mt-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Back to SkillSync Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] py-6 sm:py-12 flex flex-col items-center">
      <main className="max-w-5xl 2xl:max-w-6xl w-full mx-auto px-3.5 sm:px-8 md:px-12 flex flex-col gap-6">
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-white text-neutral-700 hover:text-black rounded-xl text-xs font-bold border border-black/5 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>SkillSync Home</span>
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Create Your Passport</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        <div className="w-full flex justify-center py-6">
          <SkillPassportFolder passportData={passport} />
        </div>
      </main>
    </div>
  );
}

