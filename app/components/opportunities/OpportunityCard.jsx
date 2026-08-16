import React from "react";
import Link from "next/link";
import { Building2, MapPin, ArrowRight, CheckCircle2, Globe, Home, Briefcase } from "lucide-react";

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
    requiredSkills,
    matchScore,
  } = opportunity;

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

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all border border-black/5 flex flex-col justify-between gap-5 group">
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
            {title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#494D4D] mt-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-semibold text-neutral-800">{company}</span>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              <span>{location}</span>
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
          {description}
        </p>

        {requiredSkills && requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {requiredSkills.map((skill, index) => {
              const skillName = typeof skill === "string" ? skill : skill?.name || skill?.skill || "Skill";
              return (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F9FA] text-neutral-700 text-xs font-medium rounded-xl border border-neutral-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skillName}
                </span>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-end">
        <Link
          href={`/opportunities/${id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
        >
          <span>View Match Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
