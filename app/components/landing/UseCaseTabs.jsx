"use client";

import React, { useState } from "react";
import Link from "next/link";
import { USE_CASE_TABS, AUDIENCE_TAGS } from "@/app/data/skillsyncData.js";
import { GraduationCap, Briefcase, Users, Shield, ArrowRight } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn } from "@/app/components/ui/FadeIn";

export default function UseCaseTabs() {
  const [activeTabId, setActiveTabId] = useState("students");
  const [hoveredCta, setHoveredCta] = useState(false);

  const activeTab = USE_CASE_TABS.find((t) => t.id === activeTabId) || USE_CASE_TABS[0];

  const getIcon = (id) => {
    switch (id) {
      case "students": return GraduationCap;
      case "graduates": return Briefcase;
      case "recruiters": return Users;
      case "admin-auditors": return Shield;
      default: return GraduationCap;
    }
  };

  return (
    <section id="use-cases" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <FadeIn distance={20} duration={0.5}>
        <div 
          className="relative bg-white rounded-[32px] sm:rounded-[40px] border border-black/8 p-6 sm:p-10 md:p-14 shadow-sm overflow-hidden"
          style={{
            backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.12) 1.25px, transparent 1.25px)',
            backgroundSize: '24px 24px',
          }}
        >
          <div className="flex justify-center mb-3">
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold text-neutral-600 bg-white border border-neutral-200/90 shadow-2xs">
              Built for the Ecosystem
            </span>
          </div>

          <FadeIn delay={0.05} distance={18} duration={0.45}>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111111] tracking-tight leading-[1.15]">
                How SkillSync Empowers <br className="hidden sm:inline" />
                Every Role
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-neutral-500 font-medium mt-3">
                From students compiling coursework to recruiters hiring with zero bias.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1} distance={16} duration={0.45}>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-8 sm:mb-10">
              {USE_CASE_TABS.map((tab) => {
                const Icon = getIcon(tab.id);
                const isActive = activeTabId === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabId(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-white text-neutral-950 border-2 border-neutral-900 shadow-sm font-bold scale-[1.02]"
                        : "bg-white/90 hover:bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200/90 shadow-2xs"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-neutral-500"}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </FadeIn>

          <FadeIn delay={0.12} distance={20} duration={0.5}>
            <div className="relative w-full rounded-[24px] sm:rounded-[32px] overflow-hidden bg-neutral-950 min-h-[420px] sm:min-h-[480px] md:min-h-[520px] shadow-lg border border-black/10 flex items-end justify-end px-2 sm:px-4 md:px-5 py-4 sm:py-6 md:py-7">
              <img
                key={activeTab.id}
                src={activeTab.imageUrl}
                alt={activeTab.label}
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/15 pointer-events-none" />
              <div className="absolute inset-0 bg-black/10 pointer-events-none" />

              <div 
                className="relative z-10 w-full sm:max-w-[460px] md:max-w-[490px] bg-black/35 backdrop-blur-md sm:backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl p-6 sm:p-7 text-white shadow-2xl transition-all duration-300 flex flex-col gap-3.5 sm:gap-4"
                style={{
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <p className="text-sm sm:text-base md:text-[16px] font-medium text-white/95 leading-relaxed drop-shadow-xs">
                  {activeTab.title}
                </p>

                <div className="flex items-baseline gap-3 flex-nowrap">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight whitespace-nowrap drop-shadow-sm">
                    {activeTab.metric}
                  </span>
                  <span className="text-xs sm:text-sm md:text-[15px] font-semibold text-white/90 whitespace-nowrap drop-shadow-xs">
                    {activeTab.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.06} distance={14} duration={0.35}>
            <div>
              <div className="flex justify-center mt-8 sm:mt-10">
                <Link
                  href="/signup"
                  onMouseEnter={() => setHoveredCta(true)}
                  onMouseLeave={() => setHoveredCta(false)}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-neutral-900 text-white rounded-full font-bold text-sm hover:bg-neutral-800 transition-all hover:scale-95 active:scale-90 shadow-[0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] group border border-black/10"
                >
                  <RollingText
                    text="Get Started Now"
                    autoPlay={hoveredCta}
                    animationTrigger="onAppear"
                    rollDuration={0.4}
                    staggerDelay={0.015}
                    textColor="#FFFFFF"
                    font={{ fontSize: '14px', fontWeight: '800', lineHeight: '1.2em' }}
                  />
                  <ArrowRight className="w-4 h-4 text-emerald-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <p className="text-xs sm:text-sm text-neutral-500 font-medium mb-2.5">
                  And for every kind of daily rhythm
                </p>
                <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-neutral-600 font-medium">
                  {AUDIENCE_TAGS.map((tag) => (
                    <span key={tag} className="hover:text-neutral-950 transition-colors cursor-default">
                      {tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
  </section>
);
}

