"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SMART_ASSIST_CARDS } from "@/app/data/skillsyncData.js";
import { Sparkles, CheckCircle2, Award, Briefcase, Scale, ArrowRight } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";

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
    <section id="match-engine" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-[40px] p-8 sm:p-12 shadow-xl border border-black/5 flex flex-col gap-10">
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

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SMART_ASSIST_CARDS.map((card) => {
            const Icon = getIcon(card.icon);
            return (
              <div
                key={card.id}
                className="bg-[#F8F9FA] p-6 rounded-[28px] border border-black/5 shadow-xs flex flex-col justify-between gap-4 hover:shadow-md transition-all"
              >
                <div>
                  <div className={`w-10 h-10 rounded-2xl ${card.iconBg} text-white flex items-center justify-center mb-4 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#111111]">{card.title}</h3>
                  <p className="text-xs text-[#494D4D] mt-2 leading-relaxed font-medium">
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
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
      </div>
    </section>
  );
}
