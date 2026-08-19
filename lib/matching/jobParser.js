/**
 * SkillSync Structured Job Requirement Parser.
 * Extracts required skills, preferred skills, experience bounds, education requirements,
 * seniority, and data completeness metrics from job titles and descriptions.
 */

import { normalizeSkillKey, resolveSkillMetadata, SKILL_DEFINITIONS } from "./taxonomy.js";

// Common tech keywords to look for when scanning text
const RECOGNIZED_TECH_KEYS = Object.keys(SKILL_DEFINITIONS);

/**
 * Scans a text block and extracts recognized technical skills.
 * @param {string} text
 * @returns {string[]} Canonical skill keys
 */
export function extractSkillsFromTextBlock(text = "") {
  if (!text || typeof text !== "string") return [];

  const lower = ` ${text.toLowerCase()} `;
  const detected = new Set();

  for (const key of RECOGNIZED_TECH_KEYS) {
    // Exact word boundary regex
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|[\\s,.;:()\\[\\]\\/\\-])${escaped}(?:$|[\\s,.;:()\\[\\]\\/\\-])`, "i");
    if (regex.test(lower)) {
      detected.add(key);
    }
  }

  // Handle common compound aliases in text
  if (/\b(react\.js|reactjs)\b/i.test(lower)) detected.add("react");
  if (/\b(node\.js|nodejs|node\s+js)\b/i.test(lower)) detected.add("node.js");
  if (/\b(next\.js|nextjs)\b/i.test(lower)) detected.add("next.js");
  if (/\b(django\s+rest|drf)\b/i.test(lower)) detected.add("django rest framework");
  if (/\b(spring\s+boot|springboot)\b/i.test(lower)) detected.add("spring boot");
  if (/\b(tailwind\s+css|tailwindcss)\b/i.test(lower)) detected.add("tailwind css");
  if (/\b(rest\s+api|restful\s+api|restful)\b/i.test(lower)) detected.add("rest api");
  if (/\b(machine\s+learning|ml)\b/i.test(lower)) detected.add("machine learning");
  if (/\b(deep\s+learning|dl)\b/i.test(lower)) detected.add("deep learning");
  if (/\b(data\s+engineering|etl)\b/i.test(lower)) detected.add("data engineering");

  return Array.from(detected);
}

/**
 * Extracts experience parameters from title and description.
 * @param {string} text
 * @param {string} title
 * @param {string} type
 * @returns {object} { minYears, maxYears, isFresherFriendly, isSenior, seniority }
 */
export function parseExperienceRequirements(text = "", title = "", type = "") {
  const combined = `${title} ${type} ${text}`.toLowerCase();

  const isInternship =
    combined.includes("intern") ||
    combined.includes("internship") ||
    combined.includes("trainee") ||
    combined.includes("fellowship");

  const isFresherPhrase =
    combined.includes("fresher") ||
    combined.includes("freshers") ||
    combined.includes("entry level") ||
    combined.includes("entry-level") ||
    combined.includes("new grad") ||
    combined.includes("graduate") ||
    combined.includes("0-1 year") ||
    combined.includes("0-2 year") ||
    combined.includes("0 to 1 year") ||
    combined.includes("0 to 2 year") ||
    combined.includes("0 - 1 year") ||
    combined.includes("0 - 2 year") ||
    combined.includes("no experience required");

  const isSeniorPhrase =
    combined.includes("senior") ||
    combined.includes("sr.") ||
    combined.includes("lead") ||
    combined.includes("principal") ||
    combined.includes("staff engineer") ||
    combined.includes("architect") ||
    combined.includes("5+ year") ||
    combined.includes("6+ year") ||
    combined.includes("7+ year") ||
    combined.includes("8+ year") ||
    combined.includes("10+ year");

  let minYears = 0;
  let maxYears = 2;

  if (isInternship || isFresherPhrase) {
    minYears = 0;
    maxYears = isInternship ? 1 : 2;
  } else if (isSeniorPhrase) {
    minYears = 5;
    maxYears = 10;
  } else {
    // Regex for patterns like "3-5 years", "2+ years", "3 to 5 years"
    const expRegex = /(\d+)\s*(?:-|to|\+)?\s*(\d+)?\s*(?:years?|yrs?)(?:\s*of)?\s*(?:relevant\s*)?experience/i;
    const match = combined.match(expRegex);

    if (match) {
      minYears = parseInt(match[1], 10);
      maxYears = match[2] ? parseInt(match[2], 10) : minYears + 2;
    } else {
      // Default to junior/entry level if not explicitly indicated
      minYears = 0;
      maxYears = 2;
    }
  }

  let seniority = "junior";
  if (isInternship) seniority = "intern";
  else if (minYears >= 5 || isSeniorPhrase) seniority = "senior";
  else if (minYears >= 3) seniority = "mid";
  else seniority = "junior";

  const isFresherFriendly = isInternship || isFresherPhrase || minYears <= 1;

  return {
    minYears,
    maxYears,
    isFresherFriendly,
    isSenior: seniority === "senior",
    seniority,
  };
}

/**
 * Extracts education requirements from text.
 * @param {string} text
 * @returns {object} { requiresDegree, degreeTypes, isCsPreferred }
 */
export function parseEducationRequirements(text = "") {
  const lower = text.toLowerCase();

  const csMatch =
    lower.includes("computer science") ||
    lower.includes("cs/it") ||
    lower.includes("information technology") ||
    lower.includes("software engineering") ||
    lower.includes("related technical field");

  const degreeMatch =
    lower.includes("bachelor") ||
    lower.includes("b.tech") ||
    lower.includes("b.e.") ||
    lower.includes("b.s.") ||
    lower.includes("master") ||
    lower.includes("m.tech") ||
    lower.includes("m.s.") ||
    lower.includes("degree in");

  return {
    requiresDegree: degreeMatch,
    isCsPreferred: csMatch,
    explicitText: degreeMatch ? (csMatch ? "Bachelor's/Master's in Computer Science or related" : "Technical Degree") : null,
  };
}

/**
 * Classifies the role domain based on title and tech skills.
 * @param {string} title
 * @param {string[]} skills
 * @returns {string}
 */
export function classifyRoleDomain(title = "", skills = []) {
  const t = title.toLowerCase();
  if (t.includes("frontend") || t.includes("front-end") || t.includes("ui") || t.includes("web developer")) return "Frontend";
  if (t.includes("backend") || t.includes("back-end") || t.includes("api") || t.includes("server")) return "Backend";
  if (t.includes("full stack") || t.includes("fullstack") || t.includes("software engineer") || t.includes("software developer")) return "Full-Stack";
  if (t.includes("ai") || t.includes("machine learning") || t.includes("data") || t.includes("ml")) return "AI, ML & Data";
  if (t.includes("devops") || t.includes("cloud") || t.includes("infrastructure") || t.includes("sre")) return "Cloud & DevOps";
  if (t.includes("mobile") || t.includes("android") || t.includes("ios") || t.includes("flutter")) return "Mobile";

  // Fallback based on top skills
  const joined = skills.join(" ").toLowerCase();
  if (joined.includes("react") || joined.includes("tailwind") || joined.includes("html")) return "Frontend";
  if (joined.includes("python") || joined.includes("django") || joined.includes("node") || joined.includes("spring")) return "Backend";
  if (joined.includes("tensorflow") || joined.includes("pytorch") || joined.includes("pandas")) return "AI, ML & Data";

  return "Software Engineering";
}

/**
 * Parses complete job object into structured job requirement schema.
 * @param {object} job - Raw job or Opportunity record
 * @returns {object} Structured Job Requirements
 */
export function parseJobRequirements(job = {}) {
  if (job && job.__isParsedJob) {
    return job;
  }

  const title = (job.title || "").trim();
  const description = (job.description || "").trim();
  const rawRequiredSkills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  const type = job.type || (title.toLowerCase().includes("intern") ? "Internship" : "Full-time");

  // 1. Separate Required vs Preferred Skills
  const requiredSkillSet = new Set();
  const preferredSkillSet = new Set();

  // Add all explicit tagged skills to required by default
  for (const sk of rawRequiredSkills) {
    const canon = normalizeSkillKey(sk);
    if (canon) requiredSkillSet.add(canon);
  }

  // Scan description for section headers (e.g., "Required Skills:", "Preferred Qualifications:")
  if (description) {
    const descLower = description.toLowerCase();

    const preferredSectionMatch = descLower.match(/(?:preferred|nice to have|good to have|bonus|plus|desired|optional)[\s\S]*?(?:requirements|required|must have|responsibilities|$)/i);
    if (preferredSectionMatch) {
      const preferredText = preferredSectionMatch[0];
      const detectedPreferred = extractSkillsFromTextBlock(preferredText);
      for (const p of detectedPreferred) {
        if (!requiredSkillSet.has(p)) {
          preferredSkillSet.add(p);
        }
      }
    }

    const requiredSectionMatch = descLower.match(/(?:requirements|required|must have|essential|mandatory|qualifications)[\s\S]*?(?:preferred|nice to have|bonus|about us|$)/i);
    if (requiredSectionMatch) {
      const requiredText = requiredSectionMatch[0];
      const detectedReq = extractSkillsFromTextBlock(requiredText);
      for (const r of detectedReq) {
        requiredSkillSet.add(r);
      }
    }

    // If no explicit skills existed yet, scan full description & title
    if (requiredSkillSet.size === 0) {
      const fullDetected = extractSkillsFromTextBlock(`${title} ${description}`);
      fullDetected.forEach((s) => requiredSkillSet.add(s));
    }
  }

  // If still empty, scan title
  if (requiredSkillSet.size === 0) {
    const titleSkills = extractSkillsFromTextBlock(title);
    if (titleSkills.length > 0) {
      titleSkills.forEach((s) => requiredSkillSet.add(s));
    } else {
      // Default fallback based on title domain
      if (title.toLowerCase().includes("frontend")) {
        requiredSkillSet.add("react");
        requiredSkillSet.add("javascript");
      } else if (title.toLowerCase().includes("python")) {
        requiredSkillSet.add("python");
        requiredSkillSet.add("sql");
      } else {
        requiredSkillSet.add("python");
        requiredSkillSet.add("rest api");
      }
    }
  }

  // Convert canonical keys into structured skill metadata list
  const structuredRequired = Array.from(requiredSkillSet).map((key) => resolveSkillMetadata(key));
  const structuredPreferred = Array.from(preferredSkillSet).map((key) => resolveSkillMetadata(key));

  // 2. Parse Experience
  const experience = parseExperienceRequirements(description, title, type);

  // 3. Parse Education
  const education = parseEducationRequirements(description);

  // 4. Classify Domain
  const domain = classifyRoleDomain(title, Array.from(requiredSkillSet));

  // 5. Calculate Data Completeness & Confidence Points
  let dataPoints = 0;
  if (title.length > 5) dataPoints += 25;
  if (structuredRequired.length >= 2) dataPoints += 30;
  if (description.length > 60) dataPoints += 25;
  if (job.stipend || job.salary) dataPoints += 10;
  if (job.location) dataPoints += 10;

  let confidence = "high";
  if (dataPoints < 50 || description.length < 30) {
    confidence = "low";
  } else if (dataPoints < 75) {
    confidence = "medium";
  }

  return {
    __isParsedJob: true,
    id: job.id,
    externalId: job.externalId,
    title,
    company: (job.company || "Company").trim(),
    description,
    type,
    location: job.location || "Remote",
    stipend: job.stipend || null,
    domain,
    requiredSkills: structuredRequired,
    preferredSkills: structuredPreferred,
    experience,
    education,
    seniority: experience.seniority,
    confidence,
    dataCompleteness: dataPoints,
  };
}
