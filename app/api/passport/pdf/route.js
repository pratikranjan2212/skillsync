import { NextResponse } from "next/server";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export async function GET(request) {
  const passportText = `
=====================================================
            SKILLSYNC VERIFIED SKILL PASSPORT
=====================================================
Student ID: ${INITIAL_PASSPORT.studentId}
Share Token: ${INITIAL_PASSPORT.shareToken}
Updated: ${INITIAL_PASSPORT.updatedAt}
-----------------------------------------------------
VERIFIED SKILLS & EVIDENCE:

${INITIAL_PASSPORT.skills
  .map(
    (s) => `
* Skill: ${s.name} (${s.category})
  Supporting Evidence:
  ${s.evidence.map((e) => `  - ${e.title} [${e.tier}]`).join("\n")}
`
  )
  .join("\n")}

=====================================================
Verified by SkillSync Automated Multi-Stage Verification Engine
Fairness Exclusion List Applied: ["gender", "college tier", "name", "photo"]
=====================================================
  `;

  return new NextResponse(passportText, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SkillSync_Passport_${INITIAL_PASSPORT.studentId}.pdf"`,
    },
  });
}
