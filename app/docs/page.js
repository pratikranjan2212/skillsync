"use client";

import React from "react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { BookOpen, ShieldCheck, Scale, QrCode, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  const sections = [
    {
      title: "1. Skill Verification Architecture",
      icon: QrCode,
      content:
        "SkillSync uses automated OCR parsing, cryptographically signed academic credentials, and automated Git repository analysis to verify real student engineering skills without manual verifier bottlenecks.",
      bullets: [
        "Tier 1 (High): Cryptographically signed institution QR certificate or verified assessment.",
        "Tier 2 (Medium): Course transcript OCR + structured syllabus matching.",
        "Tier 3 (Flagged): Unverified self-reported claims requiring validation.",
      ],
    },
    {
      title: "2. Fair Match Engine & Demographic Shield",
      icon: Scale,
      content:
        "SkillSync guarantees non-discrimination through mathematical bias auditing. The matching algorithm strips demographic variables prior to computing rank score vectors.",
      bullets: [
        "Excludes gender, age, profile photos, full legal names, and college prestige tier.",
        "Ranks strictly on verified skill competency vectors and required opportunity prerequisites.",
        "Provides 100% explainable match breakdown for every student and recruiter.",
      ],
    },
    {
      title: "3. Portable Skill Passport API",
      icon: ShieldCheck,
      content:
        "Every student receives a cryptographic Skill Passport shareable via dynamic URL, signed PDF, or standardized JSON-LD schema.",
      bullets: [
        "GET /api/passport — Retrieve verified student passport credentials.",
        "POST /api/evidence/upload — Ingest transcript, certificate, or GitHub proof.",
        "GET /api/opportunities — Search matched internship listings with cosine similarity scores.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 shadow-xs text-xs font-bold text-emerald-800 mb-4">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Platform Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            SkillSync Architecture Docs
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-4">
            Technical overview of the automated skill verification pipeline and explainable matching engine.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{section.title}</h2>
                </div>
                <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6">
                  {section.content}
                </p>
                <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-black/5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-3">Key Specifications</h4>
                  <ul className="space-y-2">
                    {section.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-3xl bg-neutral-900 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold">Ready to explore your passport?</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1">Check verified skill evidence and view match scores.</p>
          </div>
          <Link
            href="/passport"
            className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-sm transition-all flex items-center gap-2 shrink-0"
          >
            <span>Open Skill Passport</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}