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
import { fetchLinkedInJobs, decodeHtml } from "@/lib/ingestion/linkedin";

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

    // Clean up any legacy Adzuna/Jooble database records
    await prisma.opportunity.deleteMany({
      where: {
        source: { in: ["Adzuna", "Jooble", "adzuna", "jooble"] },
      },
    }).catch(() => {});

    const fetchedDbOpps = await prisma.opportunity.findMany({
      where: {
        source: { notIn: ["Adzuna", "Jooble", "adzuna", "jooble"] },
      },
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

  // 2. Fetch live LinkedIn scraped jobs for student's active skills
  let scrapedLinkedInJobs = [];
  try {
    const fetchPromises = [];

    // Search for combination of top skills (e.g. "Python SQL developer intern")
    if (allUserSkills.length >= 2) {
      const combo = `${allUserSkills[0]} ${allUserSkills[1]} developer intern`;
      fetchPromises.push(fetchLinkedInJobs(combo, "India"));
    }

    // Search for individual skills (e.g. "Python intern", "SQL intern")
    for (const skill of allUserSkills.slice(0, 2)) {
      fetchPromises.push(fetchLinkedInJobs(`${skill} developer intern`, "India"));
    }

    const settledResults = await Promise.allSettled(fetchPromises);
    const combinedScraped = [];
    for (const r of settledResults) {
      if (r.status === "fulfilled" && Array.isArray(r.value)) {
        combinedScraped.push(...r.value);
      }
    }

    const uniqueScraped = [];
    const seenUrls = new Set();
    for (const job of combinedScraped) {
      if (job.url && !seenUrls.has(job.url)) {
        seenUrls.add(job.url);
        uniqueScraped.push({
          ...job,
          title: decodeHtml(job.title),
          company: decodeHtml(job.company),
          location: decodeHtml(job.location),
        });
      }
    }
    scrapedLinkedInJobs = uniqueScraped;
  } catch (scrapeErr) {
    console.warn("Live LinkedIn scrape attempt skipped:", scrapeErr.message);
  }

  // 3. Persist tailored and scraped listings to DB in background
  syncOpportunitiesToDb([...scrapedLinkedInJobs, ...tailoredOpps]).catch(() => {});

  // 4. Normalize existing DB opportunities
  const normalizedDbOpps = dbOpps.map((opp) => {
    const isLinkedIn = opp.source === "LinkedIn" || opp.isLinkedInScraped === true;
    return {
      ...opp,
      title: decodeHtml(opp.title),
      company: decodeHtml(opp.company),
      location: decodeHtml(opp.location),
      isLinkedInScraped: isLinkedIn,
      workMode: normalizeWorkMode(opp.workMode, opp.location),
      linkedinUrl: isLinkedIn ? (opp.linkedinUrl || opp.url) : undefined,
    };
  });

  // 5. Combine opportunities, prioritizing real scraped LinkedIn listings & tailored roles
  const combinedOpportunities = [...scrapedLinkedInJobs, ...tailoredOpps];
  const seenIds = new Set(combinedOpportunities.map((o) => o.id));

  for (const opp of normalizedDbOpps) {
    if (!seenIds.has(opp.id) && !seenIds.has(opp.externalId)) {
      combinedOpportunities.push(opp);
      seenIds.add(opp.id);
    }
  }

  // 6. Extract matching features and score
  const matchingFeatures = getMatchingFeatures(user || { skills: allUserSkills }, userEvidences);

  // Normalize lower-cased user skills for tier ranking
  const lowerUserSkills = allUserSkills.map((s) => s.toLowerCase().trim());

  // 7. Score each opportunity & calculate multi-skill match priority
  const scoredOpportunities = combinedOpportunities.map((opp) => {
    const scoreResult = calculateMatchScore(matchingFeatures, opp.requiredSkills || []);
    const isScraped = opp.isLinkedInScraped === true || opp.source === "LinkedIn";
    const directUrl =
      opp.linkedinUrl ||
      opp.url ||
      opp.externalUrl ||
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${opp.title} ${opp.company}`.trim())}`;

    // Extract raw string names for matched and missing skills
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
    // Primary matched index: 0 if first skill (e.g. Python), 1 if second skill (e.g. SQL), 999 if none
    const primarySkillIndex = matchedUserSkills.length > 0 ? matchedUserSkills[0].index : 999;

    return {
      ...opp,
      title: decodeHtml(opp.title),
      company: decodeHtml(opp.company),
      location: decodeHtml(opp.location),
      workMode: opp.workMode || normalizeWorkMode(null, opp.location),
      matchScore: scoreResult.score,
      matchedSkills: matchedNames,
      missingSkills: missingNames,
      matchedUserSkillCount,
      primarySkillIndex,
      isLinkedInScraped: isScraped,
      linkedinUrl: directUrl,
      url: directUrl,
      externalUrl: directUrl,
    };
  });

  // 8. Strict User Requirement Sorting:
  // - 1st: Listings containing BOTH/ALL skills (e.g. Python + SQL)
  // - 2nd: Listings containing ONLY the first skill (e.g. Python only)
  // - 3rd: Listings containing ONLY the second skill (e.g. SQL only)
  // - 4th: By highest matchScore descending
  scoredOpportunities.sort((a, b) => {
    // 1. Highest number of user skills matched (e.g. 2 > 1 > 0)
    if (b.matchedUserSkillCount !== a.matchedUserSkillCount) {
      return b.matchedUserSkillCount - a.matchedUserSkillCount;
    }

    // 2. If same count (e.g. 1 skill), sort by primary skill order (Python before SQL)
    if (a.primarySkillIndex !== b.primarySkillIndex) {
      return a.primarySkillIndex - b.primarySkillIndex;
    }

    // 3. Higher matchScore
    if ((b.matchScore || 0) !== (a.matchScore || 0)) {
      return (b.matchScore || 0) - (a.matchScore || 0);
    }

    // 4. Ingestion recency
    return new Date(b.ingestedAt || 0) - new Date(a.ingestedAt || 0);
  });

  return NextResponse.json({
    success: true,
    hasPassport: true,
    opportunities: scoredOpportunities,
    userSkillCount: allUserSkills.length,
    scrapedLinkedInCount: scrapedLinkedInJobs.length,
    fairnessAudit: {
      excludedParameters: ["gender", "college tier", "name", "photo"],
      verifiedAt: new Date().toISOString(),
    },
  });
}
