"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Award } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";

export default function FinalCTA() {
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-neutral-900 rounded-[40px] p-8 sm:p-14 text-white text-center shadow-2xl border border-white/10 flex flex-col items-center gap-6">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
          Get Started Today
        </span>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl leading-tight">
          Ready to build your verified Skill Passport?
        </h2>

        <p className="text-sm sm:text-base text-neutral-300 max-w-xl font-medium">
          Upload your coursework and projects now. Get matched with top internship listings with 100% explainable evidence citations and zero bias.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
          <Link
            href="/signup"
            onMouseEnter={() => setHoveredButton("cta1")}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-8 py-5.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-base rounded-full shadow-xl transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
          >
            <RollingText
              text="Create Student Passport — Free"
              autoPlay={hoveredButton === "cta1"}
              animationTrigger="onAppear"
              rollDuration={0.4}
              staggerDelay={0.015}
              textColor="#000000"
              font={{ fontSize: "16px", fontWeight: "800", lineHeight: "1.2em" }}
            />
            <ArrowRight className="w-4.5 h-4.5 stroke-3" />
          </Link>

          <Link
            href="/opportunities"
            onMouseEnter={() => setHoveredButton("cta2")}
            onMouseLeave={() => setHoveredButton(null)}
            className="px-8 py-5.5 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-full backdrop-blur-md border border-white/15 transition-all hover:scale-95 active:scale-90 flex items-center gap-2.5"
          >
            <Award className="w-4.5 h-4.5 text-amber-400" />
            <RollingText
              text="Browse Ingested Opportunities"
              autoPlay={hoveredButton === "cta2"}
              animationTrigger="onAppear"
              rollDuration={0.4}
              staggerDelay={0.015}
              textColor="#FFFFFF"
              font={{ fontSize: "16px", fontWeight: "700", lineHeight: "1.2em" }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
