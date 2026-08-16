import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getMatchingFeatures } from "@/lib/matching/getMatchingFeatures";
import { calculateMatchScore } from "@/lib/matching/scoring";
import {
  generateTailoredOpportunities,
  normalizeWorkMode,
  syncOpportunitiesToDb,
} from "@/lib/opportunities/opportunityService";

export const dynamic = "force-dynamic";

export async function GET(request) {
  let user = null;
  let dbOpps = [];

  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (userEmail) {
      user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
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
          evidences: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    const fetchedDbOpps = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (fetchedDbOpps && fetchedDbOpps.length > 0) {
      dbOpps = fetchedDbOpps;
    }
  } catch (err) {
    console.warn("DB Opportunities GET fallback:", err.message);
  }

  const userSkills = user?.skills || [];
  const userEvidences = user?.evidences || [];

  const evidenceSkills = [];
  for (const ev of userEvidences) {
    for (const sk of ev.claimedSkills || []) {
      if (sk && !evidenceSkills.includes(sk)) {
        evidenceSkills.push(sk);
      }
    }
  }

  const allUserSkills = Array.from(new Set([...userSkills, ...evidenceSkills]));

  // Check if at least one skill or evidence is added
  const hasSkillsOrEvidence = allUserSkills.length > 0;

  if (!hasSkillsOrEvidence) {
    return NextResponse.json({
      success: true,
      hasPassport: false,
      opportunities: [],
      message: "Add at least one skill or evidence to unlock AI-matched opportunities.",
      fairnessAudit: {
        excludedParameters: ["gender", "college tier", "name", "photo"],
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // 1. Generate opportunities tailored directly to the student's active skills
  const tailoredOpps = generateTailoredOpportunities(allUserSkills);

  // 2. Persist to DB in the background
  syncOpportunitiesToDb(tailoredOpps).catch(() => {});

  // 3. Normalize existing DB opportunities (if any) and attach workMode
  const normalizedDbOpps = dbOpps.map((opp) => ({
    ...opp,
    workMode: normalizeWorkMode(opp.workMode, opp.location),
  }));

  // 4. Combine opportunities, prioritizing tailored listings
  const combinedOpportunities = [...tailoredOpps];
  const seenIds = new Set(tailoredOpps.map((o) => o.id));

  for (const opp of normalizedDbOpps) {
    if (!seenIds.has(opp.id) && !seenIds.has(opp.externalId)) {
      combinedOpportunities.push(opp);
      seenIds.add(opp.id);
    }
  }

  // 5. User has skills: extract features and compute scores
  const matchingFeatures = getMatchingFeatures(user || { skills: allUserSkills }, userEvidences);

  // 6. Score each opportunity
  const scoredOpportunities = combinedOpportunities.map((opp) => {
    const scoreResult = calculateMatchScore(matchingFeatures, opp.requiredSkills || []);
    return {
      ...opp,
      workMode: opp.workMode || normalizeWorkMode(null, opp.location),
      matchScore: scoreResult.score,
      matchedSkills: scoreResult.matchedSkills,
      missingSkills: scoreResult.missingSkills,
    };
  });

  // 7. Sort opportunities by highest match score first
  scoredOpportunities.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return NextResponse.json({
    success: true,
    hasPassport: true,
    opportunities: scoredOpportunities,
    userSkillCount: allUserSkills.length,
    fairnessAudit: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      verifiedAt: new Date().toISOString(),
    },
  });
}
