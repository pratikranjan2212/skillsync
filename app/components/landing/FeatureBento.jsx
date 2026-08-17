"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, QrCode, Award, Scale, Sparkles, Briefcase, FileCheck, Layers, ArrowRight, ExternalLink } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { FadeIn } from "@/app/components/ui/FadeIn";

export default function FeatureBento() {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-32 px-4 sm:px-6 2xl:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto scroll-mt-24">
      <FadeIn distance={28} duration={0.85} delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 md:mb-16 gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white border border-black/5 text-xs font-bold text-neutral-800 shadow-2xs mb-3">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              <span>Automated Skill Verification Engine</span>
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">
              Proof over promises. <br className="hidden sm:inline" />
              Clear evidence tiers.
            </h2>
          </div>
          <p className="text-neutral-600 font-medium text-xs sm:text-sm md:text-base max-w-md">
            SkillSync assigns verification tiers based on institutional QR signatures, OCR transcripts, and API checks — completely replacing manual verifiers.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 h-full">
          <FadeIn distance={36} delay={0.25} duration={0.9} className="h-full">
            <div className="bg-[#F2F3F5] border border-black/5 rounded-3xl sm:rounded-4xl p-5 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow h-full">
              <div>
                <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 bg-white text-emerald-800 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider rounded-full border border-black/5">
                  3-Tier Badge System
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-neutral-900 mt-3 mb-2">
                  Automated Evidence Tiers
                </h3>
                <p className="text-neutral-600 text-xs sm:text-sm font-medium mb-6">
                  Every evidence item displays an automated verification badge so recruiters know exactly how it was parsed.
                </p>

                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-md border border-black/5 flex flex-col gap-3">
                  <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">QR-Confirmed Transcript</div>
                      <div className="text-[10px] text-neutral-500">CS229 Machine Learning • Grade A</div>
                    </div>
                    <Badge tier="verified-high" />
                  </div>

                  <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">OCR-Parsed Lab Grade</div>
                      <div className="text-[10px] text-neutral-500">DBMS Coursework • 92% Score</div>
                    </div>
                    <Badge tier="verified-medium" />
                  </div>

                  <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-xs font-bold text-neutral-900">Self-Submitted Project Link</div>
                      <div className="text-[10px] text-neutral-500">Repository & deployment URL</div>
                    </div>
                    <Badge tier="flagged-low" />
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-7 h-full">
          <FadeIn distance={36} delay={0.45} duration={0.9} className="h-full">
            <div className="bg-[#0f241c] rounded-3xl sm:rounded-4xl p-5 sm:p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group h-full" data-spark-color="#ffffff">
              <div className="relative z-10" data-spark-color="#ffffff">
                <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-[11px] font-mono uppercase font-bold tracking-wider rounded-full border border-emerald-500/30" data-spark-color="#ffffff">
                  Zero Demographic Bias
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white mt-3 mb-2" data-spark-color="#ffffff">
                  Explainable Match Engine & Fairness Guarantee
                </h3>
                <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mb-6 max-w-md" data-spark-color="#ffffff">
                  Every job match cites supporting evidence, lists missing required skills, and explicitly strips non-skill demographic attributes from ranking logic.
                </p>

                <div className="bg-black/50 backdrop-blur-xl rounded-2xl sm:rounded-[28px] p-4 sm:p-6 border border-white/10 shadow-2xl flex flex-col gap-4" data-spark-color="#ffffff">
                  <div className="flex items-center justify-between gap-2" data-spark-color="#ffffff">
                    <div data-spark-color="#ffffff">
                      <div className="text-xs sm:text-sm font-bold text-white">ML Intern - DataCo (via LinkedIn)</div>
                      <div className="text-[10px] sm:text-[11px] text-emerald-300 font-bold mt-0.5">82% Calculated Match</div>
                    </div>
                    <span className="px-2.5 sm:px-3 py-1 bg-emerald-500 text-black text-[10px] sm:text-xs font-black rounded-full whitespace-nowrap">
                      HIGH MATCH
                    </span>
                  </div>

                  <div className="space-y-2 text-xs" data-spark-color="#ffffff">
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2" data-spark-color="#ffffff">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Python: 'Data Pipeline Project' — verified-high</span>
                    </div>
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2" data-spark-color="#ffffff">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>SQL: DBMS coursework, 92% — verified-medium</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700 text-[10px] sm:text-[11px] font-mono text-slate-300" data-spark-color="#ffffff">
                    <div className="text-emerald-400 font-bold text-[10px] uppercase mb-1">
                      Enforced Fairness Exclusion List:
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2" data-spark-color="#ffffff">
                      {["gender", "college tier", "name", "photo"].map((attr) => (
                        <span key={attr} data-spark-color="#ffffff" className="px-2 py-0.5 bg-white/10 rounded text-rose-300 line-through">
                          {attr}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="lg:col-span-12">
          <FadeIn distance={40} delay={0.25} duration={0.95}>
            <div className="bg-[#111111] border border-white/10 rounded-3xl sm:rounded-[40px] p-6 sm:p-10 lg:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8" data-spark-color="#ffffff">
              <div className="w-full lg:w-6/12">
                <span className="inline-flex items-center px-3.5 sm:px-4 py-1.5 sm:py-2 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
                  Portable Skill Passport
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-white mt-3 mb-4 tracking-tight">
                  Export PDF or share a verified public link.
                </h3>
                <p className="text-neutral-300 text-xs sm:text-base font-medium mb-6 sm:mb-8 leading-relaxed">
                  Group your verified skills by taxonomy categories (Programming Languages, Databases, AI/ML, Frontend Web). Share your passport with recruiters or export signed PDF files instantly.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Link
                    href="/passport"
                    className="w-full sm:w-auto justify-center px-6 py-4 sm:py-5 rounded-full bg-white text-neutral-900 font-extrabold text-xs sm:text-sm hover:bg-neutral-200 transition-all hover:scale-95 active:scale-90 flex items-center gap-2 shadow-lg"
                  >
                    <Award className="w-4.5 h-4.5 text-amber-600 shrink-0" />
                    <span>View Skill Passport</span>
                  </Link>
                  <Link
                    href="/passport/sp-token-9942a"
                    className="w-full sm:w-auto justify-center px-6 py-4 sm:py-5 rounded-full bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 border border-white/15 transition-all hover:scale-95 active:scale-90 flex items-center gap-2"
                  >
                    <span>Try Public Share Link</span>
                    <ExternalLink className="w-4 h-4 text-emerald-400 shrink-0" />
                  </Link>
                </div>
              </div>

              <div className="w-full lg:w-5/12 bg-[#1A1A1A] p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-bold text-white">Share & Export Options</span>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono rounded">
                    Verified Token Active
                  </span>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl text-xs font-bold text-white flex items-center justify-between">
                  <span>Public Visibility Status</span>
                  <span className="text-emerald-400">PUBLIC</span>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl text-xs font-bold text-white flex items-center justify-between">
                  <span>Download Signed JSON Data</span>
                  <span className="text-amber-400 font-mono">.JSON</span>
                </div>

                <div className="p-3 bg-white/5 rounded-2xl text-xs font-bold text-white flex items-center justify-between">
                  <span>Generate Formal PDF Passport</span>
                  <span className="text-emerald-400 font-mono">.PDF</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

