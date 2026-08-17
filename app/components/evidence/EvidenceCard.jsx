import React, { useState } from "react";
import { FileCheck, ExternalLink, Calendar, Key, ShieldCheck } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import RollingText from "@/app/components/ui/RollingText";

export default function EvidenceCard({ evidence, onOverride }) {
  const [hovered, setHovered] = useState(false);
  const {
    id,
    type,
    title,
    description,
    fileUrl,
    fileHash,
    verificationTier,
    verificationReason,
    verifiedAt,
    claimedSkills,
    adminOverride,
  } = evidence;

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Pending";

  return (
    <div className="bg-white rounded-2xl sm:rounded-[24px] p-4 sm:p-6 shadow-md hover:shadow-lg transition-all border border-black/5 flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="px-2.5 sm:px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl">
            {type}
          </span>
          <Badge tier={verificationTier} />
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#111111] flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
            <span>{title}</span>
          </h3>
          <p className="text-xs sm:text-sm text-[#494D4D] mt-1 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {claimedSkills && claimedSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {claimedSkills.map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg border border-neutral-200"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="bg-[#F8F9FA] rounded-2xl p-3 text-xs text-[#494D4D] border border-black/5 mt-2 flex flex-col gap-1.5">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-[#111111]">Verification Reason: </span>
              {verificationReason}
            </div>
          </div>

          {fileHash && (
            <div className="flex items-center gap-2 text-neutral-500 font-mono text-[11px] truncate">
              <Key className="w-3.5 h-3.5 shrink-0 text-neutral-400" />
              <span className="truncate">Hash: {fileHash.substring(0, 24)}...</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3 text-xs text-[#494D4D]">
        <div className="flex items-center gap-1.5 text-neutral-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center gap-2">
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#111111] hover:text-emerald-600 transition-colors bg-[#F5F5F3] px-3 py-1.5 rounded-xl border border-black/5"
            >
              <span>View Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {onOverride && (
            <button
              onClick={() => onOverride(id)}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors"
            >
              <RollingText
                text="Override Tier"
                autoPlay={hovered}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.02}
                textColor="#FFFFFF"
                font={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.2em" }}
              />
            </button>
          )}

        </div>
      </div>
    </div>
  );
}

