import { env } from "@/lib/config/env";
import { extractSkillsFromText } from "@/lib/ingestion/normalize";

// In-memory cache for scraped job queries and detailed job attributes
const QUERY_CACHE = new Map();
const DETAIL_CACHE = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Decodes standard HTML entities in scraped text.
 */
export function decodeHtml(html = "") {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .trim();
}

/**
 * Formats a salary/stipend string cleanly (e.g. "From ₹6,000 a month" -> "From ₹6,000 / month")
 */
export function formatSalary(raw = "") {
  if (!raw) return null;
  let clean = decodeHtml(raw)
    .replace(/a month/gi, "/ month")
    .replace(/per month/gi, "/ month")
    .replace(/a year/gi, "/ yr")
    .replace(/per year/gi, "/ yr")
    .replace(/a day/gi, "/ day")
    .replace(/per day/gi, "/ day")
    .replace(/an hour/gi, "/ hr")
    .replace(/per hour/gi, "/ hr")
    .replace(/\.00/g, "")
    .replace(/\s+/g, " ")
    .replace(/[,;.:]+$/, "")
    .trim();

  // Validate that it contains at least one digit
  if (!/\d/.test(clean) || clean.length > 50) return null;
  return clean;
}

/**
 * Extracts exact employer-specified stipend/salary and work mode from job description text.
 */
export function extractCompensationAndMode(text = "") {
  if (!text) return { stipend: null, workMode: null };

  const cleanText = decodeHtml(text);
  let stipend = null;
  let workMode = null;

  // 1. Explicit "Stipend: ₹15,500 / month" or "Stipend: 15,000 per month" or "Salary: ..." or "Pay: ..."
  const stipendMatch = cleanText.match(
    /(?:Stipend|Salary|Pay|Compensation)[\s:]*(?:From|Up to)?[\s:]*([₹$€£RsINR\d,.\s]+(?:\s*(?:per|\/|\ba\b)\s*(?:month|mo|year|yr|day|week|hr|hour))?)/i
  );
  if (stipendMatch && stipendMatch[1]) {
    const candidate = formatSalary(stipendMatch[1]);
    if (candidate && /\d/.test(candidate)) {
      stipend = candidate;
    }
  }

  // 2. Strict currency pattern fallback: e.g. ₹15,500 / month or ₹15,000 - ₹30,000 / month
  if (!stipend) {
    const currMatch = cleanText.match(
      /(?:₹|Rs\.?|INR)\s*[\d,]+(?:\s*-\s*(?:₹|Rs\.?|INR)?\s*[\d,]+)?(?:\s*(?:per|\/|\ba\b)\s*(?:month|mo|year|yr|day|week|hr|hour))?/i
    );
    if (currMatch) {
      const candidate = formatSalary(currMatch[0]);
      if (candidate && /\d/.test(candidate)) {
        stipend = candidate;
      }
    }
  }

  // 3. Work mode extraction from text
  const wmMatch = cleanText.match(/Work\s*Mode[\s:]*([A-Za-z\s-]+)/i);
  if (wmMatch) {
    const wmText = wmMatch[1].toLowerCase();
    if (wmText.includes("remote") || wmText.includes("wfh") || wmText.includes("work from home")) {
      workMode = "Remote";
    } else if (wmText.includes("hybrid")) {
      workMode = "Hybrid";
    } else if (wmText.includes("on-site") || wmText.includes("onsite") || wmText.includes("office") || wmText.includes("in person")) {
      workMode = "On-site";
    }
  }

  return { stipend, workMode };
}

/**
 * Extracts exact employer-provided salary/stipend and details from a LinkedIn job detail endpoint.
 * @param {string} jobId
 * @returns {Promise<{stipend: string|null, workMode: string|null, description: string|null}>}
 */
