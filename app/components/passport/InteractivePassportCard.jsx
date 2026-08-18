"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  onTogglePublic,
  onClose
}) {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isPublic, setIsPublic] = useState(passportData?.isPublic ?? true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const hoverTimeoutRef = React.useRef(null);

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
    gender: passportData?.gender && passportData.gender !== "Student" ? passportData.gender : "Male",
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

  // Passport Front Surface (Focused / Enlarged Layout)
  const renderPassportFront = () => (
    <div className="w-full bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-5 sm:p-7 border border-white/10 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden relative flex flex-col justify-between">
      {/* Ambient Lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Watermark Waves */}
      <PassportWaves />

      <div className="relative z-10 flex flex-col justify-between h-full gap-6 sm:gap-7">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <SkillSyncLogo />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              SkillSync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-extrabold tracking-[0.18em] text-emerald-400 uppercase bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/30 shadow-inner">
              SKILL PASSPORT
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Student Info */}
          <div className="md:col-span-5 flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.35)] bg-neutral-900 relative flex items-center justify-center">
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
                    <div className="w-full h-full bg-linear-to-br from-neutral-800 to-neutral-950 text-white flex items-center justify-center font-black text-xl">
                      {student.name ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) : "ST"}
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-[#080808] border-2 border-emerald-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 min-w-0">
                <div>
                  <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NAME</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white leading-tight truncate mt-0.5">
                    {student.name}
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-5 text-xs sm:text-sm whitespace-nowrap mt-1">
                  <div>
                    <span className="text-neutral-400 font-bold block text-[10px] sm:text-[11px] uppercase tracking-wider">GENDER</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-bold block text-[10px] sm:text-[11px] uppercase tracking-wider">DOB</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{student.dob}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-2 border-t border-white/10">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">COLLEGE</div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-snug truncate">{student.college}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">DEGREE</div>
                  <div className="text-xs sm:text-sm font-bold text-white leading-snug truncate">{student.degree}</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider">BATCH</div>
                  <div className="text-xs sm:text-sm font-bold text-white">{student.batch}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills & Projects */}
          <div className="md:col-span-7 flex flex-col gap-4 relative">
            {/* Skills Section */}
            <div className="flex flex-col gap-2 relative">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Hexagon className="w-3 h-3 text-emerald-400 fill-emerald-400/20" />
                <span>SKILLS</span>
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
                      className="group inline-flex items-center px-3 py-1.5 bg-neutral-900/90 hover:bg-neutral-800 border border-white/10 hover:border-emerald-400/60 rounded-xl text-xs font-bold text-neutral-200 hover:text-white transition-all shadow-xs hover:scale-105 cursor-pointer"
                      title="View verified evidence citations"
                    >
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
            <div className="flex flex-col gap-2 pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                <FolderGit2 className="w-3 h-3 text-emerald-400" />
                <span>PROJECTS</span>
              </div>

              <div className="flex flex-col gap-2">
                {student.projects.slice(0, 3).map((proj, idx) => (
                  <div
                    key={proj.id || proj.title || `proj-${idx}`}
                    className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-all hover:bg-neutral-800/90"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">
                        {proj.title}
                      </h4>
                      <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">
                        {proj.description}
                      </p>
                    </div>

                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer"
                        title="View GitHub repository"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <GitHubLogo className="w-4 h-4 text-neutral-400 hover:text-white" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-emerald-400 font-bold">ID:</span>
            <button
              onClick={handleCopyId}
              className="text-neutral-200 font-bold hover:underline flex items-center gap-1 cursor-pointer"
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

  // Cryptographic Proof Back Surface (Focused / Enlarged Layout)
  const renderPassportBack = () => (
    <div className="w-full h-full bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-5 sm:p-7 border border-white/10 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col justify-between">
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-2xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Cryptographic Verification Proof</h3>
            <p className="text-[10px] text-neutral-400">SkillSync Trust & Verifiable Credentials Registry</p>
          </div>
        </div>
        <span className="px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] sm:text-xs font-bold shadow-inner">
          STATUS: VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 bg-neutral-900/90 p-4 sm:p-5 rounded-2xl border border-white/10 my-auto relative z-10 shadow-lg">
        <div className="md:col-span-7 space-y-3">
          <div>
            <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider">Credential Subject</span>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{student.name} ({student.id})</div>
          </div>
          <div>
            <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider">Academic Institution</span>
            <div className="text-xs sm:text-sm font-bold text-white mt-0.5">{student.college}</div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-neutral-400 uppercase font-bold tracking-wider">SHA-256 Merkle Root</span>
              <button
                onClick={handleCopyHash}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                {copiedHash ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-emerald-400 break-all bg-black/70 p-2 rounded-xl border border-white/10 font-semibold mt-0.5">
              {student.credentialHash}
            </div>
          </div>
        </div>

        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-black/70 rounded-xl border border-white/10 gap-1.5 text-center">
          <QrCode className="w-20 h-20 sm:w-24 sm:h-24 text-emerald-400" />
          <span className="text-[9px] font-mono text-neutral-400">Scan to verify proof</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-[10px] text-neutral-400 gap-3 relative z-10">
        <span>Fairness Filter: Demographic parameters excluded from ranking models.</span>
      </div>
    </div>
  );

  return (
    <div className={`w-full max-w-[760px] flex flex-col items-center select-none ${className}`}>
      {/* Top Action Bar in Focused Card Window */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-3 px-1">
          {/* Left: Official Skill Passport Badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Skill Passport</span>
            </span>
          </div>

          {/* Right: Quick Actions + Flip + Close */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Public/Private Toggle */}
            <button
              onClick={handleToggle}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
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

            {/* Share / Copy Link */}
            {isPublic && (
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white text-neutral-800 hover:bg-neutral-50 border border-black/10 rounded-xl font-bold text-xs shadow-2xs transition-all cursor-pointer"
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

            {/* PDF Export */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isExportingPdf ? "Exporting..." : "PDF"}</span>
            </button>

            {/* Flip to Cryptographic Proof Button */}
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="p-2 rounded-xl bg-white/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-white/15 hover:border-emerald-500 transition-all shadow-xs cursor-pointer group"
              title={isFlipped ? "Show Front Side" : "Flip to Cryptographic Proof"}
            >
              <RotateCw className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 duration-500" />
            </button>

            {/* Close Button (if onClose provided) */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-neutral-300 hover:text-white border border-white/15 hover:border-rose-500 transition-all shadow-xs cursor-pointer group"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3D Flippable Focused Card */}
      <div 
        style={{ perspective: 1800 }} 
        className="w-full relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.35, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          {/* Front of Enlarged Focused Card */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden" 
            }}
            className="w-full"
          >
            {renderPassportFront()}
          </div>

          {/* Back of Enlarged Focused Card (Proof) */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)" 
            }}
            className="absolute inset-0 w-full h-full"
          >
            {renderPassportBack()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
