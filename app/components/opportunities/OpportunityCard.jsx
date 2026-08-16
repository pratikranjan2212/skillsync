import React from "react";
import Link from "next/link";
import { Building2, MapPin, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OpportunityCard({ opportunity }) {
  const {
    id,
    sourceApi,
    title,
    company,
    location,
    description,
    requiredSkills,
    matchScore,
  } = opportunity;

  const scorePercentage = Math.round((matchScore || 0) * 100);

  let scoreColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (scorePercentage < 70) {
    scoreColor = "bg-amber-50 text-amber-700 border-amber-200";
  }

  return (
    <div className="bg-white rounded-[24px] p-6 shadow-md hover:shadow-lg transition-all border border-black/5 flex flex-col justify-between gap-5 group">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-xs font-bold rounded-xl border border-black/5">
            via {sourceApi}
          </span>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{scorePercentage}% Match</span>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#111111] group-hover:text-emerald-700 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-4 text-xs font-medium text-[#494D4D] mt-1.5">
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-neutral-400" />
              {company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
              {location}
            </span>
          </div>
        </div>

        <p className="text-sm text-[#494D4D] leading-relaxed line-clamp-2">
          {description}
        </p>

        {requiredSkills && requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#F8F9FA] text-neutral-700 text-xs font-medium rounded-xl border border-neutral-200"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-xs text-neutral-400 font-mono">ID: {id}</span>
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

