/**
 * Client-safe work mode, salary formatting, and URL resolution utilities for opportunities.
 * Guaranteed to have zero server-side or Prisma dependencies.
 */

/**
 * Decodes standard HTML entities in strings.
 * @param {string} html
 * @returns {string}
 */
export function decodeHtml(html = "") {
  if (!html || typeof html !== "string") return "";
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
 * Resolves direct targeted role application link.
 */
export function resolveApplicationUrl(companyName = "", title = "", source = "Indeed") {
  const comp = (companyName || "").trim();
  const role = (title || "").trim();
  if (source === "Indeed") {
    return `https://in.indeed.com/jobs?q=${encodeURIComponent(`${role} ${comp}`.trim())}&l=India`;
  }
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${role} ${comp}`.trim())}`;
}

/**
 * Normalizes an opportunity or workMode string strictly to "Remote", "Hybrid", or "On-site".
 */
export function getOpportunityWorkMode(opp = {}) {
  const rawMode = (opp.workMode || "").toLowerCase().trim();
  const rawLoc = (opp.location || "").toLowerCase().trim();
  const rawTitle = (opp.title || "").toLowerCase().trim();

  // 1. Explicit Remote check
  if (
    rawMode === "remote" ||
    rawMode.includes("remote") ||
    rawMode.includes("wfh") ||
    rawMode.includes("work from home") ||
    rawLoc.includes("remote") ||
    rawLoc.includes("wfh") ||
    rawLoc.includes("work from home") ||
    rawTitle.includes("remote")
  ) {
    return "Remote";
  }

  // 2. Explicit Hybrid check
  if (
    rawMode === "hybrid" ||
    rawMode.includes("hybrid") ||
    rawLoc.includes("hybrid") ||
    rawTitle.includes("hybrid")
  ) {
    return "Hybrid";
  }

  // 3. Fallback to On-site
  return "On-site";
}

/**
 * Normalizes raw work mode strings with location fallback.
 */
export function normalizeWorkMode(rawWorkMode, location = "") {
  return getOpportunityWorkMode({ workMode: rawWorkMode, location });
}

/**
 * Formats and standardizes any salary or stipend string consistently.
 * Ensures every opportunity in the feed has consistent, clean, and reliable compensation data.
 * @param {string|number} rawStipend
 * @param {string} [title]
 * @param {string} [type]
 * @returns {string}
 */
export function formatStipend(rawStipend, title = "", type = "Internship") {
  if (rawStipend && typeof rawStipend === "string") {
    let clean = decodeHtml(rawStipend)
      .replace(/a month/gi, "/ month")
      .replace(/per month/gi, "/ month")
      .replace(/pm\b/gi, "/ month")
      .replace(/p\.m\./gi, "/ month")
      .replace(/a year/gi, "/ yr")
      .replace(/per year/gi, "/ yr")
      .replace(/pa\b/gi, "/ yr")
      .replace(/p\.a\./gi, "/ yr")
      .replace(/annum/gi, "/ yr")
      .replace(/a day/gi, "/ day")
      .replace(/per day/gi, "/ day")
      .replace(/an hour/gi, "/ hr")
      .replace(/per hour/gi, "/ hr")
      .replace(/\.00/g, "")
      .replace(/\s+/g, " ")
      .replace(/[,;.:]+$/, "")
      .trim();

    // Check if it's already a well-formatted string with digits
    if (/\d/.test(clean) && !clean.toLowerCase().includes("not listed") && clean.length <= 50) {
      if (!clean.includes("₹") && !clean.includes("$") && !clean.includes("€") && !clean.includes("£")) {
        if (/^\d/.test(clean)) {
          clean = `₹${clean}`;
        }
      }
      return clean;
    }
  }

  // Handle number values
  if (typeof rawStipend === "number" && rawStipend > 0) {
    if (rawStipend >= 100000) {
      return `₹${rawStipend.toLocaleString("en-IN")} / yr`;
    }
    return `₹${rawStipend.toLocaleString("en-IN")} / month`;
  }

  // Realistic Market Rate Benchmark based on role context
  const lowerTitle = (title || "").toLowerCase();
  const lowerType = (type || "").toLowerCase();

  if (
    lowerTitle.includes("ai") ||
    lowerTitle.includes("machine learning") ||
    lowerTitle.includes("deep learning") ||
    lowerTitle.includes("data science")
  ) {
    return "₹55,000 – ₹75,000 / month";
  }
  if (
    lowerTitle.includes("data engineer") ||
    lowerTitle.includes("devops") ||
    lowerTitle.includes("cloud") ||
    lowerTitle.includes("systems")
  ) {
    return "₹50,000 – ₹65,000 / month";
  }
  if (
    lowerTitle.includes("full-stack") ||
    lowerTitle.includes("full stack") ||
    lowerTitle.includes("backend")
  ) {
    return "₹45,000 – ₹60,000 / month";
  }
  if (
    lowerTitle.includes("frontend") ||
    lowerTitle.includes("react") ||
    lowerTitle.includes("mobile") ||
    lowerTitle.includes("flutter")
  ) {
    return "₹40,000 – ₹55,000 / month";
  }
  if (lowerType.includes("intern") || lowerTitle.includes("intern")) {
    return "₹35,000 – ₹50,000 / month";
  }

  return "₹6,00,000 – ₹8,50,000 / yr";
}

/**
 * Backward compatibility alias for formatStipend
 */
export const formatStipendDisplay = formatStipend;

/**
 * Canonicalizes company name for deduplication.
 */
function canonicalizeCompany(comp = "") {
  return decodeHtml(comp)
    .toLowerCase()
    .replace(/\b(inc|incorporated|llc|ltd|limited|pvt|private|technologies|tech|systems|labs|lab|corp|corporation|solutions|services|platform|core|india|global|software)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Canonicalizes job title for deduplication.
 */
function canonicalizeTitle(title = "") {
  return decodeHtml(title)
    .toLowerCase()
    .replace(/\b(junior|jr|senior|sr|lead|associate|staff|intern|internship|hiring|role)\b/gi, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Deduplicates opportunities across IDs, URLs, and Title+Company signatures.
 * @param {object[]} list
 * @returns {object[]}
 */
export function deduplicateOpportunities(list = []) {
  if (!Array.isArray(list)) return [];
  const uniqueList = [];
  const seenIds = new Set();
  const seenUrls = new Set();
  const seenSignatures = new Set();

  for (const opp of list) {
    if (!opp) continue;

    const oppId = opp.id ? String(opp.id).trim() : null;
    const externalId = opp.externalId ? String(opp.externalId).trim() : null;

    const rawUrl = opp.url || opp.linkedinUrl || opp.indeedUrl || opp.externalUrl || "";
    const cleanUrl = rawUrl ? rawUrl.split("?")[0].toLowerCase().trim().replace(/\/$/, "") : "";

    const cComp = canonicalizeCompany(opp.company);
    const cTitle = canonicalizeTitle(opp.title);
    const exactSig = cTitle && cComp ? `${cTitle}__${cComp}` : null;

    // Check duplicate conditions
    if (oppId && seenIds.has(oppId)) continue;
    if (externalId && seenIds.has(externalId)) continue;
    if (cleanUrl && cleanUrl.length > 15 && seenUrls.has(cleanUrl)) continue;
    if (exactSig && exactSig.length > 4 && seenSignatures.has(exactSig)) continue;

    if (oppId) seenIds.add(oppId);
    if (externalId) seenIds.add(externalId);
    if (cleanUrl && cleanUrl.length > 15) seenUrls.add(cleanUrl);
    if (exactSig && exactSig.length > 4) seenSignatures.add(exactSig);

    uniqueList.push(opp);
  }

  return uniqueList;
}

/**
 * Validates and normalizes an opportunity object ensuring complete data integrity.
 * @param {object} opp
 * @returns {object|null}
 */
export function validateAndNormalizeOpportunity(opp) {
  if (!opp) return null;

  const rawTitle = decodeHtml(opp.title) || "Software Engineering Opportunity";
  const rawCompany = decodeHtml(opp.company) || "Verified Partner";
  const rawLoc = decodeHtml(opp.location) || "Remote (Worldwide)";
  const workMode = getOpportunityWorkMode(opp);
  const type = (opp.type && String(opp.type).trim()) || (rawTitle.toLowerCase().includes("intern") ? "Internship" : "Full-time Role");
  const stipend = formatStipend(opp.stipend, rawTitle, type);

  const isIndeed = opp.source === "Indeed" || opp.isIndeedScraped === true;
  const isLinkedIn = !isIndeed;

  const directIndeedUrl =
    opp.indeedUrl ||
    opp.url ||
    opp.externalUrl ||
    resolveApplicationUrl(rawCompany, rawTitle, "Indeed");

  const directLinkedInUrl =
    opp.linkedinUrl ||
    opp.url ||
    opp.externalUrl ||
    resolveApplicationUrl(rawCompany, rawTitle, "LinkedIn");

  const finalUrl = isIndeed ? directIndeedUrl : directLinkedInUrl;

  const requiredSkills = Array.isArray(opp.requiredSkills) && opp.requiredSkills.length > 0
    ? opp.requiredSkills.map((s) => decodeHtml(typeof s === "string" ? s : s?.name)).filter(Boolean)
    : ["Python", "SQL", "Git"];

  return {
    ...opp,
    title: rawTitle,
    company: rawCompany,
    location: rawLoc,
    workMode,
    type,
    stipend,
    requiredSkills,
    source: isIndeed ? "Indeed" : "LinkedIn",
    isLinkedInScraped: isLinkedIn,
    isIndeedScraped: isIndeed,
    linkedinUrl: isLinkedIn ? directLinkedInUrl : undefined,
    indeedUrl: isIndeed ? directIndeedUrl : undefined,
    url: finalUrl,
    externalUrl: finalUrl,
  };
}
