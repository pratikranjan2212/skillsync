"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ShieldCheck, 
  FileCheck, 
  ExternalLink, 
  CheckCircle2, 
  Code2, 
  GitBranch, 
  Sparkles, 
  Copy, 
  Check 
} from "lucide-react";
import Badge from "@/app/components/ui/Badge";

export default function SkillEvidenceModal({ 
  skill, 
  isOpen, 
  onClose, 
  projects = [],
  onMouseEnter,
  onMouseLeave
}) {
  const [copiedHash, setCopiedHash] = React.useState(null);

  if (!isOpen || !skill) return null;

  const handleCopy = (text, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Find linked projects
  const linkedProjects = projects.filter((p) =>
    p.skills?.some((s) => s.toLowerCase().includes(skill.name.toLowerCase()) || skill.name.toLowerCase().includes(s.toLowerCase()))
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 6, scale: 0.97 }}
        transition={{ duration: 0.16, ease: "easeOut" }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-full right-0 mt-1.5 z-50 w-full sm:w-[350px] bg-white/98 backdrop-blur-lg border border-emerald-200/80 rounded-2xl p-3.5 sm:p-4 shadow-[0_12px_36px_rgba(0,0,0,0.12),_0_0_0_1px_rgba(16,185,129,0.1)] text-neutral-900 overflow-hidden"
      >
        {/* Subtle Ambient Corner Accent */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 border border-black/5 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-2.5 mb-2.5 pr-6">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                {skill.category || "Verified Domain"}
              </span>
              <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                100% Backed
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-[#111111] mt-0.5 truncate">
              {skill.name}
            </h3>
            <p className="text-[9px] text-[#494D4D]">
              Level: <span className="text-neutral-900 font-semibold">{skill.level || "Expert"}</span> • Endorsements:{" "}
              <span className="text-emerald-700 font-mono font-bold">{skill.endorsements || 18}</span> citations
            </p>
          </div>
        </div>

        {/* Compact Citations & Implementations */}
        <div className="space-y-2">
          {/* Supporting Evidence Citations */}
          <div>
            <div className="text-[9px] font-bold text-[#494D4D] uppercase tracking-wider mb-1 flex items-center gap-1">
              <FileCheck className="w-2.5 h-2.5 text-emerald-600" />
              <span>Citations ({skill.evidence?.length || 0})</span>
            </div>
            <div className="space-y-1">
              {skill.evidence && skill.evidence.length > 0 ? (
                skill.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    className="bg-[#F8FAF9] border border-black/5 rounded-lg p-1.5 flex items-center justify-between gap-1.5 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-[#111111] flex items-center gap-1 truncate">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{ev.title}</span>
                      </div>
                      {ev.hash && (
                        <div className="flex items-center gap-1 text-[8px] font-mono text-neutral-500 mt-0.5">
                          <span>Hash:</span>
                          <code className="bg-white px-1 rounded text-emerald-800 border border-black/5 font-semibold">{ev.hash}</code>
                          <button
                            onClick={(e) => handleCopy(ev.hash, e)}
                            className="text-neutral-500 hover:text-emerald-700 transition-colors p-0.2 cursor-pointer"
                            title="Copy hash"
                          >
                            {copiedHash === ev.hash ? <Check className="w-2 h-2 text-emerald-600" /> : <Copy className="w-2 h-2" />}
                          </button>
                        </div>
                      )}
                    </div>
                    <Badge tier={ev.tier || "verified-high"} showIcon={false} className="shrink-0 text-[8px] px-1.5 py-0.2" />
                  </div>
                ))
              ) : (
                <p className="text-[9px] text-neutral-500 italic">No direct citations recorded.</p>
              )}
            </div>
          </div>

          {/* Linked Projects Section */}
          {linkedProjects.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-[#494D4D] uppercase tracking-wider mb-1 flex items-center gap-1">
                <Code2 className="w-2.5 h-2.5 text-emerald-600" />
                <span>Portfolio Implementations</span>
              </div>
              <div className="space-y-1">
                {linkedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-[#F8FAF9] border border-black/5 rounded-lg p-1.5 flex items-center justify-between gap-1.5 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] font-bold text-[#111111] truncate">{proj.title}</div>
                    </div>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 hover:text-emerald-800 shrink-0 px-1 py-0.5 hover:bg-emerald-50 rounded"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitBranch className="w-2.5 h-2.5" />
                        <span>Code</span>
                        <ExternalLink className="w-2 h-2" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
