"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Scale,
  Database,
  Target,
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
  Lock,
  Layers,
  Cpu
} from "lucide-react";

export default function Metrics() {
  const [activeModal, setActiveModal] = useState(null); // 'speed' | 'bias' | 'taxonomy' | 'accuracy' | null
  const [demoAnonymized, setDemoAnonymized] = useState(true);
  const [simulatedScore, setSimulatedScore] = useState(99.4);

  const metricsData = [
    {
      id: "speed",
      label: "AUTOMATED PROCESSING SPEED",
      value: "< 400ms",
      subtext: "Average OCR & crypto verification time",
      icon: Zap,
      details: "Multi-threaded OCR document parsing, university key registry check, and instant badge issuance in under 400ms."
    },
    {
      id: "bias",
      label: "DEMOGRAPHIC BIAS ELIMINATED",
      value: "100%",
      subtext: "Zero non-skill parameters used in ranking",
      icon: Scale,
      details: "Our explainable ranking engine strips name, photo, gender, and college tier from candidate ranking vectors."
    },
    {
      id: "taxonomy",
      label: "STANDARDIZED SKILL TAXONOMY",
      value: "12,500+",
      subtext: "ESCO & O*NET normalized skill vectors",
      icon: Database,
      details: "Intelligent mapping of coursework modules to international ESCO and O*NET industry skill taxonomy standards."
    },
    {
      id: "accuracy",
      label: "RECOMMENDATION ACCURACY",
      value: "99.4%",
      subtext: "Explainable evidence-backed match precision",
      icon: Target,
      details: "Every match recommendation cites verified coursework evidence with mathematical skill coverage scores."
    }
  ];

  // Stagger animation container
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
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.section
      id="metrics"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* Outer Card with Strong Drop Shadow */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative bg-white rounded-[32px] sm:rounded-[40px] border border-black/10 p-6 sm:p-10 md:p-12 shadow-xl sm:shadow-2xl overflow-hidden"
      >
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-black/8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Platform Impact & Performance
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Engine Benchmarks & Guarantee Standards
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#494D4D] font-medium max-w-md leading-relaxed">
            Real-time quantitative performance metrics powering candidate verification, bias elimination, and explainable job matching.
          </p>
        </div>

        {/* 4 Stat Cards Grid with Drop Shadows & Spring Pop-Up Hover Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((m) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.id}
                variants={cardVariants}
                whileHover={{ y: -10, scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 380, damping: 19 }}
                onClick={() => setActiveModal(m.id)}
                className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-[24px] bg-white border border-black/8 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Subtle Glow inside Card */}
                <div className="absolute -top-20 -right-20 w-44 h-44 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all duration-500 pointer-events-none" />

                <div>
                  {/* Top Header Row */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#494D4D] leading-snug">
                      {m.label}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300 shadow-xs">
                      <Icon className="w-4.5 h-4.5 text-emerald-600 group-hover:text-black transition-colors" />
                    </div>
                  </div>

                  {/* Large Stat Value */}
                  <div className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight mb-2">
                    {m.value}
                  </div>

                  {/* Subtext */}
                  <p className="text-xs sm:text-sm text-[#494D4D] font-medium leading-relaxed mb-6">
                    {m.subtext}
                  </p>
                </div>

                {/* Micro-Visual Footer */}
                <div className="pt-4 border-t border-black/6 flex items-center justify-between gap-2">
                  {m.id === "speed" && (
                    <div className="w-full flex items-center gap-2">
                      <div className="flex-1 h-2 bg-black/8 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: "100%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[11px] font-extrabold text-emerald-700 whitespace-nowrap">
                        0.38s Latency
                      </span>
                    </div>
                  )}

                  {m.id === "bias" && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {["Gender", "Tier", "Name", "Photo"].map((param, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs"
                        >
                          {param}
                        </span>
                      ))}
                    </div>
                  )}

                  {m.id === "taxonomy" && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                        ESCO
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-100 text-sky-800 border border-sky-300 shadow-2xs">
                        O*NET
                      </span>
                    </div>
                  )}

                  {m.id === "accuracy" && (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500 text-black shadow-2xs flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> 99.4% Match
                      </span>
                    </div>
                  )}

                  <div className="w-6.5 h-6.5 rounded-full bg-black/5 group-hover:bg-emerald-500 group-hover:text-black flex items-center justify-center transition-all shrink-0 shadow-xs">
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

              {/* MODAL CONTENT: SPEED */}
              {activeModal === "speed" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        System Speed Benchmark
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        Sub-400ms Verification Latency
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync runs parallelized OCR document extraction, digital QR key verification, and syllabus matrix matching to issue verified badges instantaneously.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        120ms
                      </div>
                      <span className="font-bold text-xs text-neutral-900">OCR Extraction</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Parses transcript grades & project metadata.
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        180ms
                      </div>
                      <span className="font-bold text-xs text-neutral-900">Crypto Verification</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Verifies SHA-256 signatures against registry.
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col gap-1.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                        80ms
                      </div>
                      <span className="font-bold text-xs text-neutral-900">Badge Issuance</span>
                      <span className="text-[11px] text-neutral-500 leading-normal">
                        Renders verified passport credential badge.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                          LATENCY SCORE
                        </div>
                        <div className="text-xs text-neutral-300">
                          Average Total Processing Time per Document
                        </div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">380ms</div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: DEMOGRAPHIC BIAS */}
              {activeModal === "bias" && (
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
                        100% Demographic Bias Elimination
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Toggle below to preview candidate profiles. SkillSync explicitly masks non-skill demographic attributes to guarantee 100% meritocratic matching.
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
                                Demographic vector: [Gender, Tier, Name, Photo] strictly excluded
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
                        Verified Skill Evidence:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          PyTorch & Deep Learning
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          SQL Query Optimization
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: TAXONOMY */}
              {activeModal === "taxonomy" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Taxonomy Mapping
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        12,500+ Normalized Skill Vectors
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync standardizes messy course titles into international ESCO and O*NET taxonomy standards so candidate skills are recognized universally by employers.
                  </p>

                  <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3 shadow-sm">
                    <div className="text-xs font-extrabold text-neutral-800">Supported Taxonomy Frameworks:</div>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        European ESCO Skills Standard
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-neutral-200 text-neutral-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                        US O*NET Occupational Framework
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL CONTENT: ACCURACY */}
              {activeModal === "accuracy" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">
                        Match Precision
                      </span>
                      <h3 className="text-2xl font-black text-neutral-900">
                        99.4% Recommendation Accuracy
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Our explainable matching vector algorithm scores candidate evidence directly against verified job skill requirements with 99.4% benchmark precision.
                  </p>

                  <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-3 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-medium">Verified Match Vector Score:</span>
                      <span className="text-xl font-black text-emerald-400">99.4% Precision</span>
                    </div>
                    <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[99.4%]"></div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
