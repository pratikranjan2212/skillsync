import React from "react";
import Link from "next/link";
import { Building2, MapPin, CheckCircle2, Globe, Home, Briefcase } from "lucide-react";
import { getScoreBand } from "@/lib/matching/config";
import { getOpportunityWorkMode } from "@/lib/opportunities/workModeUtils";

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
  const hasMatchScore = typeof matchScore === "number" && matchScore > 0;
  const scorePercentage = hasMatchScore
    ? matchScore <= 1
      ? Math.round(matchScore * 100)
      : Math.round(matchScore)
    : 0;

  const band = getScoreBand(scorePercentage);
  const displayLabel = scoreLabel || band.label;

  // Canonical Work Mode detection
  const standardMode = getOpportunityWorkMode(opportunity);

  let modeBadge = {
    label: "On-site",
    icon: Building2,
    style: "bg-amber-50 text-amber-900 border-amber-200",
  };

  if (standardMode === "Remote") {
    modeBadge = {
      label: "Remote",
      icon: Globe,
      style: "bg-sky-50 text-sky-800 border-sky-200",
    };
  } else if (standardMode === "Hybrid") {
    modeBadge = {
      label: "Hybrid",
      icon: Home,
      style: "bg-rose-50 text-rose-800 border-rose-200",
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

          {hasMatchScore ? (
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${band.badgeBg}`}>
              <span>{scorePercentage}%</span>
              <span className="text-[10px] opacity-80">• {displayLabel}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Active Role</span>
            </div>
          )}
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

        {/* Matched & Related Skills (or Required Skills for Guests) */}
        {matchedList && matchedList.length > 0 ? (
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
        ) : requiredSkills && requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-xl border bg-[#F8F9FA] text-neutral-700 border-neutral-200"
              >
                {decodeHtml(skill)}
              </span>
            ))}
            {requiredSkills.length > 4 && (
              <span className="px-2 py-1 text-[11px] font-semibold text-neutral-500 bg-neutral-50 rounded-xl border border-neutral-150">
                +{requiredSkills.length - 4} more
              </span>
            )}
          </div>
        ) : null}

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlSpace="preserve"
              viewBox="0 0 1486.1 400"
              className="h-4.5 w-auto shrink-0"
            >
              <path
                d="M1472.2,71.4c-5.2-5.9-12.2-8.8-21.5-8.8s-16.6,3.1-21.7,9.6c-5,6.3-7.6,15.7-7.6,27.8v88.8 c-11.6-12.5-23.6-21.4-35.9-27.4c-7.6-3.7-16.6-6.4-26.7-7.7c-5.9-0.7-11.8-1.1-18.4-1.1c-30.6,0-55.4,10.5-74.4,31.7 c-18.8,21-28.2,50.3-28.2,87.8c0,17.7,2.4,34.3,7.2,49.5c4.8,15.1,11.6,28.4,20.8,39.8c9.2,11.2,20.3,19.9,32.8,26.2 c12.5,6.1,26.2,9.2,41.1,9.2c6.8,0,13.3-0.6,19.2-1.7c4.1-0.6,7.7-1.7,11.6-2.8c9.4-3.1,18.2-7.6,26.2-13.3 c8.3-5.9,16.4-13.4,24.7-22.7v5.9c0,11.1,2.8,19.5,8.3,25.6c5.7,5.9,12.7,9,21,9c8.7,0,15.7-2.9,21-8.5c5.3-5.9,8.3-14.4,8.3-26 V96.8C1479.7,85.8,1477.2,77.1,1472.2,71.4z M1409.9,316.5c-5.3,11.2-12.7,19.7-21.4,25.2c-9,5.5-18.8,8.1-29.7,8.1h-0.2 c-10.9,0-20.6-2.9-29.7-8.5c-9-5.9-16.2-14.4-21.4-25.8c-5.2-11.4-7.7-25.4-7.7-41.6c0-15.5,2.4-29.1,7.4-40.5 c4.8-11.6,11.8-20.6,20.6-26.9c9-6.4,19-9.4,30.4-9.4h0.6c10.7,0,20.4,3.1,29.5,9.2c9,6.1,16.2,14.9,21.5,26.3 c5.3,11.4,7.9,25.4,7.9,41.3C1417.9,290.9,1415.3,305.1,1409.9,316.5z M1215.5,319.1c-3.9-3.3-9-5-15.5-5 c-5.9,0-10.1,1.5-13.4,3.9c-7.7,7-14,12.7-18.8,16.8c-4.8,3.9-10.1,7.7-16,11.4c-5.5,3.5-11.6,6.3-17.7,7.7 c-6.3,1.7-12.9,2.6-20.3,2.6c-1.7,0-3.1,0-4.6-0.2c-9.2-0.6-17.9-3.1-25.6-7.7c-9.2-5.3-16.4-13.1-22.1-23.2 c-5.3-10.5-8.3-22.7-8.5-36.3h121c16.2,0,28.7-2.4,37.6-6.6c9-4.6,13.4-14.4,13.4-29.5c0-16.4-4.4-32.4-13.1-48.1 c-8.7-15.7-21.4-28.5-38.9-38.3c-17.3-9.9-37.9-14.7-62.1-14.7h-1.8c-17.9,0.2-34.3,3.1-48.8,8.7c-15.3,5.9-28,14.2-38.7,24.9 c-10.1,10.9-18.2,23.9-23.6,39.2s-8.3,31.9-8.3,49.5c0,37.8,11.1,67.4,33,89.5c20.8,20.8,49.5,31.9,86.2,33c2,0.2,4.2,0.2,6.4,0.2 c17.1,0,32.6-2.2,46-6.6c13.4-4.4,24.5-9.9,33.3-16.6c8.8-6.8,15.5-13.8,19.7-21c4.4-7.2,6.6-13.6,6.6-19 C1221.5,327.2,1219.5,322.3,1215.5,319.1z M1071.4,209c9.8-10.3,22.5-15.5,37.9-15.5h0.2c16,0,29.1,5,38.9,15.1 c9.8,10.1,15.7,25.6,16.9,46.2h-112C1055.4,234.6,1061.3,219.3,1071.4,209z M952.7,314c-6.1,0-10.3,1.5-13.6,3.9 c-7.6,7-14,12.7-18.8,16.8c-4.8,3.9-9.9,7.7-15.8,11.4c-5.7,3.5-11.6,6.3-17.9,7.7c-6.1,1.7-12.9,2.6-20.3,2.6 c-1.7,0-3.1,0-4.6-0.2c-9.2-0.6-17.9-3.1-25.6-7.7c-9-5.3-16.4-13.1-21.7-23.2c-5.7-10.5-8.5-22.7-8.7-36.3h120.8 c16,0,28.5-2.4,37.6-6.6c8.8-4.6,13.3-14.4,13.3-29.5c0-16.4-4.2-32.4-12.9-48.1s-21.5-28.5-38.9-38.3 c-17.3-9.9-38.1-14.7-62.1-14.7h-2c-17.9,0.2-34.1,3.1-48.8,8.7c-15.3,5.9-28,14.2-38.5,24.9c-10.3,10.9-18.4,23.9-23.8,39.2 c-5.5,15.3-8.3,31.9-8.3,49.5c0,37.8,11.2,67.4,33.2,89.5c20.8,20.8,49.4,31.9,86,33c2.2,0.2,4.2,0.2,6.4,0.2 c17.3,0,32.6-2.2,46-6.6c13.4-4.4,24.5-9.9,33.2-16.6c9-6.8,15.5-13.8,19.9-21c4.4-7.2,6.6-13.6,6.6-19c0-6.1-2-10.9-5.9-14.2 C964.1,315.6,958.7,314,952.7,314z M823.7,209c9.8-10.3,22.5-15.5,37.9-15.5h0.2c16,0,29.1,5,38.9,15.1 c9.9,10.1,15.7,25.6,17.1,46.2H805.7C807.9,234.6,814,219.3,823.7,209z M134.9,356.5V213c4.2,0.4,8.3,0.6,12.3,0.6 c20.1,0,38.9-5.3,54.9-14.5v157.5c0,13.4-3.1,23.4-9.4,30c-6.3,6.6-14.4,9.9-24.5,9.9c-9.8,0-17.7-3.3-23.9-10.1 C138.3,379.5,134.9,369.8,134.9,356.5z M716.6,71.4c-5.2-5.9-12.3-8.8-21.4-8.8c-9.4,0-16.6,3.1-21.7,9.6 c-5.2,6.3-7.6,15.7-7.6,27.8v88.8c-11.6-12.5-23.6-21.4-35.9-27.4c-7.7-3.7-16.6-6.4-26.5-7.7c-5.7-0.7-11.8-1.1-18.4-1.1 c-30.6,0-55.6,10.5-74.4,31.7c-18.8,21-28.2,50.3-28.2,87.8c0,17.7,2.4,34.3,7,49.5c4.8,15.1,11.8,28.4,21,39.8 c9.2,11.2,20.3,19.9,32.8,26.2c12.7,6.1,26.2,9.2,41.1,9.2c6.6,0,13.1-0.6,19.2-1.7c4.1-0.6,7.7-1.7,11.6-2.8 c9.4-3.1,18.2-7.6,26.2-13.3c8.3-5.9,16.2-13.4,24.7-22.7v5.9c0,11.1,2.8,19.5,8.3,25.6c5.3,5.9,12.7,9,21,9s15.5-2.9,20.8-8.5 c5.3-5.9,7.9-14.4,7.9-26V96.8C723.9,85.8,721.5,77.1,716.6,71.4z M654.5,316.5c-5.3,11.2-12.7,19.7-21.5,25.2 c-8.8,5.5-18.8,8.1-29.5,8.1h-0.2c-10.9,0-20.6-2.9-29.7-8.5c-9.2-5.9-16.2-14.4-21.4-25.8c-5.2-11.4-7.7-25.4-7.7-41.6 c0-15.5,2.4-29.1,7.2-40.5c5-11.6,11.8-20.6,20.8-26.9c8.8-6.4,19-9.4,30.2-9.4h0.7c10.7,0,20.4,3.1,29.3,9.2 c9.2,6.1,16.4,14.9,21.7,26.3c5.2,11.4,7.9,25.4,7.9,41.3C662.4,290.9,659.6,305.1,654.5,316.5z M300.9,185.2v7.4 c11.1-14,22.8-24.1,35.5-30.8c13.1-6.4,27.8-9.8,44.6-9.8c16.2,0,30.8,3.5,43.6,10.3c12.9,6.8,22.3,16.6,28.5,29.3 c4.2,7.4,6.8,15.5,7.9,23.9c1.1,8.3,1.8,19.3,1.8,32.6v111.6c0,12.2-2.9,21.2-8.7,27.3c-5.5,6.3-13.1,9.4-22.1,9.4 c-9.2,0-16.6-3.1-22.5-9.6c-5.9-6.3-8.7-15.3-8.7-27.1v-100c0-19.9-2.8-35-8.5-45.5c-5.5-10.5-16.9-15.8-33.9-15.8 c-11.1,0-21,3.3-30,9.6c-9,6.4-15.8,15.1-20.1,26.5c-2.9,9-4.4,25.6-4.4,50.3v75c0,12.3-2.9,21.2-8.8,27.4 c-5.9,6.1-13.3,9.2-22.5,9.2c-9,0-16.2-3.1-22.1-9.6c-5.9-6.3-8.7-15.3-8.7-27.1V186.2c0-11.4,2.6-20.1,7.7-25.6 c5-5.7,12-8.7,21-8.7c5.3,0,10.1,1.1,14.5,3.7s7.9,6.3,10.7,11.2C299.8,172.2,300.9,178.2,300.9,185.2z M135.3,12.7 C176.9-1.9,224.5-1.1,260,28.9c6.6,6.1,14.2,13.6,17.1,22.7c3.7,11.2-12.5-1.1-14.9-2.8c-11.6-7.4-23.2-13.6-36.3-17.9 c-70-21-136.3,16.9-177.5,76.1c-16.9,26-28.2,53.4-37.4,83.6c-0.9,3.3-1.8,7.6-3.7,10.5c-1.8,3.3-0.7-8.8-0.7-9.4 c1.5-12.5,4.1-24.5,7.2-36.6C32.9,90.9,74.9,37.3,135.3,12.7z M216,128.3c0,27.3-22.1,49.5-49.4,49.5s-49.4-22.1-49.4-49.5 s22.1-49.5,49.4-49.5S216,100.9,216,128.3z"
                fillRule="evenodd"
                clipRule="evenodd"
                fill="#003a9b"
              />
            </svg>
          </a>
        ) : (
          <a
            href={directLinkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1"
            title="Open exact job post on LinkedIn"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="1.786 1.783 287.865 76.248"
              className="h-4.5 w-auto shrink-0"
            >
              <path
                fill="#069"
                d="M213.882 7.245c0-3.015 2.508-5.462 5.6-5.462h64.568c3.093 0 5.6 2.447 5.6 5.462V72.57c0 3.016-2.507 5.461-5.6 5.461h-64.568c-3.092 0-5.6-2.445-5.6-5.46V7.244z"
              />
              <path
                d="M1.785 65.652h31.62V55.27H13.23V15.665H1.785v49.987zM49.414 65.652v-34.43H37.97v34.43h11.444zm-5.721-39.13c3.99 0 6.474-2.644 6.474-5.95-.074-3.378-2.484-5.947-6.398-5.947-3.915 0-6.475 2.57-6.475 5.947 0 3.306 2.484 5.95 6.324 5.95h.075zM54.727 65.652h11.444V46.424c0-1.029.074-2.058.377-2.791.826-2.056 2.709-4.186 5.871-4.186 4.142 0 5.799 3.158 5.799 7.784v18.42H89.66V45.91c0-10.576-5.646-15.497-13.176-15.497-6.173 0-8.884 3.451-10.39 5.802h.077v-4.993H54.727c.151 3.231 0 34.43 0 34.43zM105.805 15.665H94.361v49.987h11.444V54.489l2.86-3.601 8.96 14.764h14.078l-15.056-21.373 13.174-14.54h-13.776s-9.411 13.008-10.24 14.552V15.665z"
                fill="#000000"
              />
              <path
                d="M162.306 51.29c.151-.884.377-2.58.377-4.498 0-8.9-4.518-17.936-16.413-17.936-12.724 0-18.597 10.063-18.597 19.19 0 11.288 7.153 18.337 19.65 18.337 4.97 0 9.561-.732 13.327-2.275l-1.506-7.558c-3.088 1.024-6.25 1.537-10.164 1.537-5.345 0-10.012-2.195-10.389-6.871l23.715.072v.002zm-23.79-7.742c.301-2.938 2.26-7.273 7.153-7.273 5.194 0 6.4 4.628 6.4 7.273h-13.552zM190.93 15.665v17.304h-.151c-1.657-2.422-5.12-4.038-9.71-4.038-8.81 0-16.564 7.05-16.49 19.094 0 11.164 7.003 18.435 15.735 18.435 4.744 0 9.26-2.058 11.52-6.024h.225l.453 5.216h10.163c-.15-2.424-.302-6.61-.302-10.723V15.664h-11.444zm0 34.05c0 .88-.075 1.763-.227 2.495-.675 3.16-3.386 5.361-6.699 5.361-4.742 0-7.83-3.818-7.83-9.84 0-5.654 2.637-10.208 7.906-10.208 3.538 0 6.022 2.423 6.7 5.433.15.663.15 1.398.15 2.058v4.7z"
                fill="#000000"
              />
              <path
                fill="#fff"
                d="M236.85 65.61V31.18h-11.444v34.43h11.445zm-5.72-39.13c3.99 0 6.474-2.644 6.474-5.948-.075-3.379-2.484-5.949-6.398-5.949-3.917 0-6.475 2.57-6.475 5.949 0 3.304 2.483 5.948 6.324 5.948h.074zM243.184 65.61h11.443V46.385c0-1.028.075-2.058.377-2.792.827-2.057 2.71-4.186 5.872-4.186 4.14 0 5.797 3.157 5.797 7.786V65.61h11.443V45.869c0-10.575-5.645-15.496-13.174-15.496-6.173 0-8.884 3.45-10.39 5.8h.076v-4.992h-11.443c.149 3.23-.001 34.43-.001 34.43z"
              />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
