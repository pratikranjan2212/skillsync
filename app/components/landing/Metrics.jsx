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
      details: "100% Automated OCR parsing, cryptographic QR verification, and syllabus cross-matching with zero human bottleneck."
    },
    {
      id: "demographic",
      label: "DEMOGRAPHIC PARAMETERS EXCLUDED",
      value: "4",
      subtext: "Gender, college tier, name, photo",
      icon: Scale,
      details: "Our explainable ranking engine strips name, photo, gender, and college tier from candidate ranking vectors."
    },
    {
      id: "tiers",
      label: "VERIFICATION TIERS",
      value: "3",
      subtext: "verified-high, medium, flagged-low",
      icon: Award,
      details: "Every skill badge is categorized into verified-high, verified-medium, or flagged-low based on evidence strength."
    },
    {
      id: "formats",
      label: "PASSPORT EXPORT FORMATS",
      value: "3",
      subtext: "Share Link, PDF & JSON Schema",
      icon: Zap,
      details: "Export your skill passport as an active URL link, verifiable PDF certificate, or cryptographically signed JSON schema."
    }
  ];

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Stagger animation container
  const containerVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="metrics" className="py-16 md:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Outer Card - Clean & Spacious */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="relative bg-white rounded-[32px] border border-black/8 p-6 sm:p-10 md:p-12 shadow-sm overflow-hidden"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-black/8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Real-Time Verification Engine
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Engine Performance & Guarantee Standards
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#494D4D] font-medium max-w-md leading-relaxed">
            Every candidate evaluation is powered by automated evidence pipelines, strict demographic masking, and cryptographic verification.
          </p>
        </div>

        {/* 4 Stat Cards Grid - Simple & Readable */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metricsData.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                variants={cardVariants}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                onClick={() => setActiveModal(m.id)}
                className="group relative flex flex-col justify-between p-6 rounded-[22px] bg-[#F8F9FA] hover:bg-white border border-black/6 hover:border-emerald-500/40 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#494D4D] leading-snug">
                      {m.label}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                      <Icon className="w-4 h-4 text-emerald-600 group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  {/* Clean Large Stat Value (No badge crowding) */}
                  <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight mb-2">
                    {m.value}
                  </div>

                  {/* Clear Subtext */}
                  <p className="text-xs sm:text-sm text-[#494D4D] font-medium leading-relaxed mb-6">
                    {m.subtext}
                  </p>
                </div>

                {/* Simplified & Clean Micro-Visual Footer */}
                <div className="pt-4 border-t border-black/6 flex items-center justify-between gap-2">
                  {m.id === "verification" && (
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-black/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-700 whitespace-nowrap">
                        100% Pass
                      </span>
                    </div>
                  )}

                  {m.id === "demographic" && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {["Gender", "Tier", "Name", "Photo"].map((param, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-neutral-200/80 text-neutral-600"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.id === "tiers" && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        High
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-sky-100 text-sky-800 border border-sky-300">
                        Med
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-300">
                        Low
                      </span>
                    </div>
                  )}

                  {m.id === "formats" && (
                    <div className="flex items-center gap-1">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-900 text-white">
                        URL
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-900 text-white">
                        PDF
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-neutral-900 text-white">
                        JSON
                      </span>
                    </div>
                  )}

                  <div className="w-6 h-6 rounded-full bg-black/5 group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-all shrink-0">
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-black" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0"
              onClick={() => setActiveModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 p-6 sm:p-8 overflow-hidden text-neutral-900 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL CONTENT: AUTOMATED VERIFICATION */}
              {activeModal === "verification" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <ShieldCheck className="w-6 h-6" />
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

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync eliminates manual human verification delays by running multi-stage automated document parsing, OCR signature inspection, and syllabus matrix matching in real-time.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        01
                      </div>
                      <span className="font-bold text-xs text-neutral-900">OCR & Parsing</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Extracts course codes, grade transcripts, and GitHub commits automatically.
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        02
                      </div>
                      <span className="font-bold text-xs text-neutral-900">Crypto Signing</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Verifies SHA-256 signatures against university key registries.
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        03
                      </div>
                      <span className="font-bold text-xs text-neutral-900">Badge Issuance</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Generates verified skill passport badge in under 400 milliseconds.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                          BENCHMARK PERFORMANCE
                        </div>
                        <div className="text-xs text-neutral-300">
                          Average Processing Time per Evidence File
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">380ms</div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: DEMOGRAPHIC EXCLUSION */}
              {activeModal === "demographic" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Scale className="w-6 h-6" />
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

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Toggle below to preview how candidate profiles appear to recruiters. SkillSync explicitly masks non-skill demographic attributes to ensure 100% meritocratic matching.
                  </p>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-100 border border-neutral-200">
                    <span className="text-xs font-extrabold text-neutral-800">
                      Preview View Mode:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDemoAnonymized(false)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          !demoAnonymized
                            ? "bg-rose-500 text-white shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        Unmasked (Legacy)
                      </button>
                      <button
                        onClick={() => setDemoAnonymized(true)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          demoAnonymized
                            ? "bg-emerald-500 text-black shadow-sm"
                            : "text-neutral-600 hover:text-neutral-900"
                        }`}
                      >
                        SkillSync Anonymized
                      </button>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm text-emerald-400">
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
                          <div className="text-xs text-neutral-400">
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
                      <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                        98% Skill Match
                      </span>
                    </div>

                    <div className="pt-3 border-t border-neutral-800">
                      <span className="text-[11px] font-extrabold uppercase text-neutral-400 tracking-wider mb-2 block">
                        Verified Evidence Badges:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          PyTorch & Deep Learning (Verified-High)
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Award className="w-6 h-6" />
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

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Adjust the evidence confidence score below to see how SkillSync categorizes credentials into verified tiers.
                  </p>

                  <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-neutral-800">
                        Simulate Evidence Score:
                      </span>
                      <span className="text-lg font-black text-neutral-900">{simulatedScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="100"
                      value={simulatedScore}
                      onChange={(e) => setSimulatedScore(Number(e.target.value))}
                      className="w-full accent-emerald-500 h-2 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] text-neutral-500 font-bold">
                      <span>30% Low</span>
                      <span>60% Medium</span>
                      <span>85%+ High</span>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore >= 85
                          ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <div>
                          <div className="font-black text-sm text-neutral-900">Verified-High</div>
                          <div className="text-xs text-neutral-600">
                            Score ≥ 85% • Digital QR + Instructor Signature
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-xs">
                        Gold Badge
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore >= 60 && simulatedScore < 85
                          ? "bg-sky-50 border-sky-400 ring-2 ring-sky-500/20"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-sky-500"></span>
                        <div>
                          <div className="font-black text-sm text-neutral-900">Verified-Medium</div>
                          <div className="text-xs text-neutral-600">
                            Score 60% – 84% • Course Transcript & Syllabus Match
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-sky-500 text-white font-extrabold text-xs">
                        Silver Badge
                      </span>
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                        simulatedScore < 60
                          ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500/20"
                          : "bg-white border-neutral-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <div>
                          <div className="font-black text-sm text-neutral-900">Flagged-Low</div>
                          <div className="text-xs text-neutral-600">
                            Score &lt; 60% • Self-Reported without cryptokey validation
                          </div>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-extrabold text-xs">
                        Audit Flag
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: EXPORT FORMATS */}
              {activeModal === "formats" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Zap className="w-6 h-6" />
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

                  <div className="flex gap-2 p-1.5 rounded-2xl bg-neutral-100 border border-neutral-200">
                    <button
                      onClick={() => setSelectedFormatTab("link")}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "link"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-600" /> Share Link
                    </button>
                    <button
                      onClick={() => setSelectedFormatTab("pdf")}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "pdf"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-600" /> PDF Document
                    </button>
                    <button
                      onClick={() => setSelectedFormatTab("json")}
                      className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        selectedFormatTab === "json"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      <Code2 className="w-3.5 h-3.5 text-emerald-600" /> JSON Schema
                    </button>
                  </div>

                  <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 shadow-lg">
                    {selectedFormatTab === "link" && (
                      <div className="space-y-3">
                        <div className="text-xs text-neutral-400 font-medium">
                          Public Shareable Passport Link:
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-2xl bg-black border border-neutral-800">
                          <code className="text-xs font-mono text-emerald-400 flex-1 truncate">
                            https://skillsync.id/passport/verify/8492-alex-rivera
                          </code>
                          <button
                            onClick={handleCopyLink}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                          >
                            {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                            {copiedLink ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-[11px] text-neutral-400 leading-relaxed">
                          Anyone with this URL can view verified evidence badges and inspect cryptographic signatures.
                        </p>
                      </div>
                    )}

                    {selectedFormatTab === "pdf" && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-neutral-400 font-medium">
                            Verifiable PDF Certificate:
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 text-[10px] font-bold">
                            High-Res 300DPI
                          </span>
                        </div>
                        <div className="p-4 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-emerald-400" />
                            <div>
                              <div className="font-bold text-sm">SkillSync_Verified_Passport.pdf</div>
                              <div className="text-[11px] text-neutral-400">1.4 MB • Digital QR Embedded</div>
                            </div>
                          </div>
                          <button className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-emerald-400 transition-all cursor-pointer">
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedFormatTab === "json" && (
                      <div className="space-y-2">
                        <div className="text-xs text-neutral-400 font-medium">
                          Cryptographic JSON Payload:
                        </div>
                        <pre className="p-3.5 rounded-2xl bg-black font-mono text-[11px] text-emerald-400 overflow-x-auto border border-neutral-800 leading-relaxed">
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
