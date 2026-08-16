"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, Award, ShieldCheck, ArrowRight, Play, QrCode, Database, Code2, Signal, Wifi, Battery, UserX, GraduationCap, EyeOff } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn, FadeInStagger, FadeInItem } from "@/app/components/ui/FadeIn";
import MagnifyingEvidence from "@/app/components/ui/MagnifyingEvidence";

export default function Hero({ onOpenAppModal, onOpenDemoModal }) {
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

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 mb-16 text-center flex flex-col items-center pt-4">
          <FadeIn delay={0.02} distance={12} duration={0.35}>
            <div className="inline-flex items-center gap-3 px-5.5 py-3.5 rounded-full bg-black/50 backdrop-blur-md border border-emerald-500/30 text-sm font-semibold text-white mb-6 shadow-xl">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-black uppercase tracking-wider">
                AUTOMATED VERIFICATION
              </span>
              <span className="opacity-90 pr-1">No Human Verifier • Zero Demographic Bias</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.06} distance={14} duration={0.4}>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6">
              Your Journey Through Coursework, <br />
              <span 
                className="inline-block"
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
            <p className="text-base sm:text-lg text-neutral-300 font-medium max-w-2xl mb-8 leading-relaxed">
              SkillSync parses your coursework, projects, and credentials into an evidence-backed Skill Passport — matching you with public internships via an explainable, fair matching engine.
            </p>
          </FadeIn>

          <FadeIn delay={0.14} distance={14} duration={0.35}>
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
          </FadeIn>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center pt-4">
          <div className="lg:col-span-3 -translate-y-4 lg:-translate-y-10 hidden sm:block">
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

          <div className="lg:col-span-6">
            <div className="animate-float-slow bg-[#161616]/95 backdrop-blur-2xl border border-white/15 rounded-[36px] p-5 sm:p-7 shadow-[0_35px_80px_rgba(0,0,0,0.75)] text-white relative overflow-hidden group hover:border-white/25 transition-all duration-300">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 text-neutral-400 text-xs">
                <span className="font-mono font-bold text-[11px] text-neutral-300">Wed, 10:42</span>

                <div className="w-16 h-4 bg-black rounded-full border border-white/15 flex items-center justify-end px-1.5 gap-1 shadow-inner">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Signal className="w-3 h-3" />
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white leading-tight">
                    Alex Chen&apos;s Skill Passport
                  </h3>
                  <p className="text-[11px] sm:text-xs text-neutral-400 font-medium mt-0.5">
                    3 of 5 verified skills
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-[11px] font-extrabold border border-emerald-500/30">
                  Public Link Active
                </span>
              </div>

              <div className="space-y-3">
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
                    verified-high
                  </span>
                </div>

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
                    verified-medium
                  </span>
                </div>

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
                    verified-high
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 translate-y-4 lg:translate-y-10 hidden sm:block">
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
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <FadeIn distance={28} duration={0.65}>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] leading-[1.15] mb-8">
              Verifiable <MagnifyingEvidence text="evidence" /> replaces manual resumes{" "}
              <span className="inline-flex items-center align-middle mx-1 -mt-1 sm:-mt-1.5 transition-transform hover:scale-110 duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fillRule="evenodd"
                  strokeLinejoin="round"
                  strokeMiterlimit="2"
                  clipRule="evenodd"
                  viewBox="0 0 128 128"
                  id="document"
                  className="w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 inline-block drop-shadow-sm"
                  aria-label="Document icon"
                >
                  <path fill="#42a9df" d="M54.659,12.628c-0.523,-0.092 -1.06,0.027 -1.495,0.331c-2.358,1.652 -10.185,7.132 -12.544,8.784c-0.434,0.304 -0.73,0.768 -0.822,1.291c-1.385,7.852 -12.343,69.998 -14.443,81.908c-0.192,1.087 0.535,2.125 1.622,2.317c9.801,1.728 53.228,9.385 63.028,11.113c1.088,0.192 2.125,-0.535 2.317,-1.622c2.196,-12.452 14.127,-80.121 16.323,-92.572c0.192,-1.088 -0.535,-2.125 -1.622,-2.317c-9.039,-1.594 -46.364,-8.175 -52.364,-9.233Z"></path>
                  <path fill="#388bcb" d="M106.675,21.8c0.002,0.124 -0.008,0.251 -0.03,0.378c-2.196,12.451 -14.127,80.12 -16.323,92.572c-0.192,1.087 -1.229,1.814 -2.317,1.622l-39.366,-6.941l-18.543,-1.623l59.909,10.564c1.088,0.192 2.125,-0.535 2.317,-1.622c2.196,-12.452 14.127,-80.121 16.323,-92.572c0.192,-1.088 -0.535,-2.125 -1.622,-2.317l-0.348,-0.061Z"></path>
                  <path fill="#ffcb29" d="M43.479,10.605c-0.529,-0.046 -1.054,0.119 -1.46,0.46c-2.206,1.851 -9.525,7.993 -11.731,9.844c-0.407,0.341 -0.661,0.829 -0.707,1.357c-0.695,7.944 -6.195,70.808 -7.249,82.856c-0.096,1.1 0.718,2.07 1.818,2.166c9.914,0.868 53.843,4.711 63.757,5.578c1.1,0.096 2.07,-0.718 2.166,-1.818c1.102,-12.596 7.091,-81.047 8.193,-93.642c0.096,-1.101 -0.718,-2.071 -1.818,-2.167c-9.143,-0.8 -46.899,-4.103 -52.969,-4.634Z"></path>
                  <path fill="#fcb215" d="M96.274,15.224c-0,0.06 -0.003,0.121 -0.008,0.182c-1.102,12.595 -7.091,81.046 -8.193,93.642c-0.096,1.1 -1.066,1.914 -2.166,1.818l-37.364,-3.269l-20.86,0l60.224,5.269c1.1,0.096 2.07,-0.718 2.166,-1.818c1.102,-12.596 7.091,-81.047 8.193,-93.642c0.096,-1.101 -0.718,-2.071 -1.818,-2.167l-0.174,-0.015Z"></path>
                  <path fill="#eeefef" d="M32.153,9.597c-0.531,0 -1.039,0.211 -1.414,0.586c-2.037,2.036 -8.793,8.792 -10.829,10.829c-0.375,0.375 -0.586,0.883 -0.586,1.414c0,7.973 0,71.078 0,83.171c0,1.105 0.896,2 2,2c9.952,0 54.049,0 64,0c1.105,0 2,-0.895 2,-2c0,-12.643 0,-81.356 0,-94c0,-1.104 -0.895,-2 -2,-2c-9.178,0 -47.078,0 -53.171,0Z"></path>
                  <path fill="#e0e1e0" d="M85.324 9.597l0 94c0 1.105-.895 2-2 2l-64 0 0 0c0 1.105.896 2 2 2 9.952 0 54.049 0 64 0 1.105 0 2-.895 2-2 0-12.643 0-81.356 0-94 0-1.104-.895-2-2-2l0 0zM33.313 9.597l-1.16 0c-.293 0-.579.065-.84.185l0 9.815c0 1.105-.896 2-2 2l-9.809 0c-.117.258-.18.54-.18.829l0 1.171 11.989 0c1.104 0 2-.895 2-2l0-12z"></path>
                  <path fill="#bdbdbd" d="M31.324,9.777c-0.216,0.098 -0.414,0.235 -0.585,0.406c-2.037,2.036 -8.793,8.792 -10.829,10.829c-0.171,0.171 -0.308,0.369 -0.406,0.585l9.82,0c1.105,0 2,-0.895 2,-2l0,-9.82Z"></path>
                  <path fill="#424243" d="M28.324,74.097l25,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2l-25,0c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2Zm0,-9l50,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2l-50,0c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2Zm0,-9l50,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2l-50,0c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2Zm12,-9l38,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2l-38,0c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2Z"></path>
                  <path fill="#202020" d="M53.324,70.097c0,1.104 -0.896,2 -2,2l-25,0c0,1.104 0.897,2 2,2l25,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Zm25,-9c0,1.104 -0.896,2 -2,2l-50,0c0,1.104 0.897,2 2,2l50,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Zm0,-9c0,1.104 -0.896,2 -2,2l-50,0c0,1.104 0.897,2 2,2l50,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Zm0,-9c0,1.104 -0.896,2 -2,2l-38,0c0,1.104 0.897,2 2,2l38,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Z"></path>
                  <path fill="#424243" d="M34.324,29.597l38,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2l-38,0c-1.103,0 -2,0.896 -2,2c0,1.104 0.897,2 2,2Z"></path>
                  <path fill="#202020" d="M72.324,25.597c0,1.104 -0.896,2 -2,2l-38,0c0,1.104 0.897,2 2,2l38,0c1.104,0 2,-0.896 2,-2c0,-1.104 -0.896,-2 -2,-2Z"></path>
                  <path fill="#424243" d="M80.324,86.597c0,-0.53 -0.21,-1.039 -0.585,-1.414c-0.376,-0.375 -0.884,-0.586 -1.415,-0.586c-4.52,0 -15.48,0 -20,0c-0.53,0 -1.039,0.211 -1.414,0.586c-0.375,0.375 -0.586,0.884 -0.586,1.414c0,2.22 0,5.781 0,8c0,0.531 0.211,1.039 0.586,1.415c0.375,0.375 0.884,0.585 1.414,0.585c4.52,0 15.48,0 20,0c0.531,0 1.039,-0.21 1.415,-0.585c0.375,-0.376 0.585,-0.884 0.585,-1.415c0,-2.219 0,-5.78 0,-8Z"></path>
                  <path fill="#202020" d="M78.324,84.597l0,8c0,0.531 -0.21,1.039 -0.585,1.415c-0.376,0.375 -0.884,0.585 -1.415,0.585l-20,0l0,0c0,0.531 0.211,1.039 0.586,1.415c0.375,0.375 0.884,0.585 1.414,0.585c4.52,0 15.48,0 20,0c0.531,0 1.039,-0.21 1.415,-0.585c0.375,-0.376 0.585,-0.884 0.585,-1.415c0,-2.219 0,-5.78 0,-8c0,-0.53 -0.21,-1.039 -0.585,-1.414c-0.376,-0.375 -0.884,-0.586 -1.415,-0.586Z"></path>
                </svg>
              </span>{" "}
              with <span className="underline decoration-emerald-500 decoration-4">100% transparent</span> skill matching.
            </h2>
          </FadeIn>

          <FadeInStagger className="flex flex-wrap items-center justify-center gap-3" staggerDelay={0.06}>
            {["#Students", "#Engineers", "#Recruiters", "#DataScientists", "#Developers"].map((tag) => (
              <FadeInItem key={tag}>
                <span className="px-4 py-2 rounded-full bg-white text-[#494D4D] text-xs font-bold border border-black/5 shadow-xs inline-block">
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

