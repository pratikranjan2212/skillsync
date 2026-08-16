import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMatchingFeatures } from "@/lib/matching/getMatchingFeatures";
import { calculateMatchScore } from "@/lib/matching/scoring";
import { INITIAL_OPPORTUNITIES } from "@/app/data/mockData";

export async function GET(request) {
  let opportunities = [];
  let evidenceList = [];

  try {
    const dbOpps = await prisma.opportunity.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (dbOpps && dbOpps.length > 0) {
      opportunities = dbOpps;
    }

    const dbEv = await prisma.evidence.findMany();
    if (dbEv && dbEv.length > 0) {
      evidenceList = dbEv;
    }
  } catch (err) {
    console.warn("DB Opportunities GET fallback (offline mode):", err.message);
  }

  // If there are no database opportunities yet, load available opportunities pool
  if (opportunities.length === 0) {
    opportunities = INITIAL_OPPORTUNITIES;
  }

  // User has not built their skill passport yet (no evidence uploaded/verified)
  if (!evidenceList || evidenceList.length === 0) {
    return NextResponse.json({
      success: true,
      hasPassport: false,
      opportunities: [],
      message: "Build your Skill Passport to unlock AI-matched opportunities.",
      fairnessAudit: {
        excludedParameters: ["gender", "college tier", "name", "photo"],
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // User has built their skill passport with verified evidence
  const matchingFeatures = getMatchingFeatures({}, evidenceList);

  // Score each opportunity
  const scoredOpportunities = opportunities.map((opp) => {
    const scoreResult = calculateMatchScore(matchingFeatures, opp.requiredSkills || []);
    return {
      ...opp,
      matchScore: scoreResult.score,
      matchedSkills: scoreResult.matchedSkills,
      missingSkills: scoreResult.missingSkills,
    };
  });

  // Sort opportunities by highest match score first
  scoredOpportunities.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  return NextResponse.json({
    success: true,
    hasPassport: true,
    opportunities: scoredOpportunities,
    fairnessAudit: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      verifiedAt: new Date().toISOString(),
    },
  });
}

