"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn } from "@/app/components/ui/FadeIn";

export default function FinalCTA() {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="py-14 sm:py-16 md:py-24 px-3.5 sm:px-6 2xl:px-8 max-w-7xl 2xl:max-w-[1536px] mx-auto">
      <FadeIn distance={18} duration={0.45}>
        <div className="bg-neutral-900 rounded-3xl sm:rounded-[40px] p-6 sm:p-12 md:p-14 text-white text-center shadow-2xl border border-white/10 flex flex-col items-center gap-5 sm:gap-6">
          <FadeIn delay={0.02} distance={12} duration={0.35}>
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
              Get Started Today
            </span>
          </FadeIn>

          <FadeIn delay={0.05} distance={14} duration={0.4}>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-3xl leading-tight">
              Ready to build your verified Skill Passport?
            </h2>
          </FadeIn>

          <FadeIn delay={0.08} distance={14} duration={0.4}>
            <p className="text-xs sm:text-base text-neutral-300 max-w-xl font-medium px-2">
              Upload your coursework and projects now. Get matched with top internship listings with 100% explainable evidence citations and zero bias.
            </p>
          </FadeIn>

          <FadeIn delay={0.12} distance={14} duration={0.35}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mt-2 w-full sm:w-auto">
              <Link
                href="/signup"
                onMouseEnter={() => setHoveredButton("cta1")}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full sm:w-auto justify-center px-6 sm:px-8 py-4 sm:py-5.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs sm:text-base rounded-full shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
              >
                <RollingText
                  text="Create Student Passport — Free"
                  autoPlay={hoveredButton === "cta1"}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#000000"
                  font={{ fontSize: "15px", fontWeight: "800", lineHeight: "1.2em" }}
                />
                <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-3" />
              </Link>

              <Link
                href="/opportunities"
                onMouseEnter={() => setHoveredButton("cta2")}
                onMouseLeave={() => setHoveredButton(null)}
                className="w-full sm:w-auto justify-center px-6 sm:px-8 py-4 sm:py-5.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-base rounded-full backdrop-blur-md border border-white/15 transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
              >
                <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
                <RollingText
                  text="Browse Ingested Opportunities"
                  autoPlay={hoveredButton === "cta2"}
                  animationTrigger="onAppear"
                  rollDuration={0.4}
                  staggerDelay={0.015}
                  textColor="#FFFFFF"
                  font={{ fontSize: "15px", fontWeight: "700", lineHeight: "1.2em" }}
                />
              </Link>
            </div>
          </FadeIn>
        </div>
      </FadeIn>
    </section>
  );
}
