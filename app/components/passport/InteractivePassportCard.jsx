"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  User, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  FolderGit2, 
  Hexagon, 
  QrCode, 
  Sparkles, 
  RotateCw, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Lock, 
  Globe,
  X
} from "lucide-react";
import SkillEvidenceModal from "./SkillEvidenceModal";
import { GitHubIcon, GenderIcon, PassportWaves } from "@/app/components/icons";

function GitHubLogo({ className = "w-4 h-4 text-emerald-400 hover:text-white" }) {
  return <GitHubIcon className={className} />;
}

function SkillSyncLogo() {
  return (
    <img 
      src="/logo.png" 
      onError={(e) => { e.currentTarget.src = "/logo.svg"; }} 
      alt="SkillSync Logo" 
      className="w-6 h-6 object-contain shrink-0" 
    />
  );
}

export default function InteractivePassportCard({
  passportData,
  className = "",
  showControls = true,
  onTogglePublic
}) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isPublic, setIsPublic] = useState(passportData?.isPublic ?? true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const hoverTimeoutRef = React.useRef(null);

  // Close focus view on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsFocused(false);
        setSelectedSkill(null);
      }
    };
    if (isFocused) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const handleSkillMouseEnter = (skill) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setSelectedSkill(skill);
  };

  const handleSkillMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedSkill(null);
    }, 250);
  };

  const handlePopoverMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
  };

  const handlePopoverMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setSelectedSkill(null);
    }, 250);
  };

  const student = {
    id: passportData?.studentId || "SS-2026-STU01",
    name: passportData?.studentName || "Student User",
    gender: passportData?.gender || "Student",
    dob: passportData?.dob || "Not Specified",
    college: passportData?.college || "Institution Not Specified",
    degree: passportData?.degree || "Degree Not Specified",
    batch: passportData?.batch || "Batch Not Specified",
    photoUrl: passportData?.photoUrl || null,
    credentialHash: passportData?.credentialHash || "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
    shareToken: passportData?.shareToken || "sp-token-user",
    verified: passportData?.verified ?? true,
    skills: passportData?.skills || [],
    projects: passportData?.projects || [],
  };

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(student.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyHash = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(student.credentialHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyLink = () => {
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/passport/${student.shareToken}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggle = async () => {
    const nextState = !isPublic;
    setIsPublic(nextState);
    if (onTogglePublic) {
      await onTogglePublic(nextState);
    }
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      const res = await fetch(`/api/passport/pdf?studentId=${student.id}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SkillSync_Passport_${student.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        window.print();
      }
    } catch (err) {
      console.error("PDF export error:", err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Reusable Passport Front Surface
  const renderPassportFront = (isEnlarged = false) => (
    <div className={`w-full bg-linear-to-br from-[#0c382b] via-[#09291f] to-[#041711] text-white rounded-3xl ${isEnlarged ? "p-6 sm:p-9" : "p-5 sm:p-6"} border border-emerald-400/30 shadow-[0_24px_60px_-12px_rgba(4,38,28,0.7),_0_0_0_1px_rgba(52,211,153,0.25)] overflow-hidden relative flex flex-col justify-between`}>
      {/* Ambient Lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-teal-400/15 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Watermark Waves */}
      <PassportWaves />

      <div className={`relative z-10 flex flex-col justify-between h-full ${isEnlarged ? "gap-6 sm:gap-7" : "gap-4 sm:gap-5"}`}>
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-emerald-400/20 pb-3">
          <div className="flex items-center gap-2">
            <SkillSyncLogo />
            <span className={`${isEnlarged ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"} font-black tracking-tight text-white`}>
              SkillSync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.18em] text-emerald-300 uppercase bg-emerald-400/15 px-3 py-0.5 rounded-full border border-emerald-400/35 shadow-inner">
              SKILL PASSPORT
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className={`grid grid-cols-1 ${isEnlarged ? "md:grid-cols-12 gap-6 sm:gap-8" : "sm:grid-cols-12 gap-4 sm:gap-5"} items-start`}>
          
          {/* Student Info */}
          <div className={`${isEnlarged ? "md:col-span-5" : "sm:col-span-5"} flex flex-col gap-3.5`}>
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className={`${isEnlarged ? "w-20 h-20 sm:w-24 sm:h-24" : "w-16 h-16 sm:w-18 sm:h-18"} rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.4)] bg-[#0c382b] relative flex items-center justify-center`}>
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt={student.name}
                      fill
                      unoptimized
                      sizes="96px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xl">
                      {student.name ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) : "ST"}
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#08291f] border-2 border-emerald-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <div>
                  <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                    <User className="w-3 h-3 text-emerald-400" />
                    <span>NAME</span>
                  </div>
                  <div className={`${isEnlarged ? "text-base sm:text-lg" : "text-sm sm:text-base"} font-black text-white leading-tight truncate`}>
                    {student.name}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-[10px] whitespace-nowrap">
                  <div>
                    <span className="text-emerald-400/90 font-bold block text-[8px] uppercase">GENDER</span>
                    <span className="text-neutral-200 font-semibold">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-emerald-400/90 font-bold block text-[8px] uppercase">DOB</span>
                    <span className="text-neutral-200 font-semibold">{student.dob}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1 border-t border-emerald-400/15">
              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] font-bold text-emerald-400/90 uppercase tracking-wider">COLLEGE</div>
                  <div className="text-xs font-bold text-white leading-snug truncate">{student.college}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] font-bold text-emerald-400/90 uppercase tracking-wider">DEGREE</div>
                  <div className="text-xs font-bold text-white leading-snug truncate">{student.degree}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[8px] font-bold text-emerald-400/90 uppercase tracking-wider">BATCH</div>
                  <div className="text-xs font-bold text-white">{student.batch}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Projects (Without Skill Icons) */}
          <div className={`${isEnlarged ? "md:col-span-7" : "sm:col-span-7"} flex flex-col gap-4 relative`}>
            {/* Skills Section - Clean Text Badges */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Hexagon className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                <span>SKILLS ({student.skills.length})</span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {student.skills.map((skill, idx) => {
                  const skillKey = skill.skillId || skill.id || skill.name || `skill-${idx}`;
                  const isSelected = selectedSkill && (
                    (selectedSkill.skillId && skill.skillId && selectedSkill.skillId === skill.skillId) ||
                    selectedSkill.name === skill.name
                  );

                  return (
                    <button
                      type="button"
                      key={skillKey}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        handleSkillMouseEnter(skill);
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        handleSkillMouseLeave();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSkill(isSelected ? null : skill);
                      }}
                      className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0d3f31]/90 hover:bg-[#125341] border border-emerald-400/30 hover:border-emerald-300 rounded-xl text-xs font-bold text-emerald-100 hover:text-white transition-all shadow-xs hover:scale-105 cursor-pointer"
                      title="View verified evidence citations"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{skill.name}</span>
                    </button>
                  );
                })}
              </div>

              <SkillEvidenceModal
                skill={selectedSkill}
                isOpen={Boolean(selectedSkill)}
                onClose={() => setSelectedSkill(null)}
                projects={student.projects}
                onMouseEnter={handlePopoverMouseEnter}
                onMouseLeave={handlePopoverMouseLeave}
              />
            </div>

            {/* Projects Section */}
            <div className="flex flex-col gap-2 pt-1 border-t border-emerald-400/15">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
                <FolderGit2 className="w-3 h-3 text-emerald-400" />
                <span>PROJECTS</span>
              </div>

              <div className="flex flex-col gap-2">
                {student.projects.slice(0, 3).map((proj, idx) => (
                  <div
                    key={proj.id || proj.title || `proj-${idx}`}
                    className="bg-[#0a3528]/85 border border-emerald-400/25 hover:border-emerald-300/60 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all hover:bg-[#0e4435]"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-emerald-200/80 line-clamp-1 mt-0.5">
                        {proj.description}
                      </p>
                    </div>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-400/20 transition-all shrink-0 cursor-pointer"
                        title="View GitHub repository"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitHubLogo className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-400/20 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-emerald-400/90">ID:</span>
            <button
              onClick={handleCopyId}
              className="text-emerald-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              title="Click to copy student ID"
            >
              <span>{student.id}</span>
              {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <span>EMPOWERING VERIFIED SKILLS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );

  // Reusable Cryptographic Proof Back Surface
  const renderPassportBack = (isEnlarged = false) => (
    <div className={`w-full h-full bg-linear-to-br from-[#0c382b] via-[#09291f] to-[#041711] text-white rounded-3xl ${isEnlarged ? "p-6 sm:p-9" : "p-5 sm:p-6"} border border-emerald-400/30 shadow-[0_24px_60px_-12px_rgba(4,38,28,0.7),_0_0_0_1px_rgba(52,211,153,0.25)] overflow-hidden flex flex-col justify-between`}>
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-emerald-400/20 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Cryptographic Verification Proof</h3>
            <p className="text-[10px] text-emerald-300/80">SkillSync Trust & Verifiable Credentials Registry</p>
          </div>
        </div>
        <span className="px-3 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-bold shadow-inner">
          STATUS: VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 bg-[#0a3528]/95 p-4 sm:p-5 rounded-2xl border border-emerald-400/30 my-auto relative z-10 shadow-lg">
        <div className="md:col-span-7 space-y-3">
          <div>
            <span className="text-[9px] text-emerald-400/90 uppercase font-bold tracking-wider">Credential Subject</span>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{student.name} ({student.id})</div>
          </div>
          <div>
            <span className="text-[9px] text-emerald-400/90 uppercase font-bold tracking-wider">Academic Institution</span>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{student.college}</div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-emerald-400/90 uppercase font-bold tracking-wider">SHA-256 Merkle Root</span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-emerald-300 break-all bg-[#051c14] p-2 rounded-xl border border-emerald-400/30 font-semibold mt-0.5">
              {student.credentialHash}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-[#051c14] rounded-xl border border-emerald-400/30 gap-1.5 text-center">
          <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-300/80">Scan to verify proof</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-emerald-400/20 text-[10px] text-emerald-300/90 gap-3 relative z-10">
        <span>Fairness Filter: Demographic parameters excluded from ranking models.</span>
      </div>
    </div>
  );

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {showControls && (
        <div className="w-full max-w-2xl flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Skill Passport</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleToggle}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                isPublic
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
                  : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
              }`}
            >
              {isPublic ? (
                <>
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Private</span>
                </>
              )}
            </button>

            {isPublic && (
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-800 hover:bg-neutral-50 border border-black/10 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Share</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isExportingPdf ? "Exporting..." : "PDF"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Compact Passport Card (Click to Enlarge / Focus) */}
      <div 
        className="w-full max-w-2xl relative cursor-pointer select-none"
        onClick={() => setIsFocused(true)}
      >
        {renderPassportFront(false)}
      </div>

      {/* Focused Enlarged Modal View with Smooth Zoom In & Out Animations */}
      <AnimatePresence>
        {isFocused && (
          <motion.div 
            key="passport-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 overflow-y-auto"
            onClick={() => {
              setIsFocused(false);
              setSelectedSkill(null);
            }}
          >
            {/* Zoom In / Out Animated Container */}
            <motion.div
              key="passport-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="w-full max-w-3xl flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Floating Control Bar (Icon-only Flip and Close Buttons Aligned Right) */}
              <div className="w-full flex items-center justify-end gap-2.5 mb-3 px-1">
                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-white/15 hover:border-emerald-500 transition-all shadow-md cursor-pointer hover:scale-110 active:scale-95 group"
                  title={isFlipped ? "Show Front Side" : "Flip to Cryptographic Proof"}
                >
                  <RotateCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    setSelectedSkill(null);
                  }}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-rose-600 text-neutral-300 hover:text-white border border-white/15 hover:border-rose-500 transition-all shadow-md cursor-pointer hover:scale-110 active:scale-95 group"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Enlarged 3D Flippable Card (Click to Return to Compact Mode) */}
              <div 
                style={{ perspective: 1800 }} 
                className="w-full relative cursor-pointer"
                onClick={() => {
                  setIsFocused(false);
                  setSelectedSkill(null);
                }}
              >
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.35, 0, 0.2, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative w-full"
                >
                  {/* Front of Enlarged Card */}
                  <div
                    style={{ 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden" 
                    }}
                    className="w-full"
                  >
                    {renderPassportFront(true)}
                  </div>

                  {/* Back of Enlarged Card (Proof) */}
                  <div
                    style={{ 
                      backfaceVisibility: "hidden", 
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)" 
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {renderPassportBack(true)}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

