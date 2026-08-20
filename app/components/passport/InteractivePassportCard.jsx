"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "qrcode";
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
  RotateCw, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Lock, 
  Globe,
  Award,
  ExternalLink,
  X,
  Maximize2
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
  const [qrSvg, setQrSvg] = useState("");
  const [isQrExpanded, setIsQrExpanded] = useState(false);

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

  // Generate Unique White QR Code whenever student credentials change
  useEffect(() => {
    let isMounted = true;
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://skillsync.app";
    const verificationUrl = `${origin}/passport/${student.shareToken || student.id}`;

    QRCode.toString(verificationUrl, {
      type: "svg",
      margin: 1,
      color: {
        dark: "#FFFFFF",
        light: "#00000000",
      },
      errorCorrectionLevel: "M",
    })
      .then((svg) => {
        if (isMounted) setQrSvg(svg);
      })
      .catch((err) => {
        console.error("Failed to generate QR code SVG:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [student.shareToken, student.id, student.credentialHash]);

  // Keyboard accessibility: Escape key dismisses QR pop-up lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isQrExpanded && e.key === "Escape") {
        e.preventDefault();
        setIsQrExpanded(false);
      }
    };
    if (isQrExpanded) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQrExpanded]);

  // Robust cross-browser clipboard copy with fallback
  const copyToClipboard = async (text) => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (err) {
      console.warn("navigator.clipboard failed, attempting fallback:", err);
    }

    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.setAttribute("readonly", "");
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      textArea.remove();
      return successful;
    } catch (err) {
      console.error("Fallback clipboard copy failed:", err);
      return false;
    }
  };

  const handleCopyId = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const ok = await copyToClipboard(student.id);
    if (ok) {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleCopyHash = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const ok = await copyToClipboard(student.credentialHash);
    if (ok) {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  const handleCopyLink = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "https://skillsync.app";
    const url = `${origin}/passport/${student.shareToken || student.id}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
      const res = await fetch(`/api/passport/pdf?studentId=${encodeURIComponent(student.id)}&shareToken=${encodeURIComponent(student.shareToken || "")}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SkillSync_Passport_${student.id}.pdf`;
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
                      referrerPolicy="no-referrer"
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
    <div className="w-full h-full bg-linear-to-br from-[#121212] via-[#080808] to-[#000000] text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-[0_28px_64px_-12px_rgba(0,0,0,0.95),_0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden flex flex-col justify-between relative">
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
                type="button"
                onClick={handleCopyHash}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95 px-1.5 py-0.5 rounded-md hover:bg-emerald-500/10"
                aria-label="Copy cryptographic hash"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedHash ? "Copied!" : "Copy Hash"}</span>
              </button>
            </div>
            <div className="text-[10px] sm:text-xs font-mono text-emerald-400 break-all bg-black/70 p-2 rounded-xl border border-white/10 font-semibold mt-0.5 select-all">
              {student.credentialHash}
            </div>
          </div>
        </div>

        {/* Unique White QR Code Box with Appealing Borders & Click-to-Popup */}
        <div 
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsQrExpanded(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.stopPropagation();
              e.preventDefault();
              setIsQrExpanded(true);
            }
          }}
          className="md:col-span-5 flex flex-col items-center justify-center p-3 sm:p-3.5 bg-gradient-to-b from-[#141414] via-[#0c0c0c] to-[#040404] rounded-2xl border border-emerald-500/25 hover:border-emerald-400/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),_0_8px_20px_-4px_rgba(0,0,0,0.7)] hover:shadow-[0_0_25px_rgba(52,211,153,0.25)] transition-all duration-300 gap-1.5 text-center group cursor-pointer relative overflow-hidden"
          title="Click to expand QR Code"
          aria-label="Click to enlarge verification QR code"
        >
          {/* Ambient glowing backdrop on hover */}
          <div className="absolute inset-0 bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors pointer-events-none" />

          {/* Sleek Corner Accent Borders */}
          <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400/60 group-hover:border-emerald-400 rounded-tl-xs pointer-events-none transition-colors" />
          <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400/60 group-hover:border-emerald-400 rounded-tr-xs pointer-events-none transition-colors" />
          <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400/60 group-hover:border-emerald-400 rounded-bl-xs pointer-events-none transition-colors" />
          <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400/60 group-hover:border-emerald-400 rounded-br-xs pointer-events-none transition-colors" />

          {/* White QR Code SVG */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
            {qrSvg ? (
              <div 
                className="w-full h-full text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-[0_0_8px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover:scale-105"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 animate-pulse">
                <QrCode className="w-16 h-16 text-neutral-500" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-[9px] font-mono font-bold text-neutral-400 group-hover:text-emerald-300 transition-colors z-10">
            <Maximize2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Scan / Tap to zoom</span>
          </div>
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
              WebkitBackfaceVisibility: "hidden",
              pointerEvents: isFlipped ? "none" : "auto",
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
              transform: "rotateY(180deg)",
              pointerEvents: isFlipped ? "auto" : "none",
            }}
            className="absolute inset-0 w-full h-full"
          >
            {renderPassportBack()}
          </div>
        </motion.div>
      </div>

      {/* Interactive QR Code Pop-up Lightbox Modal */}
      <AnimatePresence>
        {isQrExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => {
              e.stopPropagation();
              setIsQrExpanded(false);
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer select-none"
            role="dialog"
            aria-modal="true"
            aria-label="Verifiable QR Code Lightbox"
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.82, opacity: 0, y: 24 }}
              transition={{ type: "spring", stiffness: 360, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-sm sm:max-w-md w-full bg-gradient-to-b from-[#181818] via-[#101010] to-[#080808] border border-emerald-500/40 rounded-3xl p-6 sm:p-7 shadow-[0_0_60px_rgba(16,185,129,0.25),_0_24px_48px_rgba(0,0,0,0.9)] flex flex-col items-center gap-5 cursor-default text-white"
            >
              {/* Ambient Radial Lighting */}
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsQrExpanded(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-rose-500/20 text-neutral-400 hover:text-white border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
                aria-label="Close QR Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex flex-col items-center text-center gap-1 pt-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-inner">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verifiable Credential QR</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                  {student.name}
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  {student.id} • {student.college}
                </p>
              </div>

              {/* High-res Crisp White QR Code */}
              <div className="relative p-4 sm:p-5 bg-black/90 rounded-2xl border-2 border-emerald-500/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),_0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center">
                {/* Glowing Corner Accents */}
                <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400 rounded-tl-xs pointer-events-none" />
                <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400 rounded-tr-xs pointer-events-none" />
                <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 rounded-bl-xs pointer-events-none" />
                <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400 rounded-br-xs pointer-events-none" />

                <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                  {qrSvg ? (
                    <div 
                      className="w-full h-full text-white [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />
                  ) : (
                    <QrCode className="w-32 h-32 text-white animate-pulse" />
                  )}
                </div>
              </div>

              {/* Merkle Hash & Verification Link Actions */}
              <div className="w-full space-y-2.5">
                <div className="bg-neutral-900/90 rounded-xl p-2.5 border border-white/10 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                    <span>SHA-256 Merkle Root</span>
                    <button
                      type="button"
                      onClick={handleCopyHash}
                      className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {copiedHash ? <Check className="w-2.5 h-2.5" /> : <Copy className="w-2.5 h-2.5" />}
                      <span>{copiedHash ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400 break-all bg-black/60 p-1.5 rounded-lg border border-white/5 font-semibold select-all">
                    {student.credentialHash}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-white border border-emerald-500/30 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Verification URL"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsQrExpanded(false)}
                    className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/10 font-bold text-xs transition-all cursor-pointer active:scale-[0.98]"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* Click anywhere dismiss hint */}
              <div 
                onClick={() => setIsQrExpanded(false)}
                className="text-center text-[10px] text-neutral-400 hover:text-neutral-200 font-medium cursor-pointer transition-colors pt-0.5"
              >
                Click anywhere on screen to close
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
