"use client";

import React from "react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Scale, AlertCircle, FileCheck2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 shadow-xs text-xs font-bold text-emerald-800 mb-4">
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Platform Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-3">
            Last Updated: August 2026 • Governs use of SkillSync verification and matching engine.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-sm space-y-10 text-neutral-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <FileCheck2 className="w-5 h-5 text-emerald-600" />
              <span>1. Accuracy of Uploaded Evidence</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Users warrant that all transcripts, course credentials, and code repositories submitted represent their genuine academic work. Fraudulent document tampering will result in immediate tier flag revocation.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>2. Explainable Matching Standard</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              SkillSync provides explainable match compatibility scores based on verified prerequisite overlap to facilitate objective candidate evaluation.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <span>3. Ethical Recruiter Standards</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Recruiters using SkillSync agree not to demand unverified demographic indicators to circumvent blind matching filters.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}