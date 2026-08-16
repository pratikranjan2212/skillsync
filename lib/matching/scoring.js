const TIER_WEIGHTS = {
  "verified-high": 1.0,
  "verified-medium": 0.8,
  "flagged-low": 0.4,
};

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
    verifiedMap.set(s.name.toLowerCase(), s);
  }

  const matchedSkills = [];
  const missingSkills = [];
  let weightedScoreTotal = 0;

  for (const reqSkill of requiredSkills) {
    const key = reqSkill.toLowerCase();
    const match = verifiedMap.get(key);

    if (match) {
      const weight = TIER_WEIGHTS[match.tier] || 0.5;
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
