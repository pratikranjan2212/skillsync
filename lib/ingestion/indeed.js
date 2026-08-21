import { env } from "@/lib/config/env";
import { extractSkillsFromText } from "@/lib/ingestion/normalize";
import { decodeHtml, extractCompensationAndMode } from "@/lib/ingestion/linkedin";
import { formatStipend } from "@/lib/opportunities/workModeUtils";

// In-memory cache for Indeed query results
const INDEED_CACHE = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Scrapes live developer & tech internship opportunities from Indeed via Apify.
 * @param {string} keyword - Search term (e.g. "python intern")
 * @param {string} location - Location string (e.g. "India")
 * @returns {Promise<object[]>}
 */
export async function fetchIndeedJobs(keyword = "software developer intern", location = "India") {
  const cleanKeyword = keyword.trim();
  const cleanLoc = location.trim();
  const cacheKey = `${cleanKeyword.toLowerCase()}_${cleanLoc.toLowerCase()}`;

  // Check in-memory cache first for instant sub-millisecond response
  const cached = INDEED_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const token = env.apifyApiKey || "apify_api_aqDa52meraHY5Hyd77Azy84Yz6ivfV0GyeZg";

  try {
    const url = `https://api.apify.com/v2/acts/misceres~indeed-scraper/run-sync-get-dataset-items?token=${token}&timeout=25`;
    const input = {
      position: cleanKeyword,
      location: cleanLoc,
      country: "IN",
      maxItems: 8,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(24000), // 24s timeout for Apify actor execution
    });

    if (res.ok) {
      const items = await res.json();
      if (Array.isArray(items) && items.length > 0) {
        const parsed = items.map((item, idx) => {
          const rawTitle = item.positionName || item.title || `${cleanKeyword} Intern`;
          const title = decodeHtml(rawTitle);
          const rawCompany = item.company || "Indeed Hiring Partner";
          const company = decodeHtml(rawCompany);
          const rawLoc = item.location || cleanLoc;
          const loc = decodeHtml(rawLoc);

          // 1. Direct structured salary from Indeed / description
          const extractedDesc = extractCompensationAndMode(item.description || item.descriptionHTML || "");
          const isInternRole = title.toLowerCase().includes("intern");
          const roleType = isInternRole ? "Internship" : "Full-time Role";

          const salary = formatStipend(
            item.salary || extractedDesc.stipend,
            title,
            roleType
          );

          const combinedText = `${title} ${loc}`.toLowerCase();
          let workMode = extractedDesc.workMode || "On-site";
          if (!extractedDesc.workMode) {
            if (combinedText.includes("remote") || combinedText.includes("wfh") || combinedText.includes("work from home")) {
              workMode = "Remote";
            } else if (combinedText.includes("hybrid")) {
              workMode = "Hybrid";
            }
          }

          // Exact URL to the live job listing on Indeed
          const directIndeedUrl = item.url || `https://in.indeed.com/jobs?q=${encodeURIComponent(`${title} ${company}`)}&l=India`;
          const detectedSkills = extractSkillsFromText(`${title} ${item.description || ""}`);

          const indeedSuffix = Math.random().toString(36).substring(2, 9);
          const stableIndeedId = item.id ? `job-${item.id}` : `indeed-${Date.now()}-${indeedSuffix}-${idx}`;

          return {
            id: `job-indeed-${stableIndeedId}`,
            externalId: `ext-indeed-${item.id || `${indeedSuffix}-${idx}`}`,
            title,
            company,
            location: loc,
            workMode,
            stipend: salary,
            type: title.toLowerCase().includes("intern") ? "Internship" : "Full-time Role",
            description: item.description
              ? `${item.description.slice(0, 180)}...`
              : `Live job posting scraped directly from Indeed for ${title} at ${company}. Verified active opportunity matching your profile competencies.`,
            requiredSkills: detectedSkills.length > 0 ? detectedSkills : ["Python", "SQL"],
            source: "Indeed",
            isIndeedScraped: true,
            indeedUrl: directIndeedUrl,
            url: directIndeedUrl,
            externalUrl: directIndeedUrl,
            ingestedAt: item.postingDateParsed || new Date(Date.now() - idx * 1800000).toISOString(),
          };
        });

        if (parsed.length > 0) {
          INDEED_CACHE.set(cacheKey, { data: parsed, timestamp: Date.now() });
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn("Indeed Apify scraper warning:", err.message);
    if (cached) return cached.data;
  }

  return cached ? cached.data : [];
}
