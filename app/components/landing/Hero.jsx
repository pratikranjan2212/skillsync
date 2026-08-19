"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Award, ShieldCheck, ArrowRight, Play, QrCode, Database, Code2, UserX, GraduationCap, BookOpen, Calendar, User, FolderGit2, EyeOff, ExternalLink } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn, FadeInStagger, FadeInItem } from "@/app/components/ui/FadeIn";
import MagnifyingEvidence from "@/app/components/ui/MagnifyingEvidence";
import { DocumentIcon, PassportWaves, GitHubIcon } from "@/app/components/icons";

export default function Hero() {
  const [hoveredButton, setHoveredButton] = useState(null);
  return (
    <section className="relative overflow-hidden w-full bg-[#0d1f18]">
      <div className="relative pt-36 pb-48 md:pb-60 lg:pb-72 bg-[#0d1f18]">
        <div className="absolute inset-0 bg-linear-to-b from-[#0d1f18] via-[#091510] to-[#111111] overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1600&auto=format&fit=crop"
              className="w-full h-full object-cover object-center"
              alt="Background"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-160 h-160 bg-emerald-600/20 rounded-full blur-[160px]"></div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[140%] sm:w-[125%] md:w-[115%] h-64 sm:h-80 md:h-96 pointer-events-none">
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

        <div className="relative z-20 max-w-7xl 2xl:max-w-[1536px] mx-auto px-4 sm:px-6 mb-12 sm:mb-16 text-center flex flex-col items-center pt-4">
          <FadeIn delay={0.02} distance={12} duration={0.35}>
            <div className="inline-flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-5.5 py-2.5 sm:py-3.5 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/30 text-xs sm:text-sm font-semibold text-white mb-6 shadow-xl text-center">
              <span className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-500 text-black text-[11px] sm:text-xs font-black uppercase tracking-wider shrink-0">
                AUTOMATED VERIFICATION
              </span>
              <span className="opacity-90 pr-1 text-center">No Human Verifier • Zero Demographic Bias</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.06} distance={14} duration={0.4}>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black tracking-tight text-white leading-[1.14] sm:leading-[1.08] mb-6">
              Your Journey Through Coursework, <br className="hidden sm:inline" />
              <span 
                className="inline-block mt-1 sm:mt-0"
                style={{
                  background: "linear-gradient(90deg, #10b981 0%, #6ee7b7 45%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent"
                }}
              >
                Stamped With Real-World Skills
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.1} distance={14} duration={0.4}>
            <p className="text-sm sm:text-base md:text-lg text-neutral-300 font-medium max-w-2xl 2xl:max-w-3xl mb-8 leading-relaxed px-2">
              SkillSync parses your coursework, projects, and credentials into an evidence-backed Skill Passport — matching you with public internships via an explainable, fair matching engine.
            </p>
          </FadeIn>

          <FadeIn delay={0.14} distance={14} duration={0.35}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4">
              <Link
                href="/signup"
                onMouseEnter={() => setHoveredButton("hero1")}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full sm:w-auto justify-center px-6 sm:px-8 py-4 sm:py-5.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm sm:text-[17px] shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
              >
                <RollingText
                  text="Build Your Passport — Free"
                  autoPlay={hoveredButton === "hero1"}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#000000"
                  font={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2em" }}
                />
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-3" />
              </Link>

              <Link
                href="/opportunities/opt-1"
                onMouseEnter={() => setHoveredButton("hero2")}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full sm:w-auto justify-center px-6 sm:px-8 py-4 sm:py-5.5 rounded-full bg-white/5 text-white font-bold text-sm sm:text-[17px] shadow-sm backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
                <RollingText
                  text="View Match Explanation"
                  autoPlay={hoveredButton === "hero2"}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#FFFFFF"
                  font={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.2em" }}
                />
              </Link>
            </div>
          </FadeIn>
        </div>

        <div className="relative z-10 max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4">
          <div className="sm:col-span-1 lg:col-span-3 -translate-y-0 lg:-translate-y-10">
            <div className="animate-float-left bg-[#181818]/90 backdrop-blur-2xl border border-white/12 rounded-[32px] p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.65)] flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <div className="absolute top-8 w-28 h-28 bg-emerald-500/25 rounded-full blur-2xl pointer-events-none" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-tr from-emerald-500 via-emerald-400 to-green-300 text-neutral-950 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.55)] mb-5 ring-4 ring-emerald-500/20 relative z-10 group-hover:scale-105 transition-transform">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5] text-neutral-950" />
              </div>

              <h4 className="font-black text-base sm:text-lg text-white leading-tight">
                verified-high
              </h4>
              <p className="text-xs text-neutral-400 font-medium mt-1.5">
                Institutional Signature
              </p>
            </div>
          </div>

          {/* CENTER: LANDING PAGE SKILL PASSPORT CARD */}
          <div className="sm:col-span-2 lg:col-span-6 order-first sm:order-none">
            <div className="animate-float-slow bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-5 sm:p-6 border border-white/15 hover:border-emerald-500/40 shadow-[0_35px_80px_rgba(0,0,0,0.85)] relative overflow-hidden group transition-all duration-300">
              {/* Ambient Lighting Glows */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute top-1/2 -right-20 w-72 h-72 bg-white/5 rounded-full blur-[70px] pointer-events-none" />

              {/* Watermark Waves */}
              <PassportWaves />

              <div className="relative z-10 flex flex-col justify-between h-full gap-4 sm:gap-5">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <img 
                      src="/logo.svg" 
                      alt="SkillSync Logo" 
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0" 
                    />
                    <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                      SkillSync
                    </span>
                  </div>

                  <div className="font-mono text-xs sm:text-sm font-bold">
                    <span className="text-emerald-400">ID: </span>
                    <span className="text-neutral-200">SS-2026-ALX99</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 items-start">
                  
                  {/* Left Column: Student Info */}
                  <div className="md:col-span-5 flex flex-col gap-2.5">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.35)] bg-neutral-900 relative">
                          <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                            alt="Alex Chen"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#080808] border-2 border-emerald-400 flex items-center justify-center shadow-md">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5 min-w-0">
                        <div>
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                            <User className="w-3 h-3 text-emerald-400" />
                            <span>NAME</span>
                          </div>
                          <div className="text-sm sm:text-base font-black text-white leading-tight truncate">
                            Alex Chen
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs whitespace-nowrap mt-0.5">
                          <div>
                            <span className="text-neutral-400 font-bold block text-[8px] sm:text-[9px] uppercase tracking-wider">GENDER</span>
                            <span className="text-white font-bold text-[11px] sm:text-xs">Female</span>
                          </div>
                          <div>
                            <span className="text-neutral-400 font-bold block text-[8px] sm:text-[9px] uppercase tracking-wider">DOB</span>
                            <span className="text-white font-bold text-[11px] sm:text-xs">14 Oct 2003</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                          <GraduationCap className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex items-baseline gap-1 text-xs">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">COLLEGE:</span>
                          <span className="font-bold text-white text-[11px] sm:text-xs truncate">Stanford University</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                          <BookOpen className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex items-baseline gap-1 text-xs">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">DEGREE:</span>
                          <span className="font-bold text-white text-[11px] sm:text-xs truncate">Computer Science</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                          <Calendar className="w-3 h-3" />
                        </div>
                        <div className="min-w-0 flex items-baseline gap-1 text-xs">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">BATCH:</span>
                          <span className="font-bold text-white text-[11px] sm:text-xs">2023 - 2027</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Projects */}
                  {/* Right Column: Projects & Coursework */}
                  <div className="md:col-span-7 flex flex-col gap-2.5 relative">
                    
                    {/* Project Section */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>PROJECTS</span>
                      </div>

                      <div className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-2.5 flex flex-col gap-1.5 transition-all hover:bg-neutral-800/90 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            Data Pipeline & ML Engine
                          </h4>
                          <GitHubIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        </div>

                        {/* Bottom Row: Skills on Left & Verified on Right */}
                        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                          <div className="flex flex-wrap gap-1 min-w-0">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              Python
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              SQL
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              FastAPI
                            </span>
                          </div>

                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400 shrink-0 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/25 shadow-2xs">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Coursework Section */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                        <Award className="w-3.5 h-3.5 text-emerald-400" />
                        <span>COURSEWORK</span>
                      </div>

                      <div className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-2.5 flex flex-col gap-1.5 transition-all hover:bg-neutral-800/90 shadow-2xs">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            Machine Learning
                          </h4>
                          <span title="View Certificate" className="text-neutral-400 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[10px] shrink-0 cursor-pointer">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>

                        {/* Bottom Row: Skills on Left & Verified on Right */}
                        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/5">
                          <div className="flex flex-wrap gap-1 min-w-0">
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              PyTorch
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              Transformers
                            </span>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[9px] sm:text-[10px] font-bold text-emerald-300">
                              Optimization
                            </span>
                          </div>

                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-400 shrink-0 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/25 shadow-2xs">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-2.5 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    <span>OFFICIAL SKILL PASSPORT</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sm:col-span-1 lg:col-span-3 translate-y-0 lg:translate-y-10">
            <div className="animate-float-right bg-[#181818]/90 backdrop-blur-2xl border border-white/12 rounded-[32px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.65)] text-white relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-300">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-extrabold tracking-wider block mb-1">
                ALGORITHMIC GUARANTEE
              </span>
              <h4 className="font-extrabold text-sm text-white mb-4">
                Excluded from Ranking
              </h4>

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

      <div className="relative z-20 bg-[#F5F5F3] pt-12 sm:pt-16 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl 2xl:max-w-5xl mx-auto text-center flex flex-col items-center">
          <FadeIn distance={28} duration={0.65}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl 2xl:text-6xl font-extrabold tracking-tight text-[#111111] leading-[1.18] sm:leading-[1.15] mb-8">
              Verifiable <MagnifyingEvidence text="evidence" /> replaces manual resumes{" "}
              <span className="inline-flex items-center align-middle mx-1 -mt-1 sm:-mt-1.5 transition-transform hover:scale-110 duration-200">
                <DocumentIcon className="w-7 h-7 sm:w-11 sm:h-11 md:w-12 md:h-12 inline-block drop-shadow-sm" />
              </span>{" "}
              with <span className="underline decoration-emerald-500 decoration-4">100% transparent</span> skill matching.
            </h2>
          </FadeIn>

          <FadeInStagger className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" staggerDelay={0.06}>
            {["#Students", "#Engineers", "#Recruiters", "#DataScientists", "#Developers"].map((tag) => (
              <FadeInItem key={tag}>
                <span className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white text-[#494D4D] text-xs font-bold border border-black/5 shadow-xs inline-block">
                  {tag}
                </span>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}

