"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Award, ShieldCheck, ArrowRight, Play, QrCode, Database, Code2 } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import RollingText from "./RollingText";

export default function Hero({ onOpenAppModal, onOpenDemoModal }) {
  const [hoveredButton, setHoveredButton] = useState(null);
  return (
    <section className="relative overflow-hidden w-full">
      {/* Top Dark Section with Floating Verified Cards */}
      <div className="relative pt-36 pb-48 md:pb-60 lg:pb-72">
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
          {/* Fading overlay to blend into pure white background below */}
          <div className="absolute bottom-0 left-0 right-0 h-96 bg-linear-to-t from-[#F5F5F3] via-[#F5F5F3]/80 to-transparent"></div>
        </div>

        {/* Hero Text Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center flex flex-col items-center pt-4">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-white mb-6 shadow-xl">
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider">
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
              className="px-8 py-4 rounded-3xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-[15px] shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-2"
            >
              <RollingText
                text="Build Your Passport — Free"
                autoPlay={hoveredButton === "hero1"}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#000000"
                font={{ fontSize: "15px", fontWeight: "800", lineHeight: "1.2em" }}
              />
              <ArrowRight className="w-4 h-4 stroke-3" />
            </Link>

            <Link
              href="/opportunities/opt-1"
              onMouseEnter={() => setHoveredButton("hero2")}
              onMouseLeave={() => setHoveredButton(null)}
              className="px-8 py-4 rounded-3xl bg-white/5 text-white font-bold text-[15px] shadow-sm backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <RollingText
                text="View Match Explanation"
                autoPlay={hoveredButton === "hero2"}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#FFFFFF"
                font={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.2em" }}
              />
            </Link>
          </div>
        </div>

        {/* Floating UI Mockups Grid */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Card: Verification Tier Badge */}
          <div className="lg:col-span-3 lg:mb-12 hidden sm:block">
            <div className="bg-[#1C1C1C] border border-emerald-500/20 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center group">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-white mb-0.5">verified-high</h4>
              <p className="text-[11px] text-emerald-400 font-medium">QR-Confirmed Signature</p>
            </div>
          </div>

          {/* Center Card: Verified Evidence List */}
          <div className="lg:col-span-6">
            <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">Alex Chen's Skill Passport</h3>
                    <p className="text-[11px] text-neutral-400">Automated Verification Active</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                    Public Link Active
                  </span>
                </div>
              </div>

              {/* Sample Evidence Items */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Code2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Data Pipeline Project</p>
                      <p className="text-[10px] text-neutral-400">Python • SQL • ETL</p>
                    </div>
                  </div>
                  <Badge tier="verified-high" showIcon={false} />
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">DBMS Coursework (Grade 92%)</p>
                      <p className="text-[10px] text-neutral-400">Relational DBs • Query Indexing</p>
                    </div>
                  </div>
                  <Badge tier="verified-medium" showIcon={false} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Card: Fairness Guarantee Exclusion List */}
          <div className="lg:col-span-3 lg:mb-12 hidden sm:block">
            <div className="bg-[#1C1C1C] border border-white/10 rounded-3xl p-5 shadow-2xl text-white">
              <p className="text-[10px] uppercase font-mono text-emerald-400 font-bold mb-1">Algorithmic Guarantee</p>
              <h4 className="font-extrabold text-xs text-white mb-2">Excluded from Ranking</h4>

              <div className="flex flex-col gap-1.5 text-[11px] font-mono text-neutral-300">
                {["gender", "college tier", "name", "photo"].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    <span className="line-through text-neutral-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom White Section */}
      <div className="relative z-20 bg-[#F5F5F3] -mt-32 pt-28 pb-16 px-4 sm:px-6 rounded-t-[48px]">
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
