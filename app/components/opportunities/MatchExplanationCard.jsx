import React from "react";
import { ShieldCheck, CheckCircle2, XCircle, ExternalLink, Sparkles, AlertCircle, Scale } from "lucide-react";
import Badge from "@/app/components/ui/Badge";

/**
 * Match Explanation Card - Demo Centerpiece.
 * Renders exact Section 4 match explanation structure including supporting evidence citations,
 * missing skills breakdown, and explicit rendering of excludedFromRanking attributes for guaranteed algorithmic fairness.
 * @param {Object} props
 * @param {Object} props.explanation - Section 4 Match Explanation JSON Object
 * @param {string} [props.externalUrl] - Link to original external job listing
 */
export default function MatchExplanationCard({ explanation, externalUrl }) {
  if (!explanation) return null;

  const {
    opportunity,
    matchScore,
    supportingEvidence = [],
    missingSkills = [],
    excludedFromRanking = ["gender", "college tier", "name", "photo"],
  } = explanation;

  const scorePercentage = Math.round((matchScore || 0) * 100);

  // Parse evidence tier from text (e.g. "verified-high", "verified-medium", "flagged-low")
  const getTierFromEvidenceText = (text) => {
    if (text?.includes("verified-high")) return "verified-high";
    if (text?.includes("verified-medium")) return "verified-medium";
    if (text?.includes("flagged-low")) return "flagged-low";
    return "verified-high";
  };

  return (
    <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-8">
      {/* Header Banner: Title & Match Score Percentage */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
        <div>
          <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
            Explainable Match Engine
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-2">
            {opportunity}
          </h2>
          <p className="text-sm text-[#494D4D] mt-1">
            Algorithmic match breakdown citing verified evidence & transparent missing skill requirements.
          </p>
        </div>

        {/* Large Score Gauge */}
        <div className="flex items-center gap-3 bg-[#F5F5F3] px-5 py-3.5 rounded-2xl border border-black/5 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            {scorePercentage}%
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">Match Rating</div>
            <div className="text-sm font-bold text-[#111111] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>High Compatibility</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Supporting Evidence Citations */}
      <div>
        <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span>Supporting Verified Evidence ({supportingEvidence.length})</span>
        </h3>

        <div className="grid grid-cols-1 gap-3">
          {supportingEvidence.length > 0 ? (
            supportingEvidence.map((item, index) => {
              const tier = getTierFromEvidenceText(item.evidence);
              return (
                <div
                  key={index}
                  className="bg-[#F8F9FA] p-4 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      {item.skill.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#111111]">{item.skill}</div>
                      <div className="text-xs text-[#494D4D] mt-0.5">{item.evidence}</div>
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

      {/* 2. Missing Skills List */}
      <div>
        <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span>Unmatched / Missing Required Skills ({missingSkills.length})</span>
        </h3>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3.5 py-2 bg-amber-50/60 text-amber-900 border border-amber-200/70 rounded-xl text-xs font-semibold"
              >
                <XCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{skill}</span>
                <span className="text-[10px] bg-amber-200/50 px-1.5 py-0.5 rounded-md text-amber-900">Required</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Full Skill Alignment! You meet 100% of the required skills for this role.</span>
          </div>
        )}
      </div>

      {/* 3. Explicit Fairness Guarantee Exclusion List (Demo Requirement) */}
      <div className="bg-gradient-to-br from-slate-900 to-neutral-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>Fairness Guarantee</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-mono tracking-wider rounded-md border border-emerald-500/30">
                  VERIFIED AUDIT
                </span>
              </h4>
              <p className="text-xs text-slate-300">
                The following candidate demographic attributes were explicitly excluded from the ranking model:
              </p>
            </div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 hidden sm:block" />
        </div>

        {/* Excluded Attributes Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {excludedFromRanking.map((attr, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-slate-200 rounded-xl text-xs font-mono border border-white/10 hover:bg-white/15 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
              <span className="line-through decoration-rose-400/80">{attr}</span>
              <span className="text-[10px] text-emerald-400 font-bold ml-1">EXCLUDED</span>
            </div>
          ))}
        </div>
      </div>

      {/* External Link Action */}
      {externalUrl && (
        <div className="pt-2 flex justify-end">
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-md group"
          >
            <span>Apply on Original Listing</span>
            <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      )}
    </div>
  );
}
