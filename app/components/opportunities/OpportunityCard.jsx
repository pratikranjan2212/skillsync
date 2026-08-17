import React from "react";
import Link from "next/link";
import { Building2, MapPin, CheckCircle2, Globe, Home, Briefcase } from "lucide-react";
import { getScoreBand } from "@/lib/matching/config";
import { IndeedWordmark, LinkedInWordmark } from "@/app/components/icons";

function decodeHtml(html = "") {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    .trim();
}

function formatStipendDisplay(rawStipend) {
  if (!rawStipend || typeof rawStipend !== "string") return "Not Listed";

  let clean = decodeHtml(rawStipend)
    .replace(/a month/gi, "/ month")
    .replace(/per month/gi, "/ month")
    .replace(/a year/gi, "/ yr")
    .replace(/per year/gi, "/ yr")
    .replace(/a day/gi, "/ day")
    .replace(/per day/gi, "/ day")
    .replace(/an hour/gi, "/ hr")
    .replace(/per hour/gi, "/ hr")
    .replace(/\.00/g, "")
    .replace(/\s+/g, " ")
    .replace(/[,;.:]+$/, "")
    .trim();

  if (!/\d/.test(clean) || clean.toLowerCase().includes("not listed") || clean.length > 50) {
    return "Not Listed";
  }

  return clean;
}

