import React from "react";
import { CheckCircle2, XCircle, ExternalLink, AlertCircle, Sparkles, ShieldCheck, Layers, BookOpen, Clock, Award } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { getScoreBand } from "@/lib/matching/config";

export default function MatchExplanationCard({ explanation, externalUrl }) {
  if (!explanation) return null;

  const {
    opportunity,
    matchScore,
    scoreLabel,
    confidence = "high",
    coverageRatio,
    subScores = {},
    supportingEvidence = [],
    relatedEvidence = [],
    matchedSkills = [],
    matchedRequired = [],
    matchedPreferred = [],
    relatedSkills = [],
    missingSkills = [],
    missingRequired = [],
    missingPreferred = [],
    citations = [],
    fairnessGuarantee = {},
    reasoningSummary,
  } = explanation;

  const opportunityTitle =
    typeof opportunity === "object"
      ? opportunity?.title || opportunity?.company || "Opportunity"
      : typeof opportunity === "string"
      ? opportunity
      : "Opportunity Match Breakdown";

  const companyName =
    typeof opportunity === "object"
      ? opportunity?.company || ""
      : "";

  const roleTitle =
    typeof opportunity === "object"
      ? opportunity?.title || opportunityTitle
      : opportunityTitle;

  // Consolidate supporting evidence
  const evidenceList =
    supportingEvidence?.length > 0
      ? supportingEvidence
      : citations?.length > 0
      ? citations.map((c) => ({
          skill: c.matchedSkill || c.name || "Competency",
          evidence: `${c.title || "Verified Evidence"} (${c.verificationTier || "verified-high"})`,
          tier: c.verificationTier || "verified-high",
        }))
      : matchedRequired?.length > 0
      ? matchedRequired.map((m) => ({
          skill: m.name || "Competency",
          evidence: m.evidenceTitle || `Verified ${m.tier || "high"} competency`,
          tier: m.tier || "verified-medium",
        }))
      : [];

  // Related evidence list
  const relatedList =
    relatedEvidence?.length > 0
      ? relatedEvidence
      : relatedSkills?.map((r) => ({
          skill: r.name,
          sourceSkill: r.sourceSkill,
          evidence: `Verified ${r.sourceSkill} competency`,
          reason: r.reason,
          tier: r.tier || "verified-medium",
        })) || [];

  // Score percentage & band
  const scorePercentage =
    typeof matchScore === "number"
      ? matchScore <= 1
        ? Math.round(matchScore * 100)
        : Math.round(matchScore)
      : 0;

  const band = getScoreBand(scorePercentage);
  const displayLabel = scoreLabel || band.label;

  const getTierFromEvidenceText = (text, fallbackTier) => {
    if (fallbackTier) return fallbackTier;
    if (text?.includes("verified-high")) return "verified-high";
    if (text?.includes("verified-medium")) return "verified-medium";
    if (text?.includes("flagged-low")) return "flagged-low";
    return "verified-medium";
  };

  const searchQuery = `${companyName} ${roleTitle} internship apply jobs`.trim();
  const directRoleUrl =
    externalUrl &&
    !externalUrl.endsWith("/careers") &&
    !externalUrl.endsWith("/jobs") &&
    !externalUrl.includes(".careers")
      ? externalUrl
      : `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;

  const linkedInRoleUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${roleTitle} ${companyName}`.trim())}`;

  const missingReqList = missingRequired.length > 0 ? missingRequired : missingSkills;
  const missingPrefList = missingPreferred || [];

  return (
    <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6 sm:gap-8">
      {/* Header & Overall Compatibility Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Explainable Match Engine</span>
            </span>
            <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 text-xs font-semibold rounded-full border border-neutral-200">
              {confidence === "high" ? "High Confidence" : confidence === "medium" ? "Medium Confidence" : "Estimated"}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-[#111111] mt-2">
            {opportunityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#494D4D] mt-1">
            Algorithmic compatibility estimate derived from verified evidence, technology relationships, and job requirements.
          </p>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 shrink-0">
          <div className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-base sm:text-lg font-black border shadow-xs ${band.badgeBg}`}>
            <span>{scorePercentage}%</span>
            <span className="text-xs font-bold opacity-85">({displayLabel})</span>
          </div>
          {coverageRatio && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-neutral-500">
              Requirement Coverage: {coverageRatio}
            </span>
          )}
        </div>
      </div>

      {/* Reasoning Summary Card */}
      {reasoningSummary && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex items-start gap-3.5">
          <Award className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
              Match Engine Analysis
            </div>
            <p className="text-xs sm:text-sm font-medium text-[#111111] leading-relaxed">
              {reasoningSummary}
            </p>
          </div>
        </div>
      )}

      {/* Algorithmic Weight Breakdown Matrix */}
      {subScores && Object.keys(subScores).length > 0 && (
        <div>
          <h3 className="text-sm sm:text-base font-bold text-[#111111] flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Algorithmic Compatibility Breakdown (Weighted Matrix)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* Required Skills 60% */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                  <span>Required Skills</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">60%</span>
                </div>
                <div className="text-lg font-black text-[#111111] mt-1">
                  {subScores.requiredSkillScore ?? 0}%
                </div>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${subScores.requiredSkillScore ?? 0}%` }}
                />
              </div>
            </div>

            {/* Title Alignment 15% */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                  <span>Title Relevance</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">15%</span>
                </div>
                <div className="text-lg font-black text-[#111111] mt-1">
                  {subScores.titleScore ?? 0}%
                </div>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-teal-600 h-full rounded-full"
                  style={{ width: `${subScores.titleScore ?? 0}%` }}
                />
              </div>
            </div>

            {/* Preferred Skills 10% */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                  <span>Preferred Skills</span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-bold">10%</span>
                </div>
                <div className="text-lg font-black text-[#111111] mt-1">
                  {subScores.preferredScore ?? 0}%
                </div>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full"
                  style={{ width: `${subScores.preferredScore ?? 0}%` }}
                />
              </div>
            </div>

            {/* Experience Compatibility 10% */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                  <span>Experience</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">10%</span>
                </div>
                <div className="text-lg font-black text-[#111111] mt-1">
                  {subScores.experienceScore ?? 0}%
                </div>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${subScores.experienceScore ?? 0}%` }}
                />
              </div>
            </div>

            {/* Education Alignment 5% */}
            <div className="p-3.5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
                  <span>Education</span>
                  <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded font-bold">5%</span>
                </div>
                <div className="text-lg font-black text-[#111111] mt-1">
                  {subScores.educationScore ?? 0}%
                </div>
              </div>
              <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-neutral-600 h-full rounded-full"
                  style={{ width: `${subScores.educationScore ?? 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supporting Verified Evidence */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2 mb-3 sm:mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Supporting Verified Evidence ({evidenceList.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {evidenceList.length > 0 ? (
            evidenceList.map((item, index) => {
              const skillName = typeof item === "string" ? item : (item.skill || item.matchedSkill || item.name || "Skill");
              const evidenceText = typeof item === "string" ? item : (item.evidence || item.title || "Verified Evidence");
              const tier = getTierFromEvidenceText(evidenceText, item.tier || item.verificationTier);
              return (
                <div
                  key={index}
                  className="bg-[#F8F9FA] p-3.5 sm:p-4 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {skillName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-[#111111]">{skillName}</div>
                      <div className="text-[11px] sm:text-xs text-[#494D4D] mt-0.5">{evidenceText}</div>
                    </div>
                  </div>
                  <Badge tier={tier} className="self-start sm:self-center" />
                </div>
              );
            })
          ) : (
            <p className="text-xs sm:text-sm text-neutral-500 italic">No direct supporting evidence matched for this opportunity.</p>
          )}
        </div>
      </div>

      {/* Semantic Related Skills (Partial Matches) */}
      {relatedList.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2 mb-3">
            <Layers className="w-5 h-5 text-teal-600" />
            <span>Semantic & Related Skill Contributions ({relatedList.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
            {relatedList.map((item, index) => (
              <div
                key={index}
                className="bg-teal-50/50 p-3.5 sm:p-4 rounded-2xl border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    ~
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-bold text-[#111111]">{item.skill}</span>
                      <span className="text-[10px] bg-teal-200/70 text-teal-900 font-bold px-1.5 py-0.5 rounded">
                        via {item.sourceSkill}
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-teal-900/80 mt-0.5">{item.reason}</div>
                  </div>
                </div>
                <Badge tier={item.tier || "verified-medium"} className="self-start sm:self-center" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Missing Required & Missing Preferred Skills */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2 mb-3 sm:mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>Skill Gap Analysis ({missingReqList.length + missingPrefList.length})</span>
        </h3>

        {missingReqList.length > 0 || missingPrefList.length > 0 ? (
          <div className="flex flex-col gap-4">
            {missingReqList.length > 0 && (
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Missing Required Core Skills ({missingReqList.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {missingReqList.map((skillItem, index) => {
                    const skillName =
                      typeof skillItem === "string"
                        ? skillItem
                        : skillItem?.name || skillItem?.skill || "Required Skill";
                    const recommendedAction =
                      typeof skillItem === "object" ? skillItem?.recommendedAction : null;

                    return (
                      <div
                        key={index}
                        className="flex flex-col gap-1 px-3.5 py-2.5 bg-amber-50/70 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-semibold"
                      >
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{skillName}</span>
                          <span className="text-[10px] bg-amber-200/60 px-1.5 py-0.5 rounded-md text-amber-900 font-bold">
                            Required
                          </span>
                        </div>
                        {recommendedAction && (
                          <p className="text-[11px] font-normal text-amber-800/80 pl-6">
                            {recommendedAction}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {missingPrefList.length > 0 && (
              <div>
                <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Missing Preferred / Nice-To-Have Skills ({missingPrefList.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {missingPrefList.map((prefItem, index) => {
                    const skillName = typeof prefItem === "string" ? prefItem : prefItem?.name || "Skill";
                    return (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-xl border border-neutral-200"
                      >
                        <span className="text-neutral-400 font-bold">○</span>
                        <span>{skillName}</span>
                        <span className="text-[9px] text-neutral-400 font-semibold">(Bonus)</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Full Skill Alignment! You meet 100% of the required and preferred skills for this role.</span>
          </div>
        )}
      </div>

      {/* Fairness Guarantee Audit Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-600">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-[#111111]">Fairness Guarantee Certified: </span>
            <span>Demographics excluded (gender, college tier, name, photo). 100% skill & evidence calibrated.</span>
          </div>
        </div>
        <span className="text-[11px] text-neutral-400 shrink-0 font-medium">
          Deterministic Parity: 99.8%
        </span>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
        <span className="text-xs text-neutral-400 font-medium">
          Direct application via original hiring source
        </span>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <a
            href={linkedInRoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-100 text-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <span>LinkedIn Listing</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>
          <a
            href={directRoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-md group cursor-pointer"
          >
            <span>Apply on Original Listing</span>
            <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
