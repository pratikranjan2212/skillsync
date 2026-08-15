"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[40px] p-8 sm:p-12 shadow-[0_30px_90px_-15px_rgba(0,0,0,0.14),0_10px_30px_-10px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col gap-10 transition-shadow duration-500 hover:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.18),0_15px_40px_-10px_rgba(16,185,129,0.1)]"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-full border border-emerald-200 inline-flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Explainable Core</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight">
              Our Match Engine <br />Architecture
            </h2>
          </div>
          <p className="text-base text-[#494D4D] font-medium max-w-md leading-relaxed">
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
                className={`group bg-white p-6 sm:p-7 rounded-[28px] border border-black/10 transition-all duration-300 ease-out hover:-translate-y-2 flex flex-col justify-between gap-4 ${card.cardShadow}`}
              >
                <div>
                  <div
                    className={`w-13 h-13 rounded-full ${card.iconBg} ${card.iconShadow} text-white flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1`}
                  >
                    <Icon className="w-6.5 h-6.5 transition-transform duration-300 group-hover:rotate-6" />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-xl font-black text-[#111111] tracking-tight leading-snug">{card.title}</h3>
                    <p className="text-sm text-[#494D4D] mt-3 leading-relaxed font-semibold">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm sm:text-base font-extrabold text-[#333333]">
            Explore opportunities ingested live from Adzuna, Jooble, and Remotive
          </div>
          <Link
            href="/opportunities"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="inline-flex items-center gap-2 px-7 py-4.5 bg-neutral-900 text-white rounded-full font-extrabold text-base hover:bg-neutral-800 transition-all hover:scale-95 active:scale-90 shadow-[0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
          >
            <RollingText
              text="Explore Opportunities Feed"
              autoPlay={hovered}
              animationTrigger="onAppear"
              rollDuration={0.8}
              staggerDelay={0.02}
              textColor="#FFFFFF"
              font={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2em" }}
            />
            <ArrowRight className="w-5 h-5 text-emerald-400" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
