const TIER_WEIGHTS = {
  "verified-high": 1.0,
  "verified-medium": 0.8,
  "flagged-low": 0.4,
};

const SKILL_SYNONYMS = {
  "react": ["react", "react.js", "reactjs"],
  "react.js": ["react", "react.js", "reactjs"],
  "node": ["node", "node.js", "nodejs"],
  "node.js": ["node", "node.js", "nodejs"],
  "next": ["next", "next.js", "nextjs"],
  "next.js": ["next", "next.js", "nextjs"],
  "tailwind": ["tailwind", "tailwind css", "tailwindcss"],
  "tailwind css": ["tailwind", "tailwind css", "tailwindcss"],
  "postgres": ["postgres", "postgresql"],
  "postgresql": ["postgres", "postgresql"],
  "mongo": ["mongo", "mongodb"],
  "mongodb": ["mongo", "mongodb"],
  "ts": ["ts", "typescript"],
  "typescript": ["ts", "typescript"],
  "js": ["js", "javascript"],
  "javascript": ["js", "javascript"],
  "ml": ["ml", "machine learning"],
  "machine learning": ["ml", "machine learning"],
  "dl": ["dl", "deep learning"],
  "deep learning": ["dl", "deep learning"],
  "ai": ["ai", "artificial intelligence"],
  "rest": ["rest", "rest api", "rest api design", "restful apis"],
  "rest api design": ["rest", "rest api", "rest api design", "restful apis"],
  "docker": ["docker", "dockerfile", "containers"],
  "kubernetes": ["kubernetes", "k8s"],
  "data engineering": ["data engineering", "etl", "data pipelines"],
  "git": ["git", "git & github", "github"],
};

function findSkillMatch(reqSkill, verifiedMap) {
  const key = reqSkill.toLowerCase().trim();
  if (verifiedMap.has(key)) {
    return verifiedMap.get(key);
  }

  // Check synonym groups
  const synonyms = SKILL_SYNONYMS[key] || [];
  for (const syn of synonyms) {
    if (verifiedMap.has(syn)) {
      return verifiedMap.get(syn);
    }
  }

  // Check partial substring match (e.g. "React" in "React.js" or "SQL" in "PostgreSQL")
  for (const [vKey, vVal] of verifiedMap.entries()) {
    if (
      vKey.includes(key) ||
      key.includes(vKey) ||
      (SKILL_SYNONYMS[vKey] && SKILL_SYNONYMS[vKey].includes(key))
    ) {
      return vVal;
    }
  }

  return null;
}

/**
 * Computes deterministic match score between student features and job requirements.
 * @param {object} matchingFeatures - Output of getMatchingFeatures()
 * @param {string[]} requiredSkills - List of required skill names for opportunity
 * @returns {object}
 */
export function calculateMatchScore(matchingFeatures, requiredSkills = []) {
  if (!requiredSkills || requiredSkills.length === 0) {
    return {
      score: 85,
      matchPercentage: 85,
      matchedSkills: [],
      missingSkills: [],
    };
  }

  const verifiedSkills = matchingFeatures?.verifiedSkills || [];
  const verifiedMap = new Map();

  for (const s of verifiedSkills) {
    if (s && s.name) {
      verifiedMap.set(s.name.toLowerCase().trim(), s);
    }
  }

  const matchedSkills = [];
  const missingSkills = [];
  let weightedScoreTotal = 0;

  for (const reqSkill of requiredSkills) {
    const match = findSkillMatch(reqSkill, verifiedMap);

    if (match) {
      const weight = TIER_WEIGHTS[match.tier] || 0.8;
      weightedScoreTotal += weight;
      matchedSkills.push({
        name: reqSkill,
        tier: match.tier,
        evidenceId: match.evidenceId,
        evidenceTitle: match.evidenceTitle,
        evidenceType: match.evidenceType,
      });
    } else {
      missingSkills.push({
        name: reqSkill,
        status: "missing",
        recommendedAction: `Complete a verified project or course demonstrating ${reqSkill}`,
      });
    }
  }

  const maxPossible = requiredSkills.length;
  const rawPercentage = Math.round((weightedScoreTotal / maxPossible) * 100);
  const score = Math.max(15, Math.min(100, rawPercentage));

  return {
    score,
    matchPercentage: score,
    matchedSkills,
    missingSkills,
    coverageRatio: `${matchedSkills.length}/${requiredSkills.length}`,
  };
}
