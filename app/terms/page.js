"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldAlert, CheckCircle2, Award, Scale, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex-1">
        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-md border border-black/5 flex flex-col gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 inline-flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-600" />
              <span>Legal Terms of Service</span>
            </span>
            <span className="text-xs text-[#494D4D] font-mono">Effective: August 2026</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight">
            Terms & Conditions
          </h1>

          <p className="text-sm sm:text-base text-[#494D4D] leading-relaxed">
            Please read these Terms & Conditions carefully before using the SkillSync platform, submitting academic evidence, or sharing your verified Skill Passport.
          </p>
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-4xl p-6 sm:p-8 text-rose-900 flex flex-col gap-3 mb-8">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <h2 className="text-base font-bold text-rose-950">Academic Integrity & Anti-Forgery Standard</h2>
          </div>
          <p className="text-xs sm:text-sm text-rose-800 leading-relaxed">
            SkillSync uses automated OCR, digital signature hashes, and registrar verification to maintain credential authenticity. Uploading falsified grade sheets, forged QR signatures, or plagiarized code repositories results in immediate evidence invalidation and permanent account suspension.
          </p>
        </div>

        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-sm border border-black/5 space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              By creating an account, accessing the SkillSync Dashboard, submitting evidence items, or viewing public Skill Passports, you agree to be bound by these Terms. If you do not agree to these terms, do not access or use the platform.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>2. Evidence Submission & Verification Tiers</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              SkillSync operates an automated multi-tier verification engine:
            </p>
            <ul className="space-y-2 text-sm text-[#494D4D] list-disc list-inside pl-2">
              <li><strong>Tier Assignments:</strong> Assigned tiers (<code className="font-mono bg-[#F5F5F3] px-1 py-0.5 rounded text-xs text-neutral-800">verified-high</code>, <code className="font-mono bg-[#F5F5F3] px-1 py-0.5 rounded text-xs text-neutral-800">verified-medium</code>, <code className="font-mono bg-[#F5F5F3] px-1 py-0.5 rounded text-xs text-neutral-800">flagged-low</code>) reflect automated confidence assessments based on document characteristics and digital signatures.</li>
              <li><strong>Administrative Overrides:</strong> SkillSync administrators and institutional auditors reserve the right to audit and adjust verification tiers if discrepancies are discovered.</li>
              <li><strong>Accuracy Responsibility:</strong> You are responsible for ensuring that coursework titles, GitHub URLs, and project scopes accurately reflect your original contributions.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-600" />
              <span>3. Job Matching & Ingested Opportunities</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              Job and internship listings are ingested from public aggregators including Adzuna, Jooble, and Remotive:
            </p>
            <ul className="space-y-2 text-sm text-[#494D4D] list-disc list-inside pl-2">
              <li>SkillSync calculated match percentages are recommendations based strictly on taxonomy skill overlap.</li>
              <li>SkillSync does not guarantee interview offers, hiring outcomes, or employment contracts.</li>
              <li>External job postings are governed by the respective hiring employers' policies.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>4. Intellectual Property Rights</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              You retain all intellectual property rights and copyright to your submitted coursework, code repositories, and project materials. By uploading to SkillSync, you grant us a non-exclusive, limited license solely to analyze, process, parse, and display your Skill Passport according to your privacy settings.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-neutral-100">
            <h2 className="text-xl font-bold text-[#111111] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-emerald-600" />
              <span>5. Limitation of Liability</span>
            </h2>
            <p className="text-sm text-[#494D4D] leading-relaxed">
              SkillSync is provided on an "as is" and "as available" basis. To the maximum extent permitted by applicable law, SkillSync and its operators shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the platform.
            </p>
          </section>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#494D4D] hover:text-[#111111]"
          >
            <span>Read Privacy Policy</span>
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

