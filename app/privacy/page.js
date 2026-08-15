"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, EyeOff, FileText, CheckCircle2, ArrowRight, Sparkles, Scale, Server } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        {/* Header Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-md border border-black/5 flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>SkillSync Privacy Guarantee</span>
            </span>
            <span className="text-xs text-[#494D4D] font-mono">Last Updated: August 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Privacy Policy & Demographic Non-Discrimination
          </h1>

          <p className="text-sm sm:text-base text-[#494D4D] leading-relaxed">
            At SkillSync, privacy is not an afterthought — it is engineered into our matching algorithm. We are committed to protecting student academic records and ensuring algorithmic evaluation is free from demographic bias.
          </p>
        </div>

        {/* Highlight Guarantee Box */}
        <div className="bg-gradient-to-r from-neutral-900 via-slate-900 to-neutral-900 text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Our Algorithmic Privacy Promise</h2>
              <p className="text-xs text-slate-300">
                Non-skill demographic metadata is scrubbed prior to opportunity matching.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { label: "Gender", status: "0% Bias" },
              { label: "College Tier", status: "Excluded" },
              { label: "Photo / Face", status: "Stripped" },
              { label: "Postal Code", status: "Excluded" },
            ].map((item) => (
              <div key={item.label} className="p-3 bg-white/10 rounded-2xl border border-white/10 text-center">
                <span className="text-xs font-mono text-slate-200 line-through block">{item.label}</span>
                <span className="text-[11px] font-bold text-emerald-400 mt-1 block">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Sections */}
        <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-sm border border-black/5 space-y-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>1. Information We Collect</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              To build your verifiable Skill Passport and calculate explainable job matches, SkillSync collects:
            </p>
            <ul className="space-y-2 text-sm text-[#494D4D] list-disc list-inside pl-2">
              <li><strong>Account Information:</strong> Name, academic email address, and authentication credentials.</li>
              <li><strong>Academic & Evidence Submissions:</strong> Coursework titles, course descriptions, GitHub project URLs, digital certificates, and OCR-extracted transcripts.</li>
              <li><strong>Taxonomy Skills:</strong> Self-selected and verified skill tags mapped to standard domains.</li>
              <li><strong>Export Preferences:</strong> Public share link toggle states and token identifiers.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>2. How We Use Your Data (Zero Data Selling)</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              We strictly utilize your data to operate the SkillSync verification pipeline. <strong>We do not sell student data, transcript records, or personal information to third-party data brokers or advertisers.</strong>
            </p>
            <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-black/5 text-xs text-[#494D4D] space-y-1.5">
              <p>• Evidence files are analyzed automatically via client-side/server-side OCR and QR verification engines.</p>
              <p>• Matches are calculated exclusively against public job listings ingested from Adzuna, Jooble, and Remotive.</p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              <span>3. FERPA & Academic Record Protection</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              SkillSync complies with educational privacy standards (including FERPA guidelines). Student transcripts uploaded to the Evidence Vault are stored in encrypted object storage (AES-256) and are accessible only to the authenticated student, unless explicitly made public via the student-controlled share link.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Server className="w-5 h-5 text-emerald-600" />
              <span>4. Public Skill Passport Controls & Revocation</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              Students retain 100% sovereignty over their Skill Passport visibility:
            </p>
            <ul className="space-y-2 text-sm text-[#494D4D] list-disc list-inside pl-2">
              <li>You can toggle your Skill Passport visibility from <strong>Public</strong> to <strong>Private</strong> at any time in the Dashboard.</li>
              <li>When set to Private, all previously shared public URLs (<code className="font-mono bg-[#F5F5F3] px-1 py-0.5 rounded text-xs">/passport/sp-token-...</code>) immediately become invalid and return access locked errors.</li>
              <li>You may request complete account and evidence deletion by contacting our privacy team.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span>5. Contact Our Privacy Office</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              For privacy inquiries, GDPR data subject requests, or algorithmic audit disclosures, reach out to:
            </p>
            <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-black/5 text-xs text-[#111111] font-mono">
              Email: <strong>privacy@skillsync.dev</strong> <br />
              Subject: Attention: Data Protection Officer
            </div>
          </section>
        </div>

        {/* Back Link */}
        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#494D4D] hover:text-[#111111]"
          >
            <span>Read Terms & Conditions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
          >
            <span>Back to SkillSync Home</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
