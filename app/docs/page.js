"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  Sparkles,
  ShieldCheck,
  Award,
  Code2,
  FileCheck,
  QrCode,
  Scale,
  Terminal,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  FileCode,
  Share2,
  Database
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import Badge from "@/app/components/ui/Badge";

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const navigationSections = [
    { id: "overview", label: "Platform Overview", icon: BookOpen },
    { id: "verification", label: "Automated Verification Tiers", icon: ShieldCheck },
    { id: "match-engine", label: "Explainable Match Engine", icon: Sparkles },
    { id: "passport-export", label: "Skill Passport & Export", icon: Award },
    { id: "api-reference", label: "REST API Reference", icon: Code2 },
    { id: "fairness-audit", label: "Algorithmic Fairness Specs", icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>Developer & Platform Documentation</span>
              </span>
              <span className="text-xs text-[#494D4D] font-mono">v1.4.0 (Stable)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mt-3 tracking-tight">
              SkillSync Platform Architecture & Docs
            </h1>
            <p className="text-sm sm:text-base text-[#494D4D] mt-2 max-w-2xl leading-relaxed">
              Explore how SkillSync verifies student coursework via multi-tier algorithms, generates cryptographic Skill Passports, and executes bias-free explainable job matching.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-all shadow-md"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-3 sticky top-28 space-y-2 bg-white rounded-[28px] p-4 shadow-sm border border-black/5">
            <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-[#494D4D]">
              Navigation
            </div>
            {navigationSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    const el = document.getElementById(sec.id);
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
                  <span>{sec.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-neutral-100 px-3">
              <span className="text-[11px] text-neutral-400 font-medium">Need immediate assistance?</span>
              <Link
                href="/support"
                className="mt-1 flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
              >
                <span>Visit Support Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-9 flex flex-col gap-8">
            <section id="overview" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-black/5">
                Core Philosophy
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                1. What is SkillSync?
              </h2>
              <p className="text-sm text-[#494D4D] leading-relaxed mb-4">
                SkillSync replaces unverified resumes with an automated, verifiable <strong>Skill Passport</strong>. By linking directly to authenticated university coursework, GitHub code artifacts, and institutional credentials, SkillSync bridges the gap between academic projects and entry-level career matching.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <ShieldCheck className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="text-xs font-extrabold text-[#111111]">Zero Manual Reviewers</h3>
                  <p className="text-[11px] text-[#494D4D] mt-1">Multi-stage algorithmic parsing with OCR and digital signature validation.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <Scale className="w-6 h-6 text-emerald-600 mb-2" />
                  <h3 className="text-xs font-extrabold text-[#111111]">Guaranteed Non-Bias</h3>
                  <p className="text-[11px] text-[#494D4D] mt-1">Strips gender, name, college tier, and photo from ranking vector computations.</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <Award className="w-6 h-6 text-amber-600 mb-2" />
                  <h3 className="text-xs font-extrabold text-[#111111]">Portable Credentials</h3>
                  <p className="text-[11px] text-[#494D4D] mt-1">Export signed PDF transcripts or generate authenticated public share links.</p>
                </div>
              </div>
            </section>

            <section id="verification" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-200">
                Verification Engine
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                2. Automated Verification Tiers
              </h2>
              <p className="text-sm text-[#494D4D] leading-relaxed mb-6">
                When a student submits evidence (coursework transcript, project, or certificate), SkillSync passes it through automated evaluation stages without human verification bias. The evidence is assigned one of three standardized confidence tiers:
              </p>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tier="verified-high" />
                      <span className="text-xs font-mono font-bold text-neutral-500">Tier 1 • High Confidence</span>
                    </div>
                    <p className="text-xs text-[#494D4D] mt-2 leading-relaxed">
                      Assigned when institutional signatures, verified QR credentials, or official university registrar APIs confirm authenticity. Receives a <strong>1.0x weighting factor</strong> in match calculation.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tier="verified-medium" />
                      <span className="text-xs font-mono font-bold text-neutral-500">Tier 2 • Medium Confidence</span>
                    </div>
                    <p className="text-xs text-[#494D4D] mt-2 leading-relaxed">
                      Assigned when text transcripts or course syllabus documents are successfully parsed via OCR matching target taxonomy keywords with minimum grade thresholds (≥ 80%). Receives a <strong>0.8x weighting factor</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge tier="flagged-low" />
                      <span className="text-xs font-mono font-bold text-neutral-500">Tier 3 • Flagged / Self-Submitted</span>
                    </div>
                    <p className="text-xs text-[#494D4D] mt-2 leading-relaxed">
                      Assigned to self-submitted portfolio links without third-party proof. Receives a <strong>0.4x weighting factor</strong> and displays an informational tag to recruiters.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="match-engine" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-200">
                Algorithm & Math
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                3. Explainable Match Scoring Formula
              </h2>
              <p className="text-sm text-[#494D4D] leading-relaxed mb-4">
                Traditional recruiting AI functions as a black box. SkillSync guarantees 100% citation explainability. Every opportunity ranking is derived strictly from overlapping verified skills:
              </p>

              <div className="bg-[#111111] text-white p-5 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner mb-6">
                <div className="text-emerald-400 font-bold mb-2">// SkillSync Match Percentage Calculation</div>
                <div>MatchScore = ( ∑ (SkillWeight × TierFactor) / TotalJobRequirements ) × 100</div>
                <div className="text-neutral-400 mt-2">where:</div>
                <div className="text-neutral-400">  TierFactor(verified-high)   = 1.0</div>
                <div className="text-neutral-400">  TierFactor(verified-medium) = 0.8</div>
                <div className="text-neutral-400">  TierFactor(flagged-low)     = 0.4</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>
                  <strong>Transparent Evidence Citing:</strong> Every match explanation card details each required skill, the cited coursework item, and the specific missing skill gap.
                </span>
              </div>
            </section>

            <section id="passport-export" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-amber-200">
                Sharing & Interoperability
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                4. Skill Passport & Export Specifications
              </h2>
              <p className="text-sm text-[#494D4D] leading-relaxed mb-6">
                Students can share their verified credentials with hiring managers or academic advisors using two primary export formats:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <Share2 className="w-5 h-5 text-neutral-800 mb-2" />
                  <h3 className="text-xs font-bold text-[#111111]">Public Read-Only Share Link</h3>
                  <p className="text-xs text-[#494D4D] mt-1 leading-relaxed">
                    Generates a revocable cryptographically signed token (<code className="font-mono text-emerald-700 bg-white px-1 py-0.5 rounded border border-black/5">/passport/sp-token-alex-chen</code>).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <FileCode className="w-5 h-5 text-neutral-800 mb-2" />
                  <h3 className="text-xs font-bold text-[#111111]">Official Verifiable PDF Transcript</h3>
                  <p className="text-xs text-[#494D4D] mt-1 leading-relaxed">
                    Server-side rendering outputs structured PDFs with QR verification stamps, taxonomy categories, and evidence citations.
                  </p>
                </div>
              </div>
            </section>

            <section id="api-reference" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-black/5">
                API Reference
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                5. REST API Endpoints
              </h2>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600 text-white font-bold">GET</span>
                    <span className="font-bold text-[#111111]">/api/passport</span>
                  </div>
                  <p className="text-xs text-[#494D4D] mt-2">
                    Fetches the authenticated student's Skill Passport with all categorized skills and backing evidence citations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-600 text-white font-bold">GET</span>
                    <span className="font-bold text-[#111111]">/api/opportunities</span>
                  </div>
                  <p className="text-xs text-[#494D4D] mt-2">
                    Retrieves ingested internship listings ranked by explainable match percentage from LinkedIn and verified career portal feeds.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-600 text-white font-bold">POST</span>
                    <span className="font-bold text-[#111111]">/api/evidence</span>
                  </div>
                  <p className="text-xs text-[#494D4D] mt-2">
                    Submits new coursework evidence for automated OCR/QR processing and tier assignment.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-600 text-white font-bold">GET</span>
                    <span className="font-bold text-[#111111]">/api/admin/fairness</span>
                  </div>
                  <p className="text-xs text-[#494D4D] mt-2">
                    Returns algorithmic fairness audit logs and verified demographic exclusion lists.
                  </p>
                </div>
              </div>
            </section>

            <section id="fairness-audit" className="bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 scroll-mt-28">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-200">
                Governance Standards
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3 mb-4">
                6. Algorithmic Fairness & Bias Exclusion
              </h2>
              <p className="text-sm text-[#494D4D] leading-relaxed mb-4">
                SkillSync enforces strict model-layer stripping of demographic attributes. During matching runs, vector embeddings are formed exclusively from verified skill IDs. The following fields are guaranteed excluded:
              </p>

              <div className="flex flex-wrap gap-2 pt-1 mb-6">
                {["gender", "college tier", "candidate name", "profile photo", "zip / postal code", "graduation year"].map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs font-mono font-bold line-through"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 text-xs text-[#494D4D] flex items-center justify-between">
                <span>Audited regularly against EEOC and NYC Local Law 144 compliance guidelines.</span>
                <Link href="/privacy" className="font-bold text-neutral-900 hover:underline">
                  Read Privacy Policy
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

