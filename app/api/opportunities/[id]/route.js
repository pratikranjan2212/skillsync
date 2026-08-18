import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { buildExplainableMatch } from "@/lib/matching/explainability";
import {
  generateTailoredOpportunities,
  normalizeWorkMode,
} from "@/lib/opportunities/opportunityService";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `opp-detail:${clientIp}`,
    RATE_LIMIT_PRESETS.GENERAL_API.maxRequests,
    RATE_LIMIT_PRESETS.GENERAL_API.windowMs
  );
  if (!rateLimit.success) {
    return createRateLimitResponse(rateLimit.resetTime);
  }

  const { id } = await params;

  let user = null;
  let opportunity = null;

  try {
    const session = await auth();
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;

    if (userId || userEmail) {
      user = await prisma.user.findFirst({
        where: {
          OR: [
            ...(userId ? [{ id: userId }] : []),
            ...(userEmail ? [{ email: userEmail }] : []),
          ],
        },
        include: {
          evidences: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    const dbOpp = await prisma.opportunity.findFirst({
      where: {
        OR: [{ id: id }, { externalId: id }],
      },
    });
    if (dbOpp) opportunity = dbOpp;
  } catch (err) {
    console.warn("DB Opportunity detail fallback:", err.message);
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

  // If not found in DB, check tailored opportunities pool
  if (!opportunity) {
    const tailored = generateTailoredOpportunities(allUserSkills);
    opportunity = tailored.find((op) => op.id === id || op.externalId === id);
  }

  if (!opportunity) {
    return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
  }

  const directLinkedInUrl =
    opportunity.linkedinUrl ||
    opportunity.url ||
    opportunity.externalUrl ||
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${opportunity.title} ${opportunity.company}`.trim())}`;

  const normalizedOpp = {
    ...opportunity,
    workMode: opportunity.workMode || normalizeWorkMode(null, opportunity.location),
    linkedinUrl: directLinkedInUrl,
    url: directLinkedInUrl,
    externalUrl: directLinkedInUrl,
  };

  const explanation = buildExplainableMatch(
    normalizedOpp,
    user || { skills: allUserSkills },
    userEvidences
  );

  return NextResponse.json({
    success: true,
    opportunity: {
      ...normalizedOpp,
      matchScore: explanation.matchScore,
    },
    explanation,
  });
}
