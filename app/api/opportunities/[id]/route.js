import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { buildExplainableMatch } from "@/lib/matching/explainability";
import { INITIAL_OPPORTUNITIES, INITIAL_EVIDENCE } from "@/app/data/mockData";

export async function GET(request, { params }) {
  const { id } = await params;

  let opportunity = null;
  let evidenceList = [];

  try {
    const dbOpp = await prisma.opportunity.findFirst({
      where: {
        OR: [{ id: id }, { externalId: id }],
      },
    });
    if (dbOpp) opportunity = dbOpp;

    const dbEv = await prisma.evidence.findMany();
    if (dbEv && dbEv.length > 0) evidenceList = dbEv;
  } catch (err) {
    console.warn("DB Opportunity detail fallback:", err.message);
  }

  if (!opportunity) {
    opportunity =
      INITIAL_OPPORTUNITIES.find((op) => op.id === id || op.externalId === id) ||
      INITIAL_OPPORTUNITIES[0];
  }

  if (evidenceList.length === 0) {
    evidenceList = INITIAL_EVIDENCE;
  }

  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  const explanation = buildExplainableMatch(opportunity, {}, evidenceList);

  return NextResponse.json({
    success: true,
    opportunity: {
      ...opportunity,
      matchScore: explanation.matchScore,
    },
    explanation,
  });
}
