"use client";

import React from "react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-black/5 shadow-xs text-xs font-bold text-emerald-800 mb-4">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Privacy & Fairness Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-neutral-600 text-sm sm:text-base mt-3">
            Last Updated: August 2026 • Effective for all SkillSync users & partner institutions.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-black/5 shadow-sm space-y-10 text-neutral-800">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <EyeOff className="w-5 h-5 text-emerald-600" />
              <span>1. Demographic Non-Discrimination Guarantee</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              SkillSync actively strips demographic variables including legal names, gender indicators, profile photos, and university prestige tier when computing match compatibility scores.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>2. Academic & Evidence Data Usage</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Uploaded transcripts and project repositories are processed strictly for verifiable skill extraction. We never sell or train black-box models on private coursework.
            </p>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>3. Student Control & Portability</span>
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              You maintain full cryptographic ownership of your passport. You can export credentials, share private view links, or delete your profile data at any time.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200/50">
            <h3 className="text-sm font-bold text-emerald-950 mb-1 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Independent Audit Compliance</span>
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 leading-normal">
              Our automated fairness algorithms are subjected to regular parity audits to ensure selection parity and zero disparate impact.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}