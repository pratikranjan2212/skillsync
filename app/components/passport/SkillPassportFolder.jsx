"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Sparkles, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import InteractivePassportCard from "./InteractivePassportCard";

/**
 * SkillPassportFolder Component.
 * 
 * Provides a "confidential folder" reveal interaction wrapping the landscape Skill Passport card.
 * - Portrait folder in idle state with a peeking card sliver labelled "CLICK TO OPEN".
 * - On hover: folder lifts slightly and the peeking sliver shifts outwards.
 * - On click: paper card slides out, rotates from 90° -> 0°, expands into full landscape orientation centered on screen.
 * - Respects prefers-reduced-motion, keyboard accessibility (Enter/Space to open, Escape to close), and mobile scaling.
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
  const folderRef = useRef(null);
  const modalContentRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

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
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* ========================================================================= */}
      {/* ======================= IDLE / HOVER FOLDER VIEW ======================== */}
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
        className="group relative cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-emerald-500/40 rounded-[32px] p-2"
      >
        {/* Subtle Ambient Radial Glow Behind Folder */}
        <div className="absolute -inset-4 bg-emerald-500/10 rounded-[40px] blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* --- Folder Container Frame --- */}
        <div className="relative w-[280px] sm:w-[320px] md:w-[340px] aspect-[3/4.2] flex items-center justify-center">
          
          {/* 1. BACK FOLDER FLAP (Dark with curved top-right tab) */}
          <div 
            className="absolute inset-0 right-[-14px] sm:right-[-18px] top-[-6px] bg-[#0A0F0C] rounded-[28px] sm:rounded-[32px] border border-emerald-500/15 shadow-xl pointer-events-none"
            style={{
              clipPath: "polygon(0 0, 82% 0, 94% 6%, 100% 12%, 100% 100%, 0 100%)"
            }}
          />

          {/* 2. PEEKING CARD SLIVER (White paper teaser with vertical text placed prominently at the top) */}
          <motion.div
            animate={
              shouldReduceMotion
                ? {}
                : {
                    x: isHovered ? 30 : 20,
                    rotate: isHovered ? 4.2 : 2.8,
                    y: isHovered ? -4 : 0
                  }
            }
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-[-10px] sm:right-[-14px] top-4 bottom-4 w-14 sm:w-16 bg-white rounded-l-none rounded-r-2xl sm:rounded-r-3xl border border-black/10 shadow-[0_12px_28px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col items-center pt-7 pb-4 z-10 pointer-events-none"
          >
            {/* Vertical text: "CLICK TO OPEN" placed prominently towards the top */}
            <span 
              className="font-mono text-[10px] sm:text-[11px] font-black tracking-[0.32em] text-[#111111] uppercase whitespace-nowrap select-none"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)"
              }}
            >
              CLICK TO OPEN
            </span>
          </motion.div>

          {/* 3. FRONT FOLDER COVER (SkillSync brand obsidian theme) */}
          <div
            className={`relative z-20 w-full h-full rounded-[28px] sm:rounded-[32px] p-7 sm:p-8 flex flex-col justify-between overflow-hidden border border-emerald-500/25 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65),_0_0_0_1px_rgba(16,185,129,0.15)] ${
              folderColor || "bg-gradient-to-br from-[#121A15] via-[#0E1511] to-[#080D0A]"
            }`}
          >
            {/* Inner radial gradient highlights */}
            <div className="absolute -top-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Subtle Laser Mesh lines in bottom left corner */}
            <svg 
              className="absolute bottom-0 left-0 w-44 h-32 opacity-15 pointer-events-none" 
              viewBox="0 0 200 150" 
              fill="none"
            >
              <path d="M0,120 C50,80 100,130 180,90" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M0,100 C45,65 95,115 180,75" stroke="#10B981" strokeWidth="1" />
              <path d="M0,80 C40,50 90,100 180,60" stroke="#10B981" strokeWidth="0.75" />
            </svg>

            {/* Folder Front: Top-Left Configurable Logo */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-inner">
                  <img 
                    src={logoSrc} 
                    onError={(e) => { e.currentTarget.src = "/logo.svg"; }} 
                    alt="SkillSync Logo" 
                    className={logoClassName} 
                  />
                </div>
              </div>

              {/* Status pill badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 shadow-2xs">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span className="tracking-wide">VERIFIED</span>
              </div>
            </div>

            {/* Folder Front: Center Subtle Hologram Watermark */}
            <div className="flex flex-col items-center justify-center my-auto opacity-20 group-hover:opacity-35 transition-opacity duration-300 pointer-events-none">
              <div className="w-20 h-20 rounded-full border border-dashed border-emerald-400/40 flex items-center justify-center">
                <Lock className="w-8 h-8 text-emerald-400" />
              </div>
            </div>

            {/* Folder Front: Bottom Details */}
            <div className="flex flex-col gap-2 relative z-10 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-mono text-base sm:text-lg font-black tracking-wider text-white">
                  {heading}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400/80 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  CONFIDENTIAL • VERIFIABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* ======================= OPENED MODAL REVEAL VIEW ======================== */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0.15 : 0.25 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto"
            onClick={handleClose}
          >
            {/* Unfolding Animated Card Container */}
            <motion.div
              ref={modalContentRef}
              initial={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.95 }
                  : {
                      scale: 0.35,
                      rotate: 90,
                      opacity: 0,
                      x: 80,
                      y: 40
                    }
              }
              animate={
                shouldReduceMotion
                  ? { opacity: 1, scale: 1 }
                  : {
                      scale: 1,
                      rotate: 0,
                      opacity: 1,
                      x: 0,
                      y: 0
                    }
              }
              exit={
                shouldReduceMotion
                  ? { opacity: 0, scale: 0.95 }
                  : {
                      scale: 0.35,
                      rotate: 90,
                      opacity: 0,
                      x: 80,
                      y: 40
                    }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.2 }
                  : {
                      duration: open ? 0.52 : 0.35,
                      ease: open ? [0.22, 1, 0.36, 1] : [0.36, 0, 0.66, -0.56]
                    }
              }
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
