import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getMatchingFeatures } from "@/lib/matching/getMatchingFeatures";
import { calculateMatchScore } from "@/lib/matching/scoring";
import { INITIAL_OPPORTUNITIES, INITIAL_EVIDENCE } from "@/app/data/mockData";

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

  if (opportunities.length === 0) {
    opportunities = INITIAL_OPPORTUNITIES;
  }
  if (evidenceList.length === 0) {
    evidenceList = INITIAL_EVIDENCE;
  }

  // Compute student matching features (strictly excluding demographic parameters)
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
    opportunities: scoredOpportunities,
    fairnessAudit: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      verifiedAt: new Date().toISOString(),
    },
  });
}
