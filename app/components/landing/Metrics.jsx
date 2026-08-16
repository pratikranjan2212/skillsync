"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Sparkles,
  Check,
  FileText,
  Lock
} from "lucide-react";

export default function Metrics() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  
  const containerRef = useRef(null);
  const wheelLockRef = useRef(false);

  const metricsData = [
    {
      id: "speed",
      label: "AUTOMATED PROCESSING SPEED",
      value: "< 400ms",
      subtext: "Average OCR & crypto verification time across all evidence files",
      icon: Zap,
      badgeText: "0.38s Latency Benchmark",
      glowColor: "rgba(16, 185, 129, 0.12)",
      metricsList: ["120ms OCR Parsing", "180ms Crypto Signing", "80ms Badge Generation"]
    },
    {
      id: "bias",
      label: "DEMOGRAPHIC BIAS ELIMINATED",
      value: "100%",
      subtext: "Zero non-skill parameters used in candidate recommendation vectors",
      icon: Scale,
      badgeText: "Zero Demographic Bias",
      glowColor: "rgba(168, 85, 247, 0.12)",
      metricsList: ["Gender Excluded", "College Tier Excluded", "Name & Photo Masked"]
    },
    {
      id: "taxonomy",
      label: "STANDARDIZED SKILL TAXONOMY",
      value: "12,500+",
      subtext: "ESCO & O*NET normalized skill vectors mapped to coursework",
      icon: Database,
      badgeText: "Global Standards Mapped",
      glowColor: "rgba(245, 158, 11, 0.12)",
      metricsList: ["ESCO Taxonomy Standard", "US O*NET Framework", "Automatic Alignment"]
    },
    {
      id: "accuracy",
      label: "RECOMMENDATION ACCURACY",
      value: "99.4%",
      subtext: "Explainable evidence-backed match precision for internship recommendations",
      icon: Target,
      badgeText: "High Precision Core",
      glowColor: "rgba(59, 130, 246, 0.12)",
      metricsList: ["99.4% Match Accuracy", "Direct Proof Citations", "Zero Blind Scoring"]
    }
  ];

  // Auto-play interval timer (4.5 seconds per slide)
  useEffect(() => {
    if (!isAutoPlaying || activeModal) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % metricsData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlaying, activeModal, metricsData.length]);

  // Non-passive native wheel listener to PREVENT page vertical scroll when wheeling over carousel
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheelNative = (e) => {
      // Prevent browser default window scrolling (page going up/down)
      e.preventDefault();

      if (wheelLockRef.current || activeModal) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) > 10) {
        if (delta > 0) {
          setCurrentIndex((prev) => (prev + 1) % metricsData.length);
        } else {
          setCurrentIndex((prev) => (prev - 1 + metricsData.length) % metricsData.length);
        }
        wheelLockRef.current = true;
        setTimeout(() => {
          wheelLockRef.current = false;
        }, 450);
      }
    };

    el.addEventListener("wheel", handleWheelNative, { passive: false });
    return () => el.removeEventListener("wheel", handleWheelNative);
  }, [activeModal, metricsData.length]);

  const activeMetric = metricsData[currentIndex];
  const Icon = activeMetric.icon;

  return (
    <motion.section
      id="metrics"
      initial={{ opacity: 0, y: 45 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 px-4 sm:px-6 max-w-7xl mx-auto"
    >
      {/* Outer Card Wrapper */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="relative bg-white rounded-[36px] sm:rounded-[44px] border border-black/10 p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden group/card"
      >
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-black/8">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Platform Impact Showcase
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#111111] tracking-tight">
              Engine Benchmarks & Guarantee Standards
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#494D4D] font-medium max-w-md leading-relaxed">
            Real-time quantitative performance metrics powering candidate verification, bias elimination, and explainable job matching.
          </p>
        </div>

        {/* Dynamic Carousel Stage with Easing & Ambient Radial Glow */}
        <div className="relative min-h-90 sm:min-h-95 flex items-center justify-center py-2">
          {/* Ambient Glowing Halo */}
          <div
            className="absolute inset-0 transition-all duration-700 blur-3xl pointer-events-none rounded-full opacity-60"
            style={{ background: activeMetric.glowColor }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -40, scale: 0.97 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#F8F9FA]/90 backdrop-blur-sm rounded-[30px] p-6 sm:p-10 border border-black/8 shadow-xl"
            >
              {/* Left Column: Big Numeric Metric */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shadow-xs">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full border border-emerald-300 shadow-2xs">
                      {activeMetric.badgeText}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#494D4D] block mb-1">
                    {activeMetric.label}
                  </span>

                  <motion.div
                    key={activeMetric.value}
                    initial={{ scale: 0.95, opacity: 0.8 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-5xl sm:text-7xl font-black text-[#111111] tracking-tight leading-none my-2"
                  >
                    {activeMetric.value}
                  </motion.div>

                  <p className="text-sm sm:text-base text-[#494D4D] font-medium leading-relaxed mt-3">
                    {activeMetric.subtext}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setActiveModal(activeMetric.id)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span>Explore Benchmark Details</span>
                    <ArrowUpRight className="w-4 h-4 stroke-3" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Capability Matrix Widget */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-black/8 shadow-md flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800 uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Engine Capability Matrix</span>
                  </div>
                </div>

                {/* SLIDE WIDGET 1: SPEED */}
                {activeMetric.id === "speed" && (
                  <div className="space-y-4">
                    <div className="text-xs font-extrabold text-neutral-700">Sub-Second Processing Breakdown:</div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>01. OCR Transcript Extraction</span>
                          <span className="text-emerald-600 font-extrabold">120ms</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "30%" }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>02. Cryptographic Key Signing</span>
                          <span className="text-emerald-600 font-extrabold">180ms</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span>03. Passport Badge Generation</span>
                          <span className="text-emerald-600 font-extrabold">80ms</span>
                        </div>
                        <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "20%" }} transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE WIDGET 2: BIAS */}
                {activeMetric.id === "bias" && (
                  <div className="space-y-4">
                    <div className="text-xs font-extrabold text-neutral-700">Exclusion Parameters Masked:</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {["Gender 🚫", "College Tier 🚫", "Name 🚫", "Photo 🚫"].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-center font-extrabold text-xs text-neutral-800 flex items-center justify-center gap-1 shadow-2xs hover:bg-neutral-100 transition-colors"
                        >
                          {item}
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3.5 rounded-2xl bg-emerald-950 text-emerald-300 text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      Candidate ranking vectors evaluate strictly verified skills and evidence citations.
                    </div>
                  </div>
                )}

                {/* SLIDE WIDGET 3: TAXONOMY */}
                {activeMetric.id === "taxonomy" && (
                  <div className="space-y-4">
                    <div className="text-xs font-extrabold text-neutral-700">Supported Industry Frameworks:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <div>
                          <div className="font-extrabold text-xs text-neutral-900">ESCO European Taxonomy</div>
                          <div className="text-[11px] text-neutral-500 font-medium">Standardized Skill Classification</div>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3">
                        <span className="w-3.5 h-3.5 rounded-full bg-sky-500 animate-pulse"></span>
                        <div>
                          <div className="font-extrabold text-xs text-neutral-900">US O*NET Framework</div>
                          <div className="text-[11px] text-neutral-500 font-medium">Occupational Competency Matrix</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SLIDE WIDGET 4: ACCURACY */}
                {activeMetric.id === "accuracy" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-neutral-700">Precision Match Vector:</span>
                      <span className="text-sm font-black text-emerald-600">99.4% Benchmark</span>
                    </div>
                    <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: "99.4%" }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-neutral-900 text-white text-xs font-bold flex items-center justify-between">
                      <span>Zero Blind Scoring • 100% Citation Grounded</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-black font-extrabold text-[10px]">Verified</span>
                    </div>
                  </div>
                )}

                {/* Feature Chips */}
                <div className="pt-2 flex items-center gap-2 flex-wrap">
                  {activeMetric.metricsList.map((item, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-200/80 shadow-2xs">
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Centered Pagination Dots */}
        <div className="mt-8 pt-6 border-t border-black/8 flex items-center justify-center">
          <div className="flex items-center gap-2.5">
            {metricsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? "w-9 bg-emerald-500 shadow-xs" : "w-2.5 bg-neutral-200 hover:bg-neutral-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modals for Deep Dive */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0" onClick={() => setActiveModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 p-6 sm:p-8 overflow-hidden text-neutral-900 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              {activeModal === "speed" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Speed Benchmark</span>
                      <h3 className="text-2xl font-black text-neutral-900">Sub-400ms Verification Latency</h3>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync runs parallelized OCR document extraction, digital QR key verification, and syllabus matrix matching to issue verified badges instantaneously.
                  </p>
                  <div className="p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">LATENCY SCORE</div>
                        <div className="text-xs text-neutral-300">Average Total Processing Time per Document</div>
                      </div>
                    </div>
                    <div className="text-2xl font-black text-emerald-400">380ms</div>
                  </div>
                </div>
              )}

              {activeModal === "bias" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Scale className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Bias Simulator</span>
                      <h3 className="text-2xl font-black text-neutral-900">100% Demographic Bias Elimination</h3>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync explicitly masks non-skill demographic attributes to guarantee 100% meritocratic matching.
                  </p>
                  <div className="p-5 rounded-3xl bg-neutral-900 text-white border border-neutral-800 space-y-3">
                    <div className="text-xs text-emerald-400 font-extrabold">Excluded from Ranking Vector:</div>
                    <div className="text-sm font-semibold text-neutral-300">[Gender, College Tier, Name, Photo]</div>
                  </div>
                </div>
              )}

              {activeModal === "taxonomy" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Taxonomy Mapping</span>
                      <h3 className="text-2xl font-black text-neutral-900">12,500+ Normalized Skill Vectors</h3>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    SkillSync standardizes messy course titles into international ESCO and O*NET taxonomy standards.
                  </p>
                </div>
              )}

              {activeModal === "accuracy" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-emerald-500 text-black">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-600">Precision Match</span>
                      <h3 className="text-2xl font-black text-neutral-900">99.4% Recommendation Accuracy</h3>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600 leading-relaxed font-medium">
                    Our explainable matching vector algorithm scores candidate evidence directly against verified job requirements.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
