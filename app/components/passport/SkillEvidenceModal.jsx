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
  Sparkles 
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
  if (!isOpen || !skill) return null;

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
        className="absolute top-full right-0 mt-1.5 z-50 w-72 sm:w-[320px] max-w-[calc(100vw-32px)] bg-[#0C120F]/95 backdrop-blur-xl border border-emerald-500/25 rounded-2xl p-3.5 sm:p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85),_0_0_0_1px_rgba(16,185,129,0.15)] text-white overflow-hidden"
      >
        {/* Ambient Subtle Glow */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* Header Block */}
        <div className="flex items-start gap-2.5 mb-3 pr-6">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                {skill.category || "Verified Skill"}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                <span>100% Backed</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white mt-1 truncate">
              {skill.name}
            </h3>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Level: <span className="text-white font-bold">{skill.level || "Expert"}</span>
            </p>
          </div>
        </div>

        {/* Citations & Projects Sections */}
        <div className="space-y-2.5">
          {/* Citations Section */}
          <div>
            <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-emerald-400" />
              <span>Citations ({skill.evidence?.length || 0})</span>
            </div>
            <div className="space-y-1.5">
              {skill.evidence && skill.evidence.length > 0 ? (
                skill.evidence.map((ev, idx) => (
                  <div
                    key={ev.id || ev.hash || ev.title || `ev-${idx}`}
                    className="bg-neutral-900/90 border border-white/10 rounded-xl p-2 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-white truncate">{ev.title}</span>
                    </div>
                    <Badge tier={ev.tier || "verified-high"} showIcon={false} className="shrink-0 text-[9px] px-2 py-0.5" />
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-neutral-400 italic">No direct citations recorded.</p>
              )}
            </div>
          </div>

          {/* Portfolio Implementations */}
          {linkedProjects.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-emerald-400" />
                <span>Portfolio Implementations</span>
              </div>
              <div className="space-y-1.5">
                {linkedProjects.map((proj, idx) => (
                  <div
                    key={proj.id || proj.title || `proj-${idx}`}
                    className="bg-neutral-900/90 border border-white/10 rounded-xl p-2 flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white truncate">{proj.title}</div>
                    </div>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-neutral-300 hover:text-white shrink-0 px-2 py-0.5 hover:bg-white/10 rounded-lg transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitBranch className="w-3 h-3 text-emerald-400" />
                        <span>Code</span>
                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
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
