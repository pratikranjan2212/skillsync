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
  RotateCw, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Lock, 
  Globe,
  Award,
  ExternalLink,
  X
} from "lucide-react";
import { GitHubIcon, PassportWaves } from "@/app/components/icons";

function GitHubLogo({ className = "w-4 h-4 text-emerald-400 hover:text-white" }) {
  return <GitHubIcon className={className} />;
}

function SkillSyncLogo() {
  return (
    <img 
      src="/logo.svg" 
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isPublic, setIsPublic] = useState(passportData?.isPublic ?? true);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

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
    coursework: passportData?.coursework || passportData?.courses || [],
  };

  const hasProjects = Array.isArray(student.projects) && student.projects.length > 0;
  const verifiedCourses = Array.isArray(student.coursework)
    ? student.coursework.filter((c) => c.verified || c.tier === "verified-high" || c.tier === "verified-medium" || c.isVerified || c.verificationTier === "verified-high" || c.verificationTier === "verified-medium")
    : [];
  const hasCoursework = verifiedCourses.length > 0;

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

  // Passport Front Surface (Focused Layout)
  const renderPassportFront = () => (
    <div className="w-full bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden relative flex flex-col justify-between">
      {/* Ambient Lighting */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-1/2 -right-24 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
      
      {/* Watermark Waves */}
      <PassportWaves />

      <div className="relative z-10 flex flex-col justify-between h-full gap-5 sm:gap-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <SkillSyncLogo />
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              SkillSync
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold">
            <span className="text-emerald-400">ID:</span>
            <button
              onClick={handleCopyId}
              className="text-neutral-200 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
              aria-label="Copy student ID"
              title="Copy ID"
            >
              <span>{student.id}</span>
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60 hover:opacity-100 text-emerald-300" />}
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-start my-auto">
          
          {/* Student Info */}
          <div className="md:col-span-5 flex flex-col gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative shrink-0">
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.35)] bg-neutral-900 relative flex items-center justify-center">
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt={student.name}
                      fill
                      unoptimized
                      sizes="80px"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-neutral-800 to-neutral-950 text-white flex items-center justify-center font-black text-xl">
                      {student.name ? student.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2) : "ST"}
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-0.5 -right-0.5 w-5.5 h-5.5 rounded-full bg-[#080808] border-2 border-emerald-400 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              <div className="flex flex-col gap-1 min-w-0">
                <div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NAME</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-white leading-tight truncate mt-0.5">
                    {student.name}
                  </div>
                </div>

                <div className="flex items-center gap-3.5 text-xs whitespace-nowrap mt-0.5">
                  <div>
                    <span className="text-neutral-400 font-bold block text-[9px] sm:text-[10px] uppercase tracking-wider">GENDER</span>
                    <span className="text-white font-bold text-xs">{student.gender}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 font-bold block text-[9px] sm:text-[10px] uppercase tracking-wider">DOB</span>
                    <span className="text-white font-bold text-xs">{student.dob}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2.5 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                  <GraduationCap className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex items-baseline gap-1.5 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">COLLEGE:</span>
                  <span className="font-bold text-white truncate">{student.college}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex items-baseline gap-1.5 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">DEGREE:</span>
                  <span className="font-bold text-white truncate">{student.degree}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6.5 h-6.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-emerald-400">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex items-baseline gap-1.5 text-xs">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider shrink-0">BATCH:</span>
                  <span className="font-bold text-white">{student.batch}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Projects & Verified Coursework */}
          <div className="md:col-span-7 flex flex-col gap-2.5 relative">
            {hasProjects && (
              /* Projects: Render verified projects with embedded skills */
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>PROJECTS</span>
                </div>

                <div className="flex flex-col gap-2">
                  {student.projects.slice(0, hasCoursework ? 1 : 2).map((proj, idx) => {
                    const projSkills = Array.isArray(proj.skills) 
                      ? proj.skills 
                      : (typeof proj.skills === "string" ? proj.skills.split(",").map(s => s.trim()) : []);

                    return (
                      <div
                        key={proj.id || proj.title || `proj-${idx}`}
                        className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-3 flex flex-col gap-2 transition-all hover:bg-neutral-800/90 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {proj.title}
                          </h4>

                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all shrink-0 cursor-pointer"
                              aria-label="View GitHub repository"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GitHubLogo className="w-3.5 h-3.5 text-neutral-400 hover:text-white" />
                            </a>
                          )}
                        </div>

                        {/* Bottom Row: Skills on Left & "Verified" on Bottom Right */}
                        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5">
                          <div className="flex flex-wrap gap-1.5 min-w-0">
                            {projSkills.length > 0 ? (
                              projSkills.map((skName, skIdx) => (
                                <span
                                  key={skIdx}
                                  className="px-2.5 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 shadow-2xs"
                                >
                                  {typeof skName === "object" ? skName.name || skName.title : String(skName).trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-neutral-500 italic">Project</span>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 shrink-0 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-500/25 shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Coursework Section: Hidden by default, shown ONLY when verified coursework exists */}
            {hasCoursework && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>COURSEWORK</span>
                </div>

                <div className="flex flex-col gap-2">
                  {verifiedCourses.slice(0, hasProjects ? 1 : 2).map((course, idx) => {
                    const courseSkills = Array.isArray(course.skills) 
                      ? course.skills 
                      : (typeof course.skills === "string" ? course.skills.split(",").map(s => s.trim()) : []);

                    const certUrl = course.certificateUrl || course.fileUrl || course.link;

                    return (
                      <div
                        key={course.id || course.title || `course-${idx}`}
                        className="bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-2xl p-3 flex flex-col gap-2 transition-all hover:bg-neutral-800/90 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                            {course.title}
                          </h4>

                          {certUrl ? (
                            <a
                              href={certUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded-lg text-neutral-400 hover:text-emerald-400 hover:bg-white/10 transition-all shrink-0 cursor-pointer flex items-center gap-1 text-[10px]"
                              title="View Certificate"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          ) : (
                            <span 
                              className="p-1 rounded-lg text-neutral-400 hover:text-emerald-400 transition-colors shrink-0 cursor-pointer"
                              title="Verified Certificate"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Bottom Row: Skills on Left & "Verified" on Bottom Right */}
                        <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/5">
                          <div className="flex flex-wrap gap-1.5 min-w-0">
                            {courseSkills.length > 0 ? (
                              courseSkills.map((skName, skIdx) => (
                                <span
                                  key={skIdx}
                                  className="px-2.5 py-0.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 shadow-2xs"
                                >
                                  {typeof skName === "object" ? skName.name || skName.title : String(skName).trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-neutral-500 italic">Coursework</span>
                            )}
                          </div>

                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 shrink-0 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-500/25 shadow-2xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Verified</span>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fallback: Render Skills-only if no projects and no verified coursework exist */}
            {!hasProjects && !hasCoursework && (
              <div className="flex flex-col gap-2 relative">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <Hexagon className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
                  <span>SKILLS</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill, idx) => (
                    <div
                      key={skill.skillId || skill.id || skill.name || `skill-${idx}`}
                      className="inline-flex items-center px-3 py-1.5 bg-neutral-900/90 border border-white/10 hover:border-emerald-500/40 rounded-xl text-xs font-bold text-white transition-all shadow-xs"
                    >
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            <span>OFFICIAL SKILL PASSPORT</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );

  // Cryptographic Proof Back Surface (Focused Layout)
  const renderPassportBack = () => (
    <div className="w-full h-full bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col justify-between">
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
                aria-label="Copy hash"
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
    <div className={`w-full max-w-[640px] flex flex-col items-center select-none ${className}`}>
      {/* Top Action Bar in Focused Card Window: Flip + Close */}
      {showControls && (
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-end gap-2.5 mb-3 px-1 relative z-20"
        >
          {/* Flip to Cryptographic Proof Button */}
          <button
            type="button"
            onClick={() => setIsFlipped(!isFlipped)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-white/15 hover:border-emerald-500 transition-all shadow-xs cursor-pointer text-xs font-bold"
            aria-label="Flip to Cryptographic Proof"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>{isFlipped ? "Flip to Passport" : "Flip to Proof"}</span>
          </button>

          {/* Close Button (if onClose provided) */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-rose-600 text-neutral-300 hover:text-white border border-white/15 hover:border-rose-500 transition-all shadow-xs cursor-pointer group"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </motion.div>
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
