import React from "react";
import { Building2, MapPin, CheckCircle2, Globe, Home, Briefcase } from "lucide-react";

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
    missingSkills = [],
    matchScore,
    isLinkedInScraped,
    source,
    linkedinUrl,
    url,
    externalUrl,
  } = opportunity;

  const cleanTitle = decodeHtml(title);
  const cleanCompany = decodeHtml(company);
  const cleanLocation = decodeHtml(location);
  const cleanDescription = decodeHtml(description);

  // Correct calculation: handles decimal (0.85) or percentage (85)
  const scorePercentage =
    typeof matchScore === "number"
      ? matchScore <= 1
        ? Math.round(matchScore * 100)
        : Math.round(matchScore)
      : 0;

  let scoreColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
  if (scorePercentage < 75) {
    scoreColor = "bg-neutral-100 text-neutral-800 border-neutral-200";
  }

  const normalizedMode = (workMode || "").toLowerCase();
  let modeBadge = {
    label: "Remote",
    icon: Globe,
    style: "bg-teal-50 text-teal-800 border-teal-200",
  };

  if (normalizedMode === "hybrid") {
    modeBadge = {
      label: "Hybrid",
      icon: Home,
      style: "bg-indigo-50 text-indigo-800 border-indigo-200",
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

  const directLinkedInUrl =
    linkedinUrl ||
    url ||
    externalUrl ||
    `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${cleanTitle} ${cleanCompany}`.trim())}`;

  // Partition skills into matched vs missing
  const matchedList =
    matchedSkills && matchedSkills.length > 0
      ? matchedSkills
      : requiredSkills.filter(
          (sk) => !missingSkills.map((m) => (typeof m === "string" ? m : m.name)).includes(sk)
        );

  const missingList = missingSkills || [];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-all border border-black/5 flex flex-col justify-between gap-5 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border ${modeBadge.style}`}>
            <ModeIcon className="w-3.5 h-3.5" />
            <span>{modeBadge.label}</span>
          </span>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
            <span>{scorePercentage}% Match</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#111111] group-hover:text-emerald-700 transition-colors">
            {cleanTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#494D4D] mt-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-800">{cleanCompany}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{cleanLocation}</span>
            </span>
            {stipend && (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                <span>{stipend}</span>
              </span>
            )}
          </div>
        </div>

        <p className="text-sm text-[#494D4D] leading-relaxed line-clamp-2">
          {cleanDescription}
        </p>

        {/* Matched Skills */}
        {matchedList && matchedList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {matchedList.map((skill, index) => {
              const skillName = typeof skill === "string" ? skill : skill?.name || skill?.skill || "Skill";
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F9FA] text-neutral-700 text-xs font-medium rounded-xl border border-neutral-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {decodeHtml(skillName)}
                </span>
              );
            })}
          </div>
        )}

        {/* Missing Skills Section */}
        {missingList && missingList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-1.5 pt-2 border-t border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 mr-0.5">Missing:</span>
            {missingList.map((skill, index) => {
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
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
        {directLinkedInUrl && (
          <a
            href={directLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#0A66C2] hover:text-[#004182] active:scale-98 transition-all font-bold text-sm group/linkedin cursor-pointer py-1"
            title="Open exact job post on LinkedIn"
          >
            <svg className="w-6 h-6 fill-[#0A66C2] group-hover/linkedin:scale-105 transition-transform shrink-0" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            <span className="font-bold text-[#0A66C2] group-hover/linkedin:underline">View on LinkedIn</span>
          </a>
        )}
      </div>
    </div>
  );
}
