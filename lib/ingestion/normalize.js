const COMMON_TAXONOMY_SKILLS = [
  "Python",
  "SQL",
  "React",
  "TensorFlow",
  "Docker",
  "REST API design",
  "Tailwind CSS",
  "Data Engineering",
  "Node js",
  "PostgreSQL",
  "Git",
  "Next.js",
  "TypeScript",
  "Deep Learning",
  "AWS",
  "GraphQL",
];

/**
 * Extracts recognized taxonomy skills from job title and description text.
 * @param {string} text
 * @returns {string[]}
 */
export function extractSkillsFromText(text = "") {
  if (!text) return ["Python", "SQL"];

  const detected = new Set();
  const lower = text.toLowerCase();

  for (const skill of COMMON_TAXONOMY_SKILLS) {
    const skillLower = skill.toLowerCase();
    const regex = new RegExp(`\\b${skillLower.replace(".", "\\.")}\\b`, "i");
    if (regex.test(lower)) {
      detected.add(skill);
    }
  }

  // Common aliases
  if (/\breact(\.js|js)?\b/i.test(lower)) detected.add("React");
  if (/\bnode(\.js|js|\s+js)?\b/i.test(lower)) detected.add("Node js");

  // Ensure every opportunity has at least 2 relevant skills
  if (detected.size === 0) {
    if (lower.includes("frontend") || lower.includes("web") || lower.includes("ui")) {
      detected.add("React");
      detected.add("Tailwind CSS");
    } else if (lower.includes("ai") || lower.includes("ml") || lower.includes("data")) {
      detected.add("Python");
      detected.add("TensorFlow");
      detected.add("SQL");
    } else {
      detected.add("Python");
      detected.add("REST API design");
    }
  }

  return Array.from(detected);
}

/**
 * Normalizes a raw job object into the standard SkillSync Opportunity format.
 * @param {object} raw
 * @param {string} sourceName
 * @returns {object}
 */
export function normalizeOpportunity(raw, sourceName = "Direct") {
  const title = raw.title || raw.jobTitle || "Software Engineer Intern";
  const company = raw.company_name || raw.company || raw.companyName || "Tech Innovations";
  const location = raw.candidate_required_location || raw.location || "Remote";
  const stipend = raw.salary || raw.stipend || (raw.salary_min ? `₹${raw.salary_min} / mo` : "₹40,000 / month");
  const type = raw.job_type || raw.type || (title.toLowerCase().includes("intern") ? "Internship" : "Full-time");
  const description = raw.description || raw.snippet || "";
  const externalId = raw.id ? `job-${sourceName.toLowerCase()}-${raw.id}` : `job-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const url = raw.url || raw.link || raw.redirect_url || "";

  const requiredSkills =
    Array.isArray(raw.tags) && raw.tags.length > 0
      ? raw.tags
      : extractSkillsFromText(`${title} ${description}`);

  return {
    externalId,
    title,
    company,
    location,
    stipend,
    type,
    description: description.replace(/<[^>]*>?/gm, "").substring(0, 500),
    requiredSkills,
    source: sourceName,
    url,
  };
}
