"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SMART_ASSIST_CARDS } from "@/app/data/skillsyncData.js";
import { Sparkles, CheckCircle2, Award, Briefcase, Scale, ArrowRight } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn } from "@/app/components/ui/FadeIn";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="fair-match" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <FadeIn distance={24} duration={0.55}>
        <div
          id="smart-assist"
          className="bg-white rounded-[36px] sm:rounded-[44px] p-8 sm:p-12 md:p-14 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col gap-10 scroll-mt-24"
        >
          {/* Header Row */}
          <FadeIn delay={0.02} distance={16} duration={0.4}>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <span className="px-3.5 py-1.5 bg-[#e6f7f0] border border-[#b8ebd6] text-emerald-800 text-xs font-bold rounded-full inline-flex items-center gap-2 mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Explainable Core</span>
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-[1.08]">
                  Our Match Engine <br />Architecture
                </h2>
              </div>
              <p className="text-sm sm:text-[15px] text-[#555959] font-medium max-w-[360px] leading-relaxed mt-2 md:mt-0">
                Built to provide total transparency into every recommendation with 100% verifiable citations and guaranteed non-discrimination.
              </p>
            </div>
          </FadeIn>

          {/* 4 Feature Cards (Subtle Lift & Logo Rotation on Hover, Enhanced Drop Shadow) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {SMART_ASSIST_CARDS.map((card) => {
              const Icon = getIcon(card.icon);
              return (
                <motion.div
                  key={card.id}
                  variants={itemVariants}
                  className={`group bg-white p-7 sm:p-8 rounded-[28px] sm:rounded-[32px] ${card.cardGlow} transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.01] flex flex-col justify-start min-h-[330px] cursor-pointer`}
                >
                  {/* Circular Icon Badge with Smooth Logo Rotation on Hover */}
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full ${card.iconBg} ${card.iconShadow} text-white flex items-center justify-center mb-6 transition-transform duration-400 ease-out group-hover:rotate-[15deg] group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6 stroke-[2.2] transition-transform duration-400 group-hover:scale-105" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight leading-snug mb-3 transition-colors duration-300 group-hover:text-black">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-[#555959] leading-relaxed font-medium transition-colors duration-300 group-hover:text-[#333]">
                    {card.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom Control Bar */}
          <FadeIn delay={0.06} distance={18} duration={0.45}>
            <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs sm:text-sm font-semibold text-[#494D4D]">
                Explore opportunities ingested live from Adzuna, Jooble, and Remotive
              </div>
              <Link
                href="/opportunities"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#262626] hover:bg-neutral-800 text-white rounded-full font-extrabold text-sm transition-all duration-200 hover:scale-[0.98] active:scale-95 shadow-[0_14px_30px_rgba(0,0,0,0.28)]"
              >
                <RollingText
                  text="Explore Opportunities Feed"
                  autoPlay={hovered}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#FFFFFF"
                  font={{ fontSize: "14px", fontWeight: "800", lineHeight: "1.2em" }}
                />
                <ArrowRight className="w-4.5 h-4.5 text-emerald-400 stroke-[2.5]" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </section>
  );
}
