/**
 * Client-safe work mode and URL resolution utilities for opportunities.
 * Guaranteed to have zero server-side or Prisma dependencies.
 */

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
