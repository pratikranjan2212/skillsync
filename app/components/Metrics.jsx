"use client";

import React from "react";
import { ShieldCheck, Scale, Award, Zap } from "lucide-react";

export default function Metrics() {
  const metricsData = [
    {
      label: "Automated Verification",
      value: "100%",
      subtext: "No manual human verifier required",
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      label: "Demographic Parameters Excluded",
      value: "4",
      subtext: "Gender, college tier, name, photo",
      icon: Scale,
      color: "purple",
    },
    {
      label: "Verification Tiers",
      value: "3",
      subtext: "verified-high, medium, flagged-low",
      icon: Award,
      color: "amber",
    },
    {
      label: "Passport Export Formats",
      value: "3",
      subtext: "Share Link, PDF & JSON Schema",
      icon: Zap,
      color: "blue",
    },
  ];

  return (
    <section id="metrics" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-4xl p-8 sm:p-10 shadow-md border border-black/5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricsData.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="flex flex-col gap-2 p-4 rounded-2xl bg-[#F8F9FA] border border-black/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#494D4D]">{m.label}</span>
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#111111]">{m.value}</div>
              <div className="text-[11px] text-[#494D4D] font-medium">{m.subtext}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
