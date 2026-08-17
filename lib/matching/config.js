/**
 * SkillSync Matching Engine Central Configuration Matrix.
 * Allows easy tuning of scoring weights, thresholds, and tier coefficients without code rewrites.
 */

export const MATCH_CONFIG = {
  // Component Weights in Final Score (Sum = 1.00 / 100%)
  WEIGHTS: {
    REQUIRED_SKILLS: 0.60,      // 60% - Required/Core Skill Coverage & Criticality
    TITLE_RELEVANCE: 0.15,      // 15% - Job Title vs Candidate Skill & Domain Alignment
    PREFERRED_SKILLS: 0.10,     // 10% - Preferred / Nice-to-have Skills Bonus
    EXPERIENCE: 0.10,           // 10% - Experience Compatibility (Fresher friendly)
    EDUCATION: 0.05,            // 5%  - Education / Tech Degree Alignment (Neutral when absent)
  },

  // Verification Tier Multipliers (applied to verified evidence)
  TIER_WEIGHTS: {
    "verified-high": 1.00,      // High verification (QR validated / cryptographic proof / top tier)
    "verified-medium": 0.85,    // Medium verification (OCR parsed / active profile skill)
    "flagged-low": 0.50,        // Low verification (Unverified claim / flagged)
  },

  // Skill Importance / Criticality Multipliers
  CRITICALITY_WEIGHTS: {
    CRITICAL: 1.30,             // Primary programming languages, core architecture frameworks
    STANDARD: 1.00,             // Common libraries, databases, auxiliary tools
    SECONDARY: 0.70,            // General tools, methodologies, nice-to-have utilities
  },

  // Partial Match Relationship Coefficients Range
  RELATION_WEIGHTS: {
    SUB_TECH_TO_PARENT: 0.85,   // e.g. PostgreSQL -> SQL, DRF -> Django, Next.js -> React
    PARENT_TO_SUB_TECH: 0.65,   // e.g. SQL -> PostgreSQL, React -> Next.js
    ECOSYSTEM_COMPANION: 0.75,  // e.g. NumPy -> Python, Spring Boot -> Java
    ALTERNATIVE_STACK: 0.50,    // e.g. FastAPI -> Django, Flask -> Django
  },

  // Human-Readable Score Bands & Badges
  SCORE_BANDS: [
    { min: 90, max: 100, label: "Excellent Match", color: "emerald", badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { min: 75, max: 89,  label: "Strong Match",    color: "emerald", badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200" },
    { min: 60, max: 74,  label: "Good Match",      color: "teal",    badgeBg: "bg-teal-50 text-teal-800 border-teal-200" },
    { min: 40, max: 59,  label: "Partial Match",   color: "amber",   badgeBg: "bg-amber-50 text-amber-800 border-amber-200" },
    { min: 0,  max: 39,  label: "Weak Match",      color: "neutral", badgeBg: "bg-neutral-100 text-neutral-700 border-neutral-200" },
  ],

  // Confidence Thresholds based on Job Metadata Completeness
  CONFIDENCE_LEVELS: {
    HIGH: { minPoints: 80, label: "High Confidence" },
    MEDIUM: { minPoints: 50, label: "Medium Confidence" },
    LOW: { minPoints: 0, label: "Low Confidence" },
  },

  // Demographic Bias Exclusion Guarantee (Fairness Policy)
  EXCLUDED_BIAS_PARAMETERS: [
    "gender",
    "college tier",
    "name",
    "photo",
    "age",
    "race",
    "postal code",
  ],
};

/**
 * Returns human-readable score band label and badge styling for a numerical score.
 * @param {number} score (0-100)
 * @returns {object} { label, color, badgeBg }
 */
export function getScoreBand(score) {
  const normalized = Math.max(0, Math.min(100, Math.round(score || 0)));
  for (const band of MATCH_CONFIG.SCORE_BANDS) {
    if (normalized >= band.min) {
      return { ...band, score: normalized };
    }
  }
  return { ...MATCH_CONFIG.SCORE_BANDS[MATCH_CONFIG.SCORE_BANDS.length - 1], score: normalized };
}
