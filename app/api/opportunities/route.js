import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getMatchingFeatures } from "@/lib/matching/getMatchingFeatures";
import { calculateMatchScore } from "@/lib/matching/scoring";
import {
  generateTailoredOpportunities,
  normalizeWorkMode,
  formatStipend,
  deduplicateOpportunities,
  validateAndNormalizeOpportunity,
  decodeHtml,
  syncOpportunitiesToDb,
} from "@/lib/opportunities/opportunityService";
import { fetchLinkedInJobs } from "@/lib/ingestion/linkedin";
import { fetchIndeedJobs } from "@/lib/ingestion/indeed";
import { checkRateLimit, createRateLimitResponse, RATE_LIMIT_PRESETS, getClientIp } from "@/lib/security/rateLimit";
import { logSecurityEvent, SecurityEvent, LogLevel } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

// Server-side response cache (key: skillSignature, TTL: 3 minutes)
const FEED_CACHE = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000;

export async function GET(request) {
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(
    `feed-scraping:${clientIp}`,
    RATE_LIMIT_PRESETS.FEED_SCRAPING.maxRequests,
    RATE_LIMIT_PRESETS.FEED_SCRAPING.windowMs
  );

  if (!rateLimit.success) {
    logSecurityEvent(SecurityEvent.AUTH_RATE_LIMIT_EXCEEDED, LogLevel.ALERT, {
      ip: clientIp,
      route: "/api/opportunities",
      method: "GET",
      details: { reason: "Rapid job feed scraping rate limit exceeded" },
    });
    return createRateLimitResponse(rateLimit.resetTime, "Too many requests to opportunity feed. Please slow down.");
  }

  let user = null;
  let dbOpps = [];

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

    const fetchedDbOpps = await prisma.opportunity.findMany({
      where: {
        source: { notIn: ["Adzuna", "Jooble", "adzuna", "jooble"] },
      },
      orderBy: { createdAt: "desc" },
      take: 150,
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
    const defaultTailored = generateTailoredOpportunities([
      "React", "Python", "SQL", "JavaScript", "TypeScript", "Node.js", "Docker"
    ]);

    const normalizedDbOpps = dbOpps
      .map((opp) => validateAndNormalizeOpportunity(opp))
      .filter(Boolean);

    const normalizedTailored = defaultTailored
      .map((opp) => validateAndNormalizeOpportunity(opp))
      .filter(Boolean);

    const combinedGuestOpps = deduplicateOpportunities([...normalizedTailored, ...normalizedDbOpps]);

    return NextResponse.json({
      success: true,
      hasPassport: false,
      isGuest: true,
      opportunities: combinedGuestOpps,
      userSkillCount: 0,
      message: "Sign in with your student account to unlock personalized AI match scores & Skill Passport calibration.",
      fairnessAudit: {
        excludedParameters: ["gender", "college tier", "name", "photo"],
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // Fast-path: Check server memory cache for this user skill combination
  const cacheKey = allUserSkills.slice().sort().join("|").toLowerCase();
  const cachedFeed = FEED_CACHE.get(cacheKey);
  if (cachedFeed && Date.now() - cachedFeed.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      hasPassport: true,
      opportunities: cachedFeed.data,
      userSkillCount: allUserSkills.length,
      isCached: true,
      fairnessAudit: {
        excludedParameters: ["gender", "college tier", "name", "photo"],
        verifiedAt: new Date().toISOString(),
      },
    });
  }

  // 1. Generate tailored partner opportunities based on skills
  const rawTailoredOpps = generateTailoredOpportunities(allUserSkills);
  const tailoredOpps = rawTailoredOpps.map((opp) => validateAndNormalizeOpportunity(opp)).filter(Boolean);

  // 2. Fetch live LinkedIn and Indeed scraped jobs in parallel
  let scrapedLinkedInJobs = [];
  let scrapedIndeedJobs = [];

  try {
    const fetchPromises = [];

    if (allUserSkills.length >= 2) {
      const combo = `${allUserSkills[0]} ${allUserSkills[1]}`;
      fetchPromises.push(fetchLinkedInJobs(`${combo} developer intern`, "India"));
      fetchPromises.push(fetchIndeedJobs(`${combo} intern`, "India"));
      fetchPromises.push(fetchLinkedInJobs(`${allUserSkills[0]} developer intern`, "India"));
      fetchPromises.push(fetchIndeedJobs(`${allUserSkills[0]} intern`, "India"));
    } else if (allUserSkills.length === 1) {
      fetchPromises.push(fetchLinkedInJobs(`${allUserSkills[0]} developer intern`, "India"));
      fetchPromises.push(fetchIndeedJobs(`${allUserSkills[0]} intern`, "India"));
    }

    const settledResults = await Promise.allSettled(fetchPromises);

    for (const r of settledResults) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        for (const job of r.value) {
          if (job.source === "LinkedIn") {
            scrapedLinkedInJobs.push(job);
          } else if (job.source === "Indeed") {
            scrapedIndeedJobs.push(job);
          }
        }
      }
    }
  } catch (scrapeErr) {
    console.warn("Live scraping attempt skipped:", scrapeErr.message);
  }

  // Deduplicate and normalize scraped jobs immediately
  const uniqueScrapedLinkedIn = deduplicateOpportunities(
    scrapedLinkedInJobs.map((opp) => validateAndNormalizeOpportunity(opp)).filter(Boolean)
  );
  const uniqueScrapedIndeed = deduplicateOpportunities(
    scrapedIndeedJobs.map((opp) => validateAndNormalizeOpportunity(opp)).filter(Boolean)
  );

  // 3. Persist to DB in background
  syncOpportunitiesToDb([...uniqueScrapedLinkedIn, ...uniqueScrapedIndeed, ...tailoredOpps]).catch(() => {});

  // 4. Normalize existing DB opportunities
  const normalizedDbOpps = dbOpps
    .map((opp) => validateAndNormalizeOpportunity(opp))
    .filter(Boolean);

  // 5. Combine and strictly deduplicate all opportunities
  const rawCombined = [...uniqueScrapedLinkedIn, ...uniqueScrapedIndeed, ...tailoredOpps, ...normalizedDbOpps];
  const combinedOpportunities = deduplicateOpportunities(rawCombined);

  // 6. Extract matching features and score
  const matchingFeatures = getMatchingFeatures(user || { skills: allUserSkills }, userEvidences);
  const lowerUserSkills = allUserSkills.map((s) => s.toLowerCase().trim());

  // 7. Score each opportunity & calculate multi-skill match priority
  const scoredOpportunities = combinedOpportunities.map((opp) => {
    const scoreResult = calculateMatchScore(matchingFeatures, opp.requiredSkills || []);
    const isIndeed = opp.source === "Indeed" || opp.isIndeedScraped === true;
    const isLinkedIn = !isIndeed;

    const directIndeedUrl =
      opp.indeedUrl ||
      opp.url ||
      opp.externalUrl ||
      `https://in.indeed.com/jobs?q=${encodeURIComponent(`${opp.title} ${opp.company}`.trim())}&l=India`;

    const directLinkedInUrl =
      opp.linkedinUrl ||
      opp.url ||
      opp.externalUrl ||
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${opp.title} ${opp.company}`.trim())}`;

    const matchedNames = scoreResult.matchedSkills.map((m) => m.name);
    const missingNames = scoreResult.missingSkills.map((m) => m.name);

    // Calculate which user skills are matched by this role
    const matchedUserSkills = [];
    for (let i = 0; i < allUserSkills.length; i++) {
      const uSkill = allUserSkills[i];
      const uLower = lowerUserSkills[i];
      const hasMatch = matchedNames.some(
        (mn) => mn.toLowerCase().trim() === uLower || mn.toLowerCase().includes(uLower)
      );
      if (hasMatch) {
        matchedUserSkills.push({ skill: uSkill, index: i });
      }
    }

    const matchedUserSkillCount = matchedUserSkills.length;
    const primarySkillIndex = matchedUserSkills.length > 0 ? matchedUserSkills[0].index : 999;

    return {
      ...opp,
      title: decodeHtml(opp.title),
      company: decodeHtml(opp.company),
      location: decodeHtml(opp.location),
      workMode: opp.workMode,
      stipend: formatStipend(opp.stipend, opp.title, opp.type),
      matchScore: scoreResult.score,
      matchedSkills: matchedNames,
      missingSkills: missingNames,
      matchedUserSkillCount,
      primarySkillIndex,
      source: isIndeed ? "Indeed" : "LinkedIn",
      isLinkedInScraped: isLinkedIn,
      isIndeedScraped: isIndeed,
      linkedinUrl: isLinkedIn ? directLinkedInUrl : undefined,
      indeedUrl: isIndeed ? directIndeedUrl : undefined,
      url: isIndeed ? directIndeedUrl : directLinkedInUrl,
      externalUrl: isIndeed ? directIndeedUrl : directLinkedInUrl,
    };
  });

  // 8. Strict Requirement: Exclude any listing where NOT A SINGLE SKILL matches the candidate
  const filteredOpportunities = scoredOpportunities.filter(
    (opp) =>
      (opp.matchedSkills && opp.matchedSkills.length > 0) ||
      (opp.matchedUserSkillCount && opp.matchedUserSkillCount > 0)
  );

  // 9. Multi-Skill Requirement Sorting:
  filteredOpportunities.sort((a, b) => {
    if (b.matchedUserSkillCount !== a.matchedUserSkillCount) {
      return b.matchedUserSkillCount - a.matchedUserSkillCount;
    }
    if (a.primarySkillIndex !== b.primarySkillIndex) {
      return a.primarySkillIndex - b.primarySkillIndex;
    }
    if ((b.matchScore || 0) !== (a.matchScore || 0)) {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }
    return new Date(b.ingestedAt || 0) - new Date(a.ingestedAt || 0);
  });

  // Cache the final filtered response in server memory
  FEED_CACHE.set(cacheKey, { data: filteredOpportunities, timestamp: Date.now() });

  return NextResponse.json({
    success: true,
    hasPassport: true,
    opportunities: filteredOpportunities,
    userSkillCount: allUserSkills.length,
    scrapedLinkedInCount: uniqueScrapedLinkedIn.length,
    scrapedIndeedCount: uniqueScrapedIndeed.length,
    fairnessAudit: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      verifiedAt: new Date().toISOString(),
    },
  });
}
