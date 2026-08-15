"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SMART_ASSIST_CARDS } from "@/app/data/skillsyncData.js";
import { Sparkles, CheckCircle2, Award, Briefcase, Scale, ArrowRight } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn, FadeInStagger, FadeInItem } from "@/app/components/ui/FadeIn";

export default function SmartAssist() {
  const [hovered, setHovered] = useState(false);

  const getIcon = (iconName) => {
    switch (iconName) {
      case "CheckCircle2": return CheckCircle2;
      case "Award": return Award;
      case "Briefcase": return Briefcase;
      case "Scale": return Scale;
      default: return Sparkles;
    }
  };

  return (
    <section id="fair-match" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <FadeIn distance={28} duration={0.85}>
        <div id="smart-assist" className="bg-white rounded-[40px] p-8 sm:p-12 shadow-xl border border-black/5 flex flex-col gap-10 scroll-mt-24">
          <FadeIn delay={0.1} distance={24} duration={0.85}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explainable Core</span>
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight">
                  SkillSync Match Engine Architecture
                </h2>
              </div>
              <p className="text-sm text-[#494D4D] font-medium max-w-md">
                Built to provide total transparency into every recommendation with 100% verifiable citations and guaranteed non-discrimination.
              </p>
            </div>
          </FadeIn>

          {/* Feature Cards Grid */}
          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={0.16} delayChildren={0.2}>
            {SMART_ASSIST_CARDS.map((card) => {
              const Icon = getIcon(card.icon);
              return (
                <FadeInItem key={card.id}>
                  <div
                    className={`group bg-white p-6 sm:p-7 rounded-[28px] border border-black/10 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col justify-between gap-4 h-full ${card.cardShadow}`}
                  >
                    <div>
                      <div
                        className={`w-12 h-12 rounded-full ${card.iconBg} ${card.iconShadow} text-white flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                      >
                        <Icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111111] tracking-tight">{card.title}</h3>
                      <p className="text-xs text-[#494D4D] mt-2 leading-relaxed font-medium">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>

          {/* Action Bar */}
          <FadeIn delay={0.05} distance={14} duration={0.35}>
            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs font-bold text-[#494D4D]">
                Explore opportunities ingested live from Adzuna, Jooble, and Remotive
              </div>
              <Link
                href="/opportunities"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="inline-flex items-center gap-2 px-6.5 py-4.5 bg-neutral-900 text-white rounded-full font-extrabold text-sm hover:bg-neutral-800 transition-all hover:scale-95 active:scale-90 shadow-[0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
              >
                <RollingText
                  text="Explore Opportunities Feed"
                  autoPlay={hovered}
                  animationTrigger="onAppear"
                  rollDuration={0.8}
                  staggerDelay={0.02}
                  textColor="#FFFFFF"
                  font={{ fontSize: "15px", fontWeight: "800", lineHeight: "1.2em" }}
                />
                <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </section>
  );
}