export default function OpportunityCard({ opportunity }) {
  const {
    id,
    title,
    company,
    location,
    workMode = "Remote",
    stipend,
    type = "Internship",
    description,
    requiredSkills = [],
    matchedSkills = [],
    relatedSkills = [],
    missingSkills = [],
    missingRequired = [],
    missingPreferred = [],
    matchScore,
    scoreLabel,
    confidence = "high",
    isLinkedInScraped,
    isIndeedScraped,
    source,
    linkedinUrl,
    indeedUrl,
    url,
    externalUrl,
  } = opportunity;

  const cleanTitle = decodeHtml(title);
  const cleanCompany = decodeHtml(company);
  const cleanLocation = decodeHtml(location);
  const cleanDescription = decodeHtml(description);
  const displayStipend = formatStipendDisplay(stipend);
  const isSalaryListed = displayStipend !== "Not Listed";

  // Score percentage & Score band
  const scorePercentage =
    typeof matchScore === "number"
      ? matchScore <= 1
        ? Math.round(matchScore * 100)
        : Math.round(matchScore)
      : 0;

  const band = getScoreBand(scorePercentage);
  const displayLabel = scoreLabel || band.label;

  // Distinct Work Mode Palette (Sky Blue / Rose / Amber) -> Never collides with Emerald or Indigo
  const normalizedMode = (workMode || "").toLowerCase();
  let modeBadge = {
    label: "Remote",
    icon: Globe,
    style: "bg-sky-50 text-sky-800 border-sky-200",
  };

  if (normalizedMode === "hybrid") {
    modeBadge = {
      label: "Hybrid",
      icon: Home,
      style: "bg-rose-50 text-rose-800 border-rose-200",
    };
  } else if (
    normalizedMode === "on-site" ||
    normalizedMode === "onsite" ||
    normalizedMode === "offline"
  ) {
    modeBadge = {
      label: "On-site",
      icon: Building2,
      style: "bg-amber-50 text-amber-900 border-amber-200",
    };
  }

  const ModeIcon = modeBadge.icon;

  // Distinct Confidence Palette (Royal Indigo / Slate / Zinc) -> Never collides with Sky, Rose, Amber, or Emerald
  const normConfidence = (confidence || "high").toLowerCase();
  let confidenceBadgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
  let confidenceText = "High Confidence";

  if (normConfidence === "medium") {
    confidenceBadgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
    confidenceText = "Medium Confidence";
  } else if (normConfidence === "low") {
    confidenceBadgeStyle = "bg-zinc-100 text-zinc-600 border-zinc-200";
    confidenceText = "Low Confidence";
  }

  const isIndeed = isIndeedScraped === true || source === "Indeed";

  const directIndeedUrl =
    indeedUrl ||
    url ||
    externalUrl ||
    `https://in.indeed.com/jobs?q=${encodeURIComponent(`${cleanTitle} ${cleanCompany}`.trim())}&l=India`;

  const directLinkedInUrl =
    linkedinUrl ||
    url ||
    externalUrl ||
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${cleanTitle} ${cleanCompany}`.trim())}`;

  // Process matched skills
  const matchedList = matchedSkills && matchedSkills.length > 0 ? matchedSkills : [];
  const missingList = missingRequired.length > 0 ? missingRequired : (missingSkills || []);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all border border-black/5 flex flex-col justify-between gap-5 group">
      <div className="flex flex-col gap-3">
        {/* Top Header Row: Work Mode (Sky/Rose/Amber) vs Match Score (Emerald Green) */}
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border ${modeBadge.style}`}>
            <ModeIcon className="w-3.5 h-3.5" />
            <span>{modeBadge.label}</span>
          </span>

          <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${band.badgeBg}`}>
            <span>{scorePercentage}%</span>
            <span className="text-[10px] opacity-80">• {displayLabel}</span>
          </div>
        </div>

        <div>
          <Link
            href={`/opportunities/${id}`}
            className="text-xl font-bold text-[#111111] group-hover:text-emerald-700 transition-colors inline-block"
          >
            {cleanTitle}
          </Link>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#494D4D] mt-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-800">{cleanCompany}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{cleanLocation}</span>
            </span>
            <span
              className={`flex items-center gap-1 ${
                isSalaryListed ? "text-emerald-700 font-semibold" : "text-neutral-500 font-medium"
              }`}
              title={isSalaryListed ? "Compensation" : "Compensation not specified in listing"}
            >
              <Briefcase className={`w-3.5 h-3.5 ${isSalaryListed ? "text-emerald-600" : "text-neutral-400"} shrink-0`} />
              <span>{displayStipend}</span>
            </span>
          </div>
        </div>

        <p className="text-sm text-[#494D4D] leading-relaxed line-clamp-2">
          {cleanDescription}
        </p>

        {/* Matched & Related Skills */}
        {matchedList && matchedList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {matchedList.slice(0, 5).map((skill, index) => {
              const skillName = typeof skill === "string" ? skill : skill?.name || skill?.pureName || "Skill";
              const isRelated = typeof skill === "object" && (skill?.isRelated || skill?.matchType === "related");
              return (
                <span
                  key={index}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-xl border ${
                    isRelated
                      ? "bg-teal-50/70 text-teal-800 border-teal-200/80"
                      : "bg-[#F8F9FA] text-neutral-700 border-neutral-200"
                  }`}
                  title={isRelated ? (skill?.relationReason || "Related skill match") : "Exact verified skill"}
                >
                  <CheckCircle2 className={`w-3 h-3 ${isRelated ? "text-teal-600" : "text-emerald-600"}`} />
                  {decodeHtml(skillName)}
                </span>
              );
            })}
            {matchedList.length > 5 && (
              <span className="px-2 py-1 text-[11px] font-semibold text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-150">
                +{matchedList.length - 5} more
              </span>
            )}
          </div>
        )}

        {/* Missing Skills Section */}
        {missingList && missingList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 mr-0.5">Missing:</span>
            {missingList.slice(0, 3).map((skill, index) => {
              const skillName = typeof skill === "string" ? skill : skill?.name || skill?.skill || "Skill";
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-xl border border-neutral-200/80"
                >
                  <span className="text-neutral-400 text-[10px] font-bold">✕</span>
                  {decodeHtml(skillName)}
                </span>
              );
            })}
            {missingList.length > 3 && (
              <span className="text-[11px] text-neutral-400 font-medium">
                +{missingList.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Footer Row: Confidence Level (Indigo) vs Brand Redirect (Indeed/LinkedIn) */}
      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
        <div>
          {confidence && (
            <span className={`inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded-xl border ${confidenceBadgeStyle}`}>
              {confidenceText}
            </span>
          )}
        </div>

        {isIndeed ? (
          <a
            href={directIndeedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
            title="Open exact job post on Indeed"
          >
            <IndeedWordmark className="h-4.5 w-auto shrink-0" />
          </a>
        ) : (
          <a
            href={directLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
            title="Open exact job post on LinkedIn"
          >
            <LinkedInWordmark className="h-4.5 w-auto shrink-0" />
          </a>
        )}
      </div>
    </div>
  );
}
