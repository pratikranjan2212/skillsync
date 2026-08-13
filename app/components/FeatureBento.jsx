"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, QrCode, Award, Scale, Sparkles, Briefcase, FileCheck, Layers, ArrowRight, ExternalLink } from "lucide-react";
import Badge from "@/app/components/ui/Badge";

export default function FeatureBento() {
  return (
    <section id="verification-tiers" className="py-20 md:py-32 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white border border-black/5 text-xs font-bold text-neutral-800 shadow-2xs mb-3">
            <Layers className="w-3.5 h-3.5 text-emerald-500" />
            <span>Automated Skill Verification Engine</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Proof over promises. <br className="hidden sm:inline" />
            Clear evidence tiers.
          </h2>
        </div>
        <p className="text-neutral-600 font-medium text-sm sm:text-base max-w-md">
          SkillSync assigns verification tiers based on institutional QR signatures, OCR transcripts, and API checks — completely replacing manual verifiers.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Row 1 - Left Card (5 col): Verification Tiers */}
        <div className="lg:col-span-5 bg-[#F2F3F5] border border-black/5 rounded-4xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
          <div>
            <span className="px-3 py-1 bg-white text-emerald-800 text-[11px] font-extrabold uppercase tracking-wider rounded-xl border border-black/5">
              3-Tier Badge System
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mt-3 mb-2">
              Automated Evidence Tiers
            </h3>
            <p className="text-neutral-600 text-xs sm:text-sm font-medium mb-6">
              Every evidence item displays an automated verification badge so recruiters know exactly how it was parsed.
            </p>

            <div className="bg-white rounded-3xl p-5 shadow-md border border-black/5 flex flex-col gap-3">
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
                  <div className="text-xs font-bold text-neutral-900">Self-Submitted Hackathon Link</div>
                  <div className="text-[10px] text-neutral-500">Devpost prototype demo</div>
                </div>
                <Badge tier="flagged-low" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 1 - Right Card (7 col): Explainable Match Engine & Fairness Guarantee */}
        <div className="lg:col-span-7 bg-[#0f241c] rounded-4xl p-6 sm:p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-[11px] font-mono uppercase font-bold tracking-wider rounded-xl border border-emerald-500/30">
              Zero Demographic Bias
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-3 mb-2">
              Explainable Match Engine & Fairness Guarantee
            </h3>
            <p className="text-emerald-100/80 text-xs sm:text-sm font-medium mb-6 max-w-md">
              Every job match cites supporting evidence, lists missing required skills, and explicitly strips non-skill demographic attributes from ranking logic.
            </p>

            {/* Explanation Box */}
            <div className="bg-black/50 backdrop-blur-xl rounded-[28px] p-5 sm:p-6 border border-white/10 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">ML Intern - DataCo (via Adzuna)</div>
                  <div className="text-[11px] text-emerald-300 font-bold mt-0.5">82% Calculated Match</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500 text-black text-xs font-black rounded-full">
                  HIGH MATCH
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Python: 'Data Pipeline Project' — verified-high (QR-confirmed)</span>
                </div>
                <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>SQL: DBMS coursework, 92% — verified-medium (OCR-parsed)</span>
                </div>
              </div>

              {/* Excluded Attributes Pill */}
              <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-700 text-[11px] font-mono text-slate-300">
                <div className="text-emerald-400 font-bold text-[10px] uppercase mb-1">
                  Enforced Fairness Exclusion List:
                </div>
                <div className="flex flex-wrap gap-2">
                  {["gender", "college tier", "name", "photo"].map((attr) => (
                    <span key={attr} className="px-2 py-0.5 bg-white/10 rounded text-rose-300 line-through">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2 - Full Width Dark Card: Portable Skill Passport */}
        <div className="lg:col-span-12 bg-[#111111] border border-white/10 rounded-[40px] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="w-full lg:w-6/12">
            <span className="px-3 py-1 bg-amber-400/20 text-amber-300 text-xs font-bold rounded-full border border-amber-400/30">
              Portable Skill Passport
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-white mt-3 mb-4 tracking-tight">
              Export PDF, JSON, or share a verified public link.
            </h3>
            <p className="text-neutral-300 text-sm sm:text-base font-medium mb-8 leading-relaxed">
              Group your verified skills by taxonomy categories (Programming Languages, Databases, AI/ML, Frontend Web). Share your passport with recruiters or export signed JSON and PDF files instantly.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/passport"
                className="px-6 py-3.5 rounded-2xl bg-white text-neutral-900 font-extrabold text-xs hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-lg"
              >
                <Award className="w-4 h-4 text-amber-600" />
                <span>View Skill Passport View</span>
              </Link>
              <Link
                href="/passport/sp-token-9942a"
                className="px-6 py-3.5 rounded-2xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2"
              >
                <span>Try Public Share Link</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-5/12 bg-[#1A1A1A] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-3">
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
      </div>
    </section>
  );
}
