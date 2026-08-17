import React from "react";
import { CheckCircle2, XCircle, ExternalLink, AlertCircle } from "lucide-react";
import Badge from "@/app/components/ui/Badge";

export default function MatchExplanationCard({ explanation, externalUrl }) {
  if (!explanation) return null;

  const {
    opportunity,
    matchScore,
    supportingEvidence = [],
    matchedSkills = [],
    citations = [],
    missingSkills = [],
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
      : matchedSkills?.length > 0
      ? matchedSkills.map((m) => ({
          skill: m.name || "Competency",
          evidence: m.evidenceTitle || `Verified ${m.tier || "high"} competency`,
          tier: m.tier || "verified-high",
        }))
      : [];

  // Correct calculation: handles decimal (0.85) or percentage (85)
  const scorePercentage =
    typeof matchScore === "number"
      ? matchScore <= 1
        ? Math.round(matchScore * 100)
        : Math.round(matchScore)
      : 0;

  const getTierFromEvidenceText = (text, fallbackTier) => {
    if (fallbackTier) return fallbackTier;
    if (text?.includes("verified-high")) return "verified-high";
    if (text?.includes("verified-medium")) return "verified-medium";
    if (text?.includes("flagged-low")) return "flagged-low";
    return "verified-high";
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

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div>
          <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            Explainable Match Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-2">
            {opportunityTitle}
          </h2>
          <p className="text-sm text-[#494D4D] mt-1">
            Algorithmic match breakdown citing verified evidence & transparent missing skill requirements.
          </p>
        </div>

        <div className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-2xl text-xs sm:text-sm font-bold shadow-xs shrink-0">
          <span>{scorePercentage}% Match</span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Supporting Verified Evidence ({evidenceList.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {evidenceList.length > 0 ? (
            evidenceList.map((item, index) => {
              const skillName = typeof item === "string" ? item : (item.skill || item.matchedSkill || item.name || "Skill");
              const evidenceText = typeof item === "string" ? item : (item.evidence || item.title || "Verified Evidence");
              const tier = getTierFromEvidenceText(evidenceText, item.tier || item.verificationTier);
              return (
                <div
                  key={index}
                  className="bg-[#F8F9FA] p-4 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {skillName.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#111111]">{skillName}</div>
                      <div className="text-xs text-[#494D4D] mt-0.5">{evidenceText}</div>
                    </div>
                  </div>
                  <Badge tier={tier} className="self-start sm:self-center" />
                </div>
              );
            })
          ) : (
            <p className="text-sm text-neutral-500 italic">No supporting evidence matched for this opportunity.</p>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>Unmatched / Missing Required Skills ({missingSkills.length})</span>
        </h3>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {missingSkills.map((skillItem, index) => {
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
        ) : (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Full Skill Alignment! You meet 100% of the required skills for this role.</span>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-neutral-400 font-medium">
          Direct application via original hiring source
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={linkedInRoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-100 text-neutral-800 rounded-2xl text-xs font-bold hover:bg-neutral-200 transition-all cursor-pointer"
          >
            <span>LinkedIn Listing</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
          </a>
          <a
            href={directRoleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-md group cursor-pointer"
          >
            <span>Apply on Original Listing</span>
            <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