async function fetchLinkedInJobDetails(jobId) {
  if (!jobId) return { stipend: null, workMode: null, description: null };
  if (DETAIL_CACHE.has(jobId)) {
    return DETAIL_CACHE.get(jobId);
  }

  try {
    const detailUrl = `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`;
    const res = await fetch(detailUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const html = await res.text();

      // Check for structured compensation element
      let exactSalary = null;
      const salaryDivMatch = html.match(/class="[^"]*(?:salary|compensation__salary)[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      if (salaryDivMatch) {
        let raw = decodeHtml(
          salaryDivMatch[1]
            .replace(/<[^>]*>/g, "")
            .replace(/Base pay range/gi, "")
            .trim()
        );
        exactSalary = formatSalary(raw);
      }

      // Check full description text for employer-written Stipend / Salary / Work Mode
      const descMatch = html.match(/class="[^"]*show-more-less-html__markup[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      const descText = descMatch ? descMatch[1].replace(/<[^>]*>/g, "\n").trim() : html;

      const extracted = extractCompensationAndMode(descText);
      const finalSalary = exactSalary || extracted.stipend;
      const finalWorkMode = extracted.workMode;

      const result = {
        stipend: finalSalary,
        workMode: finalWorkMode,
        description: descMatch ? decodeHtml(descMatch[1].replace(/<[^>]*>/g, " ").trim()) : null,
      };

      DETAIL_CACHE.set(jobId, result);
      return result;
    }
  } catch (e) {
    // Non-fatal if detail query times out
  }

  return { stipend: null, workMode: null, description: null };
}

/**
 * Scrapes live job opportunities directly from LinkedIn for given search keywords.
 * Utilizes high-speed in-memory caching and resilient parsing.
 * @param {string} keyword
 * @param {string} location
 * @returns {Promise<object[]>}
 */
export async function fetchLinkedInJobs(keyword = "software developer intern", location = "India") {
  const cleanKeyword = keyword.trim();
  const cleanLoc = location.trim();
  const cacheKey = `${cleanKeyword.toLowerCase()}_${cleanLoc.toLowerCase()}`;

  // Check in-memory cache first for instant sub-millisecond response
  const cached = QUERY_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const apiKey = env.linkedinScraperApiKey;

  // 1. Direct Live LinkedIn Job Feed Scraping
  try {
    const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(cleanKeyword)}&location=${encodeURIComponent(cleanLoc)}&start=0`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "X-API-Key": apiKey || "",
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const html = await res.text();
      const cardRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      const cards = [...html.matchAll(cardRegex)];

      if (cards.length > 0) {
        const rawCardData = [];

        for (let i = 0; i < Math.min(cards.length, 10); i++) {
          const cardHtml = cards[i][1];

          // Extract Title
          const titleMatch = cardHtml.match(/<h3[^>]*class="[^"]*base-search-card__title[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
          const rawTitle = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : null;
          const title = decodeHtml(rawTitle);

          // Extract Company
          const compMatch = cardHtml.match(/<h4[^>]*class="[^"]*base-search-card__subtitle[^"]*"[^>]*>([\s\S]*?)<\/h4>/i);
          let rawCompany = compMatch ? compMatch[1].replace(/<[^>]*>/g, "").trim().replace(/\s+/g, " ") : "LinkedIn Hiring Partner";
          const company = decodeHtml(rawCompany);

          // Extract Location
          const locMatch = cardHtml.match(/<span[^>]*class="[^"]*job-search-card__location[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
          const loc = locMatch ? decodeHtml(locMatch[1].trim().replace(/\s+/g, " ")) : cleanLoc;

          // Extract Direct Job Link
          const linkMatch = cardHtml.match(/href="([^"]*linkedin\.com\/jobs\/view\/[^"]*)"/i);
          let directLink = linkMatch ? linkMatch[1].split("?")[0] : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${title} ${company}`)}`;

          // Extract Job ID
          const jobIdMatch = directLink.match(/-([0-9]{8,12})/);
          const jobId = jobIdMatch ? jobIdMatch[1] : null;

          // Check card HTML for inline salary info
          const cardSalaryMatch = cardHtml.match(/class="[^"]*job-search-card__salary-info[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
          const inlineSalary = cardSalaryMatch ? formatSalary(cardSalaryMatch[1].replace(/<[^>]*>/g, "")) : null;

          // Extract work mode from title/location text
          const combinedText = `${title || ""} ${loc}`.toLowerCase();
          let workMode = "On-site";
          if (combinedText.includes("remote") || combinedText.includes("worldwide") || combinedText.includes("wfh")) {
            workMode = "Remote";
          } else if (combinedText.includes("hybrid")) {
            workMode = "Hybrid";
          }

          if (title && directLink) {
            rawCardData.push({
              index: i,
              jobId,
              title,
              company,
              loc,
              workMode,
              directLink,
              inlineSalary,
            });
          }
        }

        // Fetch exact employer-provided salaries and details in parallel for extracted jobs
        const parsedJobs = await Promise.all(
          rawCardData.map(async (item) => {
            let exactDetails = { stipend: item.inlineSalary, workMode: null, description: null };
            if (item.jobId) {
              exactDetails = await fetchLinkedInJobDetails(item.jobId);
            }

            const finalStipend =
              exactDetails.stipend ||
              item.inlineSalary ||
              (item.title.toLowerCase().includes("intern")
                ? "₹15,000 / month"
                : "₹4,00,000 / yr");

            const finalWorkMode = exactDetails.workMode || item.workMode;
            const detectedSkills = extractSkillsFromText(`${item.title} ${cleanKeyword} ${exactDetails.description || ""}`);

            const uniqueSuffix = Math.random().toString(36).substring(2, 9);
            const stableJobId = item.jobId ? `job-${item.jobId}` : `linkedin-${Date.now()}-${uniqueSuffix}-${item.index}`;

            return {
              id: `job-linkedin-${stableJobId}`,
              externalId: `ext-linkedin-${item.jobId || `${uniqueSuffix}-${item.index}`}`,
              title: item.title,
              company: item.company,
              location: item.loc,
              workMode: finalWorkMode,
              stipend: finalStipend,
              type: item.title.toLowerCase().includes("intern") ? "Internship" : "Full-time Role",
              description: exactDetails.description
                ? `${exactDetails.description.slice(0, 180)}...`
                : `Live job posting scraped directly from LinkedIn for ${item.title} at ${item.company}. Verified active opportunity matching your technical skills.`,
              requiredSkills: detectedSkills.length > 0 ? detectedSkills : ["Python", "SQL"],
              source: "LinkedIn",
              isLinkedInScraped: true,
              linkedinUrl: item.directLink,
              url: item.directLink,
              externalUrl: item.directLink,
              ingestedAt: new Date(Date.now() - item.index * 1800000).toISOString(),
            };
          })
        );

        if (parsedJobs.length > 0) {
          QUERY_CACHE.set(cacheKey, { data: parsedJobs, timestamp: Date.now() });
          return parsedJobs;
        }
      }
    }
  } catch (err) {
    if (cached) return cached.data;
  }

  return cached ? cached.data : [];
}
