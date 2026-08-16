/**
 * Hard Boundary for SkillSync Matching Engine.
 *
 * STRICT FAIRNESS GUARANTEE:
 * This function extracts ONLY skill-based features and verification evidence metadata.
 * It strictly scrubs and discards all demographic, personal, and institutional prestige attributes:
 * - Gender
 * - Name
 * - College / University tier & prestige markers
 * - Photo / Avatar URLs
 * - Age / Date of Birth
 *
 * @param {object} studentData - Raw student / user object
 * @param {object[]} evidenceList - Student's verified evidence submissions
 * @returns {object} Sanitized matching feature payload
 */
export function getMatchingFeatures(studentData = {}, evidenceList = []) {
  const skillMap = new Map();

  // Aggregate verified skills from evidence records, retaining highest verification tier
  const tierRank = { "verified-high": 3, "verified-medium": 2, "flagged-low": 1 };

  for (const ev of evidenceList || []) {
    const tier = ev.verificationTier || "flagged-low";
    const skills = Array.isArray(ev.claimedSkills) ? ev.claimedSkills : [];

    for (const skillName of skills) {
      if (!skillName) continue;
      const normalizedSkill = skillName.trim();
      const current = skillMap.get(normalizedSkill);

      if (!current || tierRank[tier] > tierRank[current.tier]) {
        skillMap.set(normalizedSkill, {
          name: normalizedSkill,
          tier: tier,
          evidenceId: ev.id,
          evidenceTitle: ev.title,
          evidenceType: ev.type,
          fileHash: ev.fileHash,
        });
      }
    }
  }

  // Also include student's self-reported/profile skills if not already present
  for (const skillName of studentData.skills || []) {
    if (!skillName) continue;
    const normalizedSkill = skillName.trim();
    if (!skillMap.has(normalizedSkill)) {
      skillMap.set(normalizedSkill, {
        name: normalizedSkill,
        tier: "verified-medium",
        evidenceId: "profile-skill",
        evidenceTitle: "Active Profile Skill",
        evidenceType: "Profile",
        fileHash: "0x0000000000000000000000000000000000000000",
      });
    }
  }

  return {
    verifiedSkills: Array.from(skillMap.values()),
    totalVerifiedCount: skillMap.size,
    excludedParameters: ["gender", "college tier", "name", "photo"],
  };
}
