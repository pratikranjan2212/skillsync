"use client";

import React, { useState } from "react";
import Link from "next/link";
import { USE_CASE_TABS } from "../data/skillsyncData.js";
import { GraduationCap, Briefcase, Users, Shield, ArrowRight } from "lucide-react";
import RollingText from "./RollingText";

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
    <section id="use-case" className="py-20 md:py-28 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="px-3.5 py-1 bg-white text-emerald-800 text-xs font-bold rounded-full border border-black/5 shadow-2xs">
          Built for the Ecosystem
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#111111] mt-3 tracking-tight">
          How SkillSync Empowers Every Role
        </h2>
        <p className="text-sm sm:text-base text-[#494D4D] font-medium mt-2">
          From students compiling coursework to recruiters hiring with zero bias.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bg-white p-2 rounded-3xl max-w-3xl mx-auto shadow-md border border-black/5">
        {USE_CASE_TABS.map((tab) => {
          const Icon = getIcon(tab.id);
          const isActive = activeTabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Active Card Showcase */}
      <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-xl border border-black/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 flex flex-col gap-4">
          <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-xs font-extrabold uppercase tracking-wider rounded-xl border border-black/5 w-fit">
            Use Case Focus
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111111] leading-snug">
            {activeTab.title}
          </h3>

          <blockquote className="bg-[#F8F9FA] p-4 rounded-2xl border border-black/5 text-xs text-[#494D4D] italic leading-relaxed">
            "{activeTab.quote}"
          </blockquote>

          <div className="flex items-center gap-4 pt-2">
            <div className="bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200">
              <div className="text-2xl font-black text-emerald-800">{activeTab.metric}</div>
              <div className="text-[11px] font-bold text-emerald-700">{activeTab.metricLabel}</div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/signup"
              onMouseEnter={() => setHoveredCta(true)}
              onMouseLeave={() => setHoveredCta(false)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md"
            >
              <RollingText
                text="Get Started Now"
                autoPlay={hoveredCta}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#FFFFFF"
                font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
              />
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
          </div>

        </div>

        <div className="lg:col-span-6 overflow-hidden rounded-[28px] border border-black/5 shadow-md max-h-80">
          <img
            src={activeTab.imageUrl}
            alt={activeTab.label}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
