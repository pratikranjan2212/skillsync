"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Sparkles, ShieldCheck, ArrowRight, Lock, Globe, Share2, Check, Download } from "lucide-react";
import InteractivePassportCard from "./InteractivePassportCard";

/**
 * SkillPassportFolder Component.
 * 
 * Provides a "confidential folder" reveal interaction wrapping the landscape Skill Passport card.
 * - Portrait folder on left with circular action buttons on the right in idle state.
 * - On hover: folder lifts and book cover opens slightly, peeking card slides out.
 * - On click: paper card slides out, flips from backside to frontside in 3D, expands into focused landscape orientation.
 */
export default function SkillPassportFolder({
  children,
  passportData,
  onTogglePublic,
  isOpen: controlledOpen,
  onOpen,
  onClose,
  logoSrc = "/logo.svg",
  logoClassName = "w-8 h-8 object-contain",
  heading = "SKILL PASSPORT",
  subtext = "Official Skill Passport",
  folderColor,
  className = ""
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isPublic, setIsPublic] = useState(passportData?.isPublic ?? true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const folderRef = useRef(null);
  const modalContentRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (passportData?.isPublic !== undefined) {
      setIsPublic(passportData.isPublic);
    }
  }, [passportData?.isPublic]);

  const handleOpen = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(true);
    }
    if (onOpen) onOpen();
  }, [isControlled, onOpen]);

  const handleClose = useCallback(() => {
    if (!isControlled) {
      setInternalOpen(false);
    }
    if (onClose) onClose();
  }, [isControlled, onClose]);

  const handleToggle = async () => {
    const nextState = !isPublic;
    setIsPublic(nextState);
    if (onTogglePublic) {
      await onTogglePublic(nextState);
    }
  };

  const handleCopyLink = () => {
    const shareToken = passportData?.shareToken || "sp-token-user";
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/passport/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportPdf = async () => {
    const studentId = passportData?.studentId || "SS-2026-STU01";
    const shareToken = passportData?.shareToken || "";
    setIsExportingPdf(true);
    try {
      const res = await fetch(`/api/passport/pdf?studentId=${encodeURIComponent(studentId)}&shareToken=${encodeURIComponent(shareToken)}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SkillSync_Passport_${studentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      } else {
        alert("Could not generate PDF transcript. Please try again.");
      }
    } catch (err) {
      console.error("PDF export error:", err);
      alert("Failed to export PDF transcript.");
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Keyboard navigation: Escape key closes modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (open && e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleClose]);

  // Keyboard trigger on folder: Enter or Space opens
  const handleFolderKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  // Content to render inside modal (either custom children or standard InteractivePassportCard)
  const cardContent = children || (
    <InteractivePassportCard 
      passportData={passportData} 
      onTogglePublic={onTogglePublic}
      onClose={handleClose}
    />
  );

  return (
    <div className={`relative flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 lg:gap-28 select-none ${className}`}>
      {/* ========================================================================= */}
      {/* ======================= LEFT: IDLE / HOVER FOLDER ======================= */}
      {/* ========================================================================= */}
      <motion.div
        ref={folderRef}
        role="button"
        tabIndex={0}
        aria-label={`${heading} - ${subtext}. Click to open.`}
        aria-expanded={open}
        onClick={handleOpen}
        onKeyDown={handleFolderKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={
          shouldReduceMotion
            ? { opacity: 0.95 }
            : { y: -6, scale: 1.02 }
        }
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="group relative cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 rounded-[32px] p-2 shrink-0"
      >
        {/* Subtle Ambient Radial Glow Behind Folder */}
        <div className="absolute -inset-4 bg-emerald-500/15 rounded-[40px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* --- Folder Container Frame with 3D Perspective --- */}
        <div 
          style={{ perspective: 1200, transformStyle: "preserve-3d" }}
          className="relative w-[280px] sm:w-[320px] md:w-[340px] aspect-[3/4.2] flex items-center justify-center"
        >
          
          {/* 1. BACK FOLDER FLAP (Solid deep forest emerald matching clean folder curves) */}
          <div 
            className="absolute inset-0 rounded-[28px] sm:rounded-[32px] bg-[#064E3B] border border-emerald-900/60 shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
          />

          {/* 2. PEEKING CARD SLIVER (Deep full-width card - slides out tilted on hover) */}
          <motion.div
            initial={false}
            animate={
              shouldReduceMotion
                ? { opacity: isHovered ? 1 : 0 }
                : {
                    x: isHovered ? 36 : -10,
                    rotate: isHovered ? 4.8 : 0,
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? -3 : 0
                  }
            }
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-3 bottom-3 w-[70%] sm:w-[72%] bg-white rounded-2xl sm:rounded-3xl border border-neutral-300 shadow-[0_14px_30px_rgba(0,0,0,0.22)] overflow-hidden flex flex-col items-end pr-3.5 sm:pr-4 pt-7 pb-4 z-10 pointer-events-none"
          >
            {/* Vertical text: "CLICK TO OPEN" placed on the peeking right edge */}
            <span 
              className="font-mono text-[10px] sm:text-[11px] font-black tracking-[0.32em] text-[#111111] uppercase whitespace-nowrap select-none"
              style={{
                writingMode: "vertical-rl"
              }}
            >
              CLICK TO OPEN
            </span>
          </motion.div>

          {/* 4. FRONT FOLDER COVER (Hinged on the left - Opens like a book cover on hover) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    rotateY: isHovered ? -26 : 0,
                    scale: isHovered ? 1.02 : 1
                  }
            }
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d"
            }}
            className={`relative z-20 w-full h-full rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden border border-emerald-400/40 border-l-emerald-950/40 shadow-[0_25px_60px_-15px_rgba(4,120,87,0.45),_0_0_0_1px_rgba(255,255,255,0.2)] ${
              folderColor || "bg-[#047857]"
            }`}
          >
            {/* Folder Spine Left Crease Highlight */}
            <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-emerald-950/40 to-transparent pointer-events-none" />

            {/* Subtle Laser Mesh lines in bottom left corner */}
            <svg 
              className="absolute bottom-0 left-0 w-44 h-32 opacity-20 pointer-events-none" 
              viewBox="0 0 200 150" 
              fill="none"
            >
              <path d="M0,120 C50,80 100,130 180,90" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M0,100 C45,65 95,115 180,75" stroke="#FFFFFF" strokeWidth="1" />
              <path d="M0,80 C40,50 90,100 180,60" stroke="#FFFFFF" strokeWidth="0.75" />
            </svg>

            {/* Folder Front: Top Status */}
            <div className="flex items-center justify-end relative z-10">
              {/* Status pill badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 border border-white/30 text-[10px] font-bold text-white shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
                <span className="tracking-wide">VERIFIED</span>
              </div>
            </div>

            {/* Folder Front: Center Subtle Hologram Watermark */}
            <div className="flex flex-col items-center justify-center my-auto opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none">
              <div className="w-20 h-20 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                <Lock className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Folder Front: Bottom Details */}
            <div className="flex flex-col relative z-10 pt-4 border-t border-white/20">
              <h3 className="font-mono text-base sm:text-lg font-black tracking-wider text-white">
                {heading}
              </h3>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* ======================= RIGHT: CIRCULAR ACTION TOOLBAR ================== */}
      {/* ========================================================================= */}
      <div className="flex flex-row items-center justify-center gap-8 sm:gap-10 z-10 shrink-0">
        {/* 1. Public / Private Toggle */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className={`w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full flex items-center justify-center shadow-md border transition-all cursor-pointer hover:scale-105 active:scale-95 ${
              isPublic
                ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100 shadow-emerald-500/10"
                : "bg-white text-neutral-600 border-neutral-300 hover:bg-neutral-50 shadow-black/5"
            }`}
            aria-label={isPublic ? "Set to Private" : "Set to Public"}
            title={isPublic ? "Passport is Public" : "Passport is Private"}
          >
            {isPublic ? (
              <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
            ) : (
              <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-500" />
            )}
          </button>
          <span className="text-xs sm:text-sm font-bold text-neutral-800 tracking-wide select-none">
            {isPublic ? "Public" : "Private"}
          </span>
        </div>

        {/* 2. Share Button */}
        {isPublic && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-white text-neutral-800 border border-neutral-300 hover:bg-neutral-50 shadow-md shadow-black/5 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
              aria-label="Share Passport Link"
              title="Copy share link"
            >
              {copiedLink ? (
                <Check className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600" />
              ) : (
                <Share2 className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-700" />
              )}
            </button>
            <span className="text-xs sm:text-sm font-bold text-neutral-800 tracking-wide select-none">
              {copiedLink ? "Copied!" : "Share"}
            </span>
          </div>
        )}

        {/* 3. Export PDF Button */}
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-full bg-neutral-900 text-emerald-400 border border-neutral-800 hover:bg-neutral-800 shadow-md shadow-black/15 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
            aria-label="Download Passport PDF"
            title="Download PDF"
          >
            <Download className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-400" />
          </button>
          <span className="text-xs sm:text-sm font-bold text-neutral-800 tracking-wide select-none">
            {isExportingPdf ? "..." : "PDF"}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ======================= OPENED MODAL REVEAL VIEW ======================== */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.5 }}
            style={{ perspective: 2000 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto"
            onClick={handleClose}
          >
            {/* Unfolding Animated Card Container: Slides out in portrait, flips from backside to frontside in landscape */}
            <motion.div
              ref={modalContentRef}
              initial={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.95 }
                  : {
                      scale: 0.38,
                      rotate: 90,
                      rotateY: 180,
                      opacity: 0,
                      x: 80,
                      y: 30
                    }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1 }
                  : {
                      scale: 1,
                      rotate: 0,
                      rotateY: 0,
                      opacity: 1,
                      x: 0,
                      y: 0
                    }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.95 }
                  : {
                      scale: 0.38,
                      rotate: 90,
                      rotateY: 180,
                      opacity: 0,
                      x: 80,
                      y: 30
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      duration: open ? 1.35 : 0.65,
                      ease: open ? [0.16, 1, 0.3, 1] : [0.36, 0, 0.66, -0.56]
                    }
              }
              style={{
                transformStyle: "preserve-3d"
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[760px] my-auto z-50 flex items-center justify-center"
            >
              {cardContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
