"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  Award,
  Zap,
  CheckCircle2,
  EyeOff,
  X,
  ArrowUpRight,
  Copy,
  Download,
  ExternalLink,
  Sparkles,
  Check,
  FileText,
  Code2,
  Lock
} from "lucide-react";

export default function Metrics() {
  const [activeModal, setActiveModal] = useState(null); // 'verification' | 'demographic' | 'tiers' | 'formats' | null
  const [demoAnonymized, setDemoAnonymized] = useState(true);
  const [selectedFormatTab, setSelectedFormatTab] = useState("link");
  const [copiedLink, setCopiedLink] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState(88);

  const metricsData = [
    {
      id: "verification",
      label: "AUTOMATED VERIFICATION",
      value: "100%",
      subtext: "No manual human verifier required",
      icon: ShieldCheck,
      badge: "0.4s Instant Pass",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      details: "100% Automated OCR parsing, cryptographic QR verification, and syllabus cross-matching with zero human bottleneck."
    },
    {
      id: "demographic",
      label: "DEMOGRAPHIC PARAMETERS EXCLUDED",
      value: "4",
      subtext: "Gender, college tier, name, photo",
      icon: Scale,
      badge: "Zero Demographic Bias",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      details: "Our explainable ranking engine strips name, photo, gender, and college tier from candidate ranking vectors."
    },
    {
      id: "tiers",
      label: "VERIFICATION TIERS",
      value: "3",
      subtext: "verified-high, medium, flagged-low",
      icon: Award,
      badge: "3 Confidence Levels",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      details: "Every skill badge is categorized into verified-high, verified-medium, or flagged-low based on evidence strength."
    },
    {
      id: "formats",
      label: "PASSPORT EXPORT FORMATS",
      value: "3",
      subtext: "Share Link, PDF & JSON Schema",
      icon: Zap,
      badge: "Interoperable Standard",
      accentBg: "bg-emerald-500/10",
      accentBorder: "border-emerald-500/30",
      accentText: "text-emerald-600",
      pillBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      details: "Export your skill passport as an active URL link, verifiable PDF certificate, or cryptographically signed JSON schema."
    }
  ];

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Smooth Stagger Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.12
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="metrics" className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Outer Card - Clean Background (Dots Removed) */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="relative bg-white rounded-[32px] sm:rounded-[40px] border border-black/8 p-7 sm:p-11 md:p-14 shadow-sm overflow-hidden"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-black/8">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-extrabold uppercase tracking-wider mb-4"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-Time Verification Engine
            </motion.div>
            <h2 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-[1.12]">
              Engine Performance & Guarantee Standards
            </h2>
          </div>
          <p className="text-base sm:text-lg text-[#494D4D] font-medium max-w-lg leading-relaxed">
            Every candidate evaluation is powered by automated evidence pipelines, strict demographic masking, and cryptographic verification.
          </p>
        </div>

        {/* 4 Stat Cards Grid with Staggered Fade-In */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 24 }}
                onClick={() => setActiveModal(m.id)}
                className="group relative flex flex-col justify-between p-7 sm:p-8 rounded-[28px] bg-[#F8F9FA] hover:bg-white border border-black/6 hover:border-emerald-500/40 shadow-xs hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Ambient Soft Hover Glow */}
                <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-3 mb-6">
                    <span className="text-xs sm:text-[13px] font-black uppercase tracking-wider text-[#494D4D] leading-snug max-w-[180px]">
                      {m.label}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 shadow-xs">
                      <Icon className="w-5 h-5 text-emerald-600 group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  {/* Larger Stat Value */}
                  <div className="flex items-baseline gap-2.5 mb-3">
                    <span className="text-5xl sm:text-6xl font-black text-[#111111] tracking-tight">
                      {m.value}
                    </span>
                    {m.id === "verification" && (
                      <span className="text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 shadow-2xs">
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Larger Subtext */}
                  <p className="text-sm sm:text-[15px] text-[#494D4D] font-medium leading-relaxed mb-6">
                    {m.subtext}
                  </p>
                </div>

                {/* Card Micro-Visual Footer */}
                <div className="pt-5 border-t border-black/6 flex items-center justify-between">
                  {m.id === "verification" && (
                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full h-2 bg-black/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs font-bold text-[#494D4D]">
                        <span>0% Human Delay</span>
                        <span className="text-emerald-600 font-extrabold">100% Automated</span>
                      </div>
                    </div>
                  )}

                  {m.id === "demographic" && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {["Gender", "Tier", "Name", "Photo"].map((param, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-neutral-200/80 text-neutral-700 flex items-center gap-1"
                        >
                          <EyeOff className="w-3 h-3 text-neutral-500" />
                          {param}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.id === "tiers" && (
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                        High
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-sky-100 text-sky-800 border border-sky-300">
                        Med
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                        Low
                      </span>
                    </div>
                  )}

                  {m.id === "formats" && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-neutral-900 text-white flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-emerald-400" />
                        URL
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-neutral-900 text-white flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-400" />
                        PDF
                      </span>
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-neutral-900 text-white flex items-center gap-1">
                        <Code2 className="w-3 h-3 text-emerald-400" />
                        JSON
                      </span>
                    </div>
                  )}

                  <div className="w-7 h-7 rounded-full bg-black/5 group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-all ml-2 shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-neutral-600 group-hover:text-black" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Modal Popovers with Ultra-Smooth Transitions */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-0"
              onClick={() => setActiveModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-black/10 p-6 sm:p-9 overflow-hidden text-neutral-900 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL CONTENT: AUTOMATED VERIFICATION */}
              {activeModal === "verification" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        System Architecture
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        100% Automated Verification Pipeline
                      </h3>
                    </div>
                  </div>

                  <p className="text-base text-neutral-600 leading-relaxed font-medium">
                    SkillSync eliminates manual human verification delays by running multi-stage automated document parsing, OCR signature inspection, and syllabus matrix matching in real-time.
                  </p>

                  {/* Interactive Pipeline Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                    <div className="p-4.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        01
                      </div>
                      <span className="font-bold text-sm text-neutral-900">OCR & Document Parsing</span>
                      <span className="text-xs text-neutral-500 leading-relaxed">
                        Extracts course codes, grade transcripts, and GitHub commits automatically.
                      </span>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        02
                      </div>
                      <span className="font-bold text-sm text-neutral-900">Cryptographic Signing</span>
                      <span className="text-xs text-neutral-500 leading-relaxed">
                        Verifies SHA-256 signatures against university key registries.
                      </span>
                    </div>

                    <div className="p-4.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        03
                      </div>
                      <span className="font-bold text-sm text-neutral-900">Badge Issuance</span>
                      <span className="text-xs text-neutral-500 leading-relaxed">
                        Generates verified skill passport badge in under 400 milliseconds.
                      </span>
                    </div>
                  </div>

                  {/* Benchmark Stat Box */}
                  <div className="p-5 rounded-2xl bg-emerald-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <Sparkles className="w-6 h-6 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                          BENCHMARK PERFORMANCE
                        </div>
                        <div className="text-xs sm:text-sm text-neutral-300">
                          Average Processing Time per Evidence File
                        </div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-400">380ms</div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: DEMOGRAPHIC EXCLUSION */}
              {activeModal === "demographic" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                      <Scale className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Interactive Bias Simulator
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        Zero Demographic Bias Guarantee
                      </h3>
                    </div>
                  </div>

                  <p className="text-base text-neutral-600 leading-relaxed font-medium">
                    Toggle below to preview how candidate profiles appear to recruiters. SkillSync explicitly masks non-skill demographic attributes to ensure 100% meritocratic matching.
                  </p>

                  {/* Toggle Switch */}
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100 border border-neutral-200">
                    <span className="text-xs sm:text-sm font-extrabold text-neutral-800">
                      Preview View Mode:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDemoAnonymized(false)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          !demoAnonymized
                            ? "bg-rose-500 text-white shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        Unmasked (Legacy)
                      </button>
                      <button
                        onClick={() => setDemoAnonymized(true)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          demoAnonymized
                            ? "bg-emerald-500 text-black shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        SkillSync Anonymized
                      </button>
                    </div>
                  </div>

                  {/* Simulated Profile Card */}
                  <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm text-emerald-400">
                          {demoAnonymized ? "#8492" : "AR"}
                        </div>
                        <div>
                          <div className="font-extrabold text-base flex items-center gap-2">
                            {demoAnonymized ? (
                              <span className="text-emerald-400 flex items-center gap-1.5">
                                <Lock className="w-4 h-4" /> Candidate #8492
                              </span>
                            ) : (
                              <span>Alex Rivera</span>
                            )}
                          </div>
                          <div className="text-xs sm:text-sm text-neutral-400">
                            {demoAnonymized ? (
                              <span className="text-emerald-300 font-semibold">
                                Demographic data excluded from ranking vector
                              </span>
                            ) : (
                              <span>Male • Tier-1 Institution • San Francisco, CA</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                        98% Skill Match
                      </span>
                    </div>

                    <div className="pt-4 border-t border-neutral-800">
                      <span className="text-xs font-extrabold uppercase text-neutral-400 tracking-wider mb-2.5 block">
                        Verified Evidence Badges:
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          PyTorch & Deep Learning (Verified-High)
                        </span>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          SQL Query Optimization (Verified-High)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: VERIFICATION TIERS */}
              {activeModal === "tiers" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Interactive Score Simulator
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        3-Tier Verification Engine
                      </h3>
                    </div>
                  </div>

                  <p className="text-base text-neutral-600 leading-relaxed font-medium">
                    Adjust the evidence confidence score below to see how SkillSync categorizes credentials into verified tiers.
                  </p>

                  {/* Score Slider */}
                  <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-extrabold text-neutral-800">
                        Simulate Evidence Score:
                      </span>
                      <span className="text-xl font-black text-neutral-900">{simulatedScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={simulatedScore}
                      onChange={(e) => setSimulatedScore(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-2.5 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 font-bold">
                      <span>30% Low</span>
                      <span>60% Medium</span>
                      <span>85%+ High</span>
                    </div>
                  </div>

                  {/* Tier Cards Breakdown */}
                  <div className="space-y-3">
                    {/* High */}
                    <div
                      className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore >= 85
                          ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                        <div>
                          <div className="font-black text-base text-neutral-900">Verified-High</div>
                          <div className="text-xs sm:text-sm text-neutral-600">
                            Score ≥ 85% • Digital QR + Instructor Signature
                          </div>
                        </div>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-xs">
                        Gold Badge
                      </span>
                    </div>

                    {/* Medium */}
                    <div
                      className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore >= 60 && simulatedScore < 85
                          ? "bg-sky-50 border-sky-400 ring-2 ring-sky-500/20 shadow-sm"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-sky-500"></span>
                        <div>
                          <div className="font-black text-base text-neutral-900">Verified-Medium</div>
                          <div className="text-xs sm:text-sm text-neutral-600">
                            Score 60% – 84% • Course Transcript & Syllabus Match
                          </div>
                        </div>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-sky-500 text-white font-extrabold text-xs">
                        Silver Badge
                      </span>
                    </div>

                    {/* Low */}
                    <div
                      className={`p-4.5 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore < 60
                          ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500/20 shadow-sm"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                        <div>
                          <div className="font-black text-base text-neutral-900">Flagged-Low</div>
                          <div className="text-xs sm:text-sm text-neutral-600">
                            Score &lt; 60% • Self-Reported without cryptokey validation
                          </div>
                        </div>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs">
                        Audit Flag
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: EXPORT FORMATS */}
              {activeModal === "formats" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3.5 rounded-2xl bg-emerald-500 text-black">
                      <Zap className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Export Playground
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        3 Passport Export Formats
                      </h3>
                    </div>
                  </div>

                  {/* Export Tabs */}
                  <div className="flex gap-2 p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200">
                    <button
                      onClick={() => setSelectedFormatTab("link")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "link"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-600" /> Share Link
                    </button>
                    <button
                      onClick={() => setSelectedFormatTab("pdf")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "pdf"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <FileText className="w-4 h-4 text-emerald-600" /> PDF Document
                    </button>
                    <button
                      onClick={() => setSelectedFormatTab("json")}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "json"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <Code2 className="w-4 h-4 text-emerald-600" /> JSON Schema
                    </button>
                  </div>

                  {/* Format Tab Contents */}
                  <div className="p-6 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg">
                    {selectedFormatTab === "link" && (
                      <div className="space-y-3.5">
                        <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                          Public Shareable Passport Link:
                        </div>
                        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-black border border-neutral-800">
                          <code className="text-xs sm:text-sm font-mono text-emerald-400 flex-1 truncate">
                            https://skillsync.id/passport/verify/8492-alex-rivera
                          </code>
                          <button
                            onClick={handleCopyLink}
                            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copiedLink ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed">
                          Anyone with this URL can view verified evidence badges and inspect cryptographic signatures.
                        </p>
                      </div>
                    )}

                    {selectedFormatTab === "pdf" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                            Verifiable PDF Certificate:
                          </div>
                          <span className="px-2.5 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-xs font-bold">
                            High-Res 300DPI
                          </span>
                        </div>
                        <div className="p-4.5 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-between">
                          <div className="flex items-center gap-3.5">
                            <FileText className="w-9 h-9 text-emerald-400" />
                            <div>
                              <div className="font-bold text-sm sm:text-base">SkillSync_Verified_Passport.pdf</div>
                              <div className="text-xs text-neutral-400">1.4 MB • Digital QR Embedded</div>
                            </div>
                          </div>
                          <button className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-extrabold text-xs sm:text-sm flex items-center gap-2 hover:bg-emerald-400 transition-all cursor-pointer">
                            <Download className="w-4 h-4" /> Download
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedFormatTab === "json" && (
                      <div className="space-y-2.5">
                        <div className="text-xs sm:text-sm text-neutral-400 font-medium">
                          Cryptographic JSON Payload:
                        </div>
                        <pre className="p-4 rounded-2xl bg-black font-mono text-xs text-emerald-400 overflow-x-auto border border-neutral-800 leading-relaxed">
{`{
  "passport_id": "PASSPORT-8492",
  "issuer": "SkillSync Verification Engine",
  "evidence_tier": "verified-high",
  "signature": "0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e",
  "skills": ["Machine Learning", "PyTorch", "SQL Optimization"]
}`}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
