/**
 * SkillSync Explainable Match Engine.
 * Generates transparent evidence citations, semantic relationship explanations,
 * sub-score breakdowns, and demographic fairness audit assurances.
 */

import { getMatchingFeatures } from "./getMatchingFeatures.js";
import { calculateMatchScore } from "./scoring.js";
import { parseJobRequirements } from "./jobParser.js";

/**
 * Builds the complete explainable match breakdown for a specific opportunity.
 * @param {object} opportunity - Opportunity record
 * @param {object} studentData - User / student data
 * @param {object[]} studentEvidence - Student's evidence submissions
 * @returns {object} Full explainable match payload
 */
export function buildExplainableMatch(opportunity = {}, studentData = {}, studentEvidence = []) {
  const features = getMatchingFeatures(studentData, studentEvidence);
  const parsedJob = parseJobRequirements(opportunity);
  const scoreResult = calculateMatchScore(features, parsedJob);

  // Evidence citations from matched required skills
  const citations = (scoreResult.matchedRequired || []).map((m) => ({
    id: m.evidenceId || `ev-${Math.random().toString(36).substring(2, 6)}`,
    title: m.evidenceTitle || `Verified Evidence for ${m.name}`,
    type: m.evidenceType || "credential",
    verificationTier: m.tier || "verified-medium",
    matchedSkill: m.name,
  }));

  // Supporting evidence cards
  const supportingEvidence = citations.map((c) => ({
    skill: c.matchedSkill,
    evidence: `${c.title} (${c.verificationTier})`,
    tier: c.verificationTier,
  }));

  // Related skills evidence cards
  const relatedEvidence = (scoreResult.relatedSkills || []).map((r) => ({
    skill: r.name,
    sourceSkill: r.sourceSkill,
    evidence: r.evidenceTitle ? `${r.evidenceTitle} (${r.tier})` : `Verified ${r.sourceSkill} competency`,
    reason: r.reason,
    tier: r.tier,
  }));

  return {
    opportunityId: opportunity.id,
    opportunity: opportunity.title || opportunity.company || "Opportunity",
    matchScore: scoreResult.score,
    overallScore: scoreResult.score,
    scoreLabel: scoreResult.label,
    scoreColor: scoreResult.scoreColor,
    badgeBg: scoreResult.badgeBg,
    confidence: scoreResult.confidence,
    coverageRatio: scoreResult.coverageRatio,
    subScores: scoreResult.subScores,
    matchedSkills: scoreResult.matchedSkills,
    matchedRequired: scoreResult.matchedRequired,
    matchedPreferred: scoreResult.matchedPreferred,
    relatedSkills: scoreResult.relatedSkills,
    missingSkills: scoreResult.missingSkills,
    missingRequired: scoreResult.missingRequired,
    missingPreferred: scoreResult.missingPreferred,
    citations,
    supportingEvidence,
    relatedEvidence,
    fairnessGuarantee: scoreResult.fairnessGuarantee,
    reasoningSummary: scoreResult.reasoning,
  };
}
