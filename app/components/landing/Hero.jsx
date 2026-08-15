"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Award, ShieldCheck, ArrowRight, Play, QrCode, Database, Code2, Signal, Wifi, Battery, UserX, GraduationCap, EyeOff } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import RollingText from "@/app/components/ui/RollingText";

export default function Hero({ onOpenAppModal, onOpenDemoModal }) {
  const [hoveredButton, setHoveredButton] = useState(null);
  return (
    <section className="relative overflow-hidden w-full bg-[#0d1f18]">
      {/* Top Dark Section with Floating Verified Cards */}
      <div className="relative pt-36 pb-48 md:pb-60 lg:pb-72 bg-[#0d1f18]">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-linear-to-b from-[#0d1f18] via-[#091510] to-[#111111] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
              className="w-full h-full object-cover object-center"
              alt="Background"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-emerald-600/20 rounded-full blur-[160px]"></div>
          {/* Radial Convex Upward Soft Blur Fade (No Hard Border Lines) */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[140%] sm:w-[125%] md:w-[115%] h-64 sm:h-80 md:h-96 pointer-events-none">
            {/* Multi-layered soft glowing radial curves */}
            <div 
              className="absolute inset-0 bg-[#F5F5F3] blur-3xl opacity-60"
              style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
            ></div>
            <div 
              className="absolute top-12 bottom-0 left-4 right-4 bg-[#F5F5F3] blur-2xl opacity-80"
              style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
            ></div>
            <div 
              className="absolute top-24 bottom-0 left-8 right-8 bg-[#F5F5F3] blur-xl opacity-95"
              style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
            ></div>
            <div 
              className="absolute top-36 bottom-0 left-12 right-12 bg-[#F5F5F3]"
              style={{ borderRadius: "50% 50% 0 0 / 100% 100% 0 0" }}
            ></div>
          </div>
        </div>

        {/* Hero Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center flex flex-col items-center pt-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-3 px-5.5 py-3.5 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/30 text-sm font-semibold text-white mb-6 shadow-xl">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-black uppercase tracking-wider">
              AUTOMATED VERIFICATION
            </span>
            <span className="opacity-90 pr-1">No Human Verifier • Zero Demographic Bias</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
            Convert Coursework into a <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-teal-200 to-white">
              Verified Skill Passport
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 font-medium max-w-2xl mb-8 leading-relaxed">
            SkillSync parses your coursework, projects, and credentials into an evidence-backed Skill Passport — matching you with public internships via an explainable, fair matching engine.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              onMouseEnter={() => setHoveredButton("hero1")}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-5.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[17px] shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
            >
              <RollingText
                text="Build Your Passport — Free"
                autoPlay={hoveredButton === "hero1"}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#000000"
                font={{ fontSize: "17px", fontWeight: "800", lineHeight: "1.2em" }}
              />
              <ArrowRight className="w-4.5 h-4.5 stroke-3" />
            </Link>

            <Link
              href="/opportunities/opt-1"
              onMouseEnter={() => setHoveredButton("hero2")}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-5.5 rounded-full bg-white/5 text-white font-bold text-[17px] shadow-sm backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
            >
              <Sparkles className="w-4.5 h-4.5 text-emerald-400" />
              <RollingText
                text="View Match Explanation"
                autoPlay={hoveredButton === "hero2"}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#FFFFFF"
                font={{ fontSize: "17px", fontWeight: "700", lineHeight: "1.2em" }}
              />
            </Link>
          </div>
        </div>

        {/* Floating UI Mockups Grid with Asynchronous Levitation Physics */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4">
          {/* Left Card: Glowing Streak/Verification Badge Card (Floats Upwards) */}
          <div className="lg:col-span-3 -translate-y-4 lg:-translate-y-10 hidden sm:block">
            <div className="animate-float-left bg-[#181818]/90 backdrop-blur-2xl border border-white/12 rounded-[32px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.65)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              {/* Radial Ambient Aura behind the Badge */}
              <div className="absolute top-8 w-28 h-28 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />

              {/* Glowing Medal / Badge Icon */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-tr from-emerald-500 via-emerald-400 to-green-300 text-neutral-950 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.55)] mb-5 ring-4 ring-emerald-500/20 relative z-10 group-hover:scale-105 transition-transform">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5] text-neutral-950" />
              </div>

              {/* Headline & Subtitle */}
              <h4 className="font-black text-base sm:text-lg text-white leading-tight">
                verified-high
              </h4>
              <p className="text-xs text-neutral-400 font-medium mt-1.5">
                Institutional Signature
              </p>
            </div>
          </div>

          {/* Center Card: Main Phone / Passport Dashboard Mockup (Steady Central Float) */}
          <div className="lg:col-span-6">
            <div className="animate-float-slow bg-[#161616]/95 backdrop-blur-2xl border border-white/15 rounded-[36px] p-5 sm:p-7 shadow-[0_35px_80px_rgba(0,0,0,0.75)] text-white relative overflow-hidden group hover:border-white/25 transition-all duration-300">
              {/* Top Phone Status & Dynamic Island Bar */}
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 text-neutral-400 text-xs">
                <span className="font-mono font-bold text-[11px] text-neutral-300">Wed, 10:42</span>

                {/* Dynamic Island Notch */}
                <div className="w-16 h-4 bg-black rounded-full border border-white/15 flex items-center justify-end px-1.5 gap-1 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                </div>

                {/* Status Indicators */}
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Passport Header Info */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                    Alex Chen's Skill Passport
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
                    3 of 5 verified skills
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                  Public Link Active
                </span>
              </div>

              {/* Verified Evidence Skill Rows (Mirrors the Habit Tile Layout) */}
              <div className="space-y-3">
                {/* Row 1 */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/90 border border-white/8 flex items-center justify-between gap-3 hover:bg-neutral-800/90 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Code2 className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-white">Data Pipeline Project</p>
                      <p className="text-[11px] text-neutral-400">Python • SQL • ETL</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-emerald-400/15 text-emerald-300 text-[10px] sm:text-[11px] font-extrabold border border-emerald-400/30 whitespace-nowrap">
                    verified-high (QR-confirmed)
                  </span>
                </div>

                {/* Row 2 */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/90 border border-white/8 flex items-center justify-between gap-3 hover:bg-neutral-800/90 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                      <Database className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-white">DBMS Coursework (Grade 92%)</p>
                      <p className="text-[11px] text-neutral-400">Relational DBs • Query Indexing</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-amber-400/15 text-amber-300 text-[10px] sm:text-[11px] font-extrabold border border-amber-400/30 whitespace-nowrap">
                    verified-medium (OCR-parsed)
                  </span>
                </div>

                {/* Row 3 */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-900/90 border border-white/8 flex items-center justify-between gap-3 hover:bg-neutral-800/90 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-extrabold text-white">Neural Net Optimization</p>
                      <p className="text-[11px] text-neutral-400">PyTorch • Transformer Model</p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-teal-400/15 text-teal-300 text-[10px] sm:text-[11px] font-extrabold border border-teal-400/30 whitespace-nowrap">
                    verified-high (API-verified)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Fairness Guarantee Exclusion Card (Floats Downwards) */}
          <div className="lg:col-span-3 translate-y-4 lg:translate-y-10 hidden sm:block">
            <div className="animate-float-right bg-[#181818]/90 backdrop-blur-2xl border border-white/12 rounded-[32px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.65)] text-white relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-extrabold tracking-wider block mb-1">
                ALGORITHMIC GUARANTEE
              </span>
              <h4 className="font-extrabold text-sm text-white mb-4">
                Excluded from Ranking
              </h4>

              {/* 3 Circular Exclusion Badges (Matching Sample Image Icon Pods) */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1 mb-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <UserX className="w-5 h-5 text-neutral-900" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 mt-1.5 block">gender</span>
                  <span className="text-[10px] text-emerald-400 font-black">0% bias</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-5 h-5 text-neutral-900" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 mt-1.5 block">college</span>
                  <span className="text-[10px] text-emerald-400 font-black">0% bias</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-white text-neutral-950 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                    <EyeOff className="w-5 h-5 text-neutral-900" />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 mt-1.5 block">photo</span>
                  <span className="text-[10px] text-emerald-400 font-black">0% bias</span>
                </div>
              </div>

              {/* Strikethrough Checklist */}
              <div className="flex flex-col gap-1 text-[11px] font-mono text-neutral-300 pt-2 border-t border-white/10">
                {["gender", "college tier", "name", "photo"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                    <span className="line-through text-neutral-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="relative z-20 bg-[#F5F5F3] pt-12 sm:pt-16 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] leading-[1.15] mb-8">
            Verifiable evidence replaces manual resumes with <span className="underline decoration-emerald-500 decoration-4">100% transparent</span> skill matching.
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {["#Students", "#Engineers", "#Recruiters", "#DataScientists", "#Developers"].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-white text-[#494D4D] text-xs font-bold border border-black/5 shadow-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
