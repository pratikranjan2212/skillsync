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
  Atom,
  Server,
  FileCode2,
  Braces,
  GitBranch
} from "lucide-react";
import SkillEvidenceModal from "./SkillEvidenceModal";

function GitHubLogo({ className = "w-5 h-5 text-neutral-600 hover:text-neutral-900" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function SkillSyncLogo() {
  return (
    <img 
      src="/logo.png" 
      onError={(e) => { e.currentTarget.src = "/logo.svg"; }} 
      alt="SkillSync Logo" 
      className="w-7 h-7 object-contain shrink-0" 
    />
  );
}

function GenderIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M12 13v8" />
      <path d="M9 18h6" />
    </svg>
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

  // Fallback / default data matching the design
  const student = {
    id: passportData?.studentId || "SS-2024-7F8A2B",
    name: passportData?.studentName || "Ananya Sharma",
    gender: passportData?.gender || "Female",
    dob: passportData?.dob || "12 May 2003",
    college: passportData?.college || "Ramaiah Institute of Technology",
    degree: passportData?.degree || "B.Tech in Computer Science & Engineering (Pursuing)",
    batch: passportData?.batch || "2022 – 2026",
    photoUrl: passportData?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    credentialHash: passportData?.credentialHash || "0x7F8A2B9942ACD081884C7D659A2FEAA015A3BF4F",
    shareToken: passportData?.shareToken || "sp-token-9942a",
    verified: passportData?.verified ?? true,
    skills: passportData?.skills || [
      {
        skillId: "sk-react",
        name: "React.js",
        category: "Frontend Web",
        icon: "react",
        level: "Advanced",
        endorsements: 14,
        evidence: [{ title: "EcoTrack Component Architecture", tier: "verified-high" }]
      },
      {
        skillId: "sk-node",
        name: "Node.js",
        category: "Backend Engineering",
        icon: "nodejs",
        level: "Advanced",
        endorsements: 11,
        evidence: [{ title: "ShopNest REST & Microservices", tier: "verified-high" }]
      },
      {
        skillId: "sk-python",
        name: "Python",
        category: "Programming Languages",
        icon: "python",
        level: "Advanced",
        endorsements: 19,
        evidence: [{ title: "ETL Data Pipeline & Pandas", tier: "verified-high" }]
      },
      {
        skillId: "sk-js",
        name: "JavaScript",
        category: "Frontend & Scripting",
        icon: "javascript",
        level: "Expert",
        endorsements: 22,
        evidence: [{ title: "Full-Stack Web Dev Capstone (96%)", tier: "verified-high" }]
      },
      {
        skillId: "sk-git",
        name: "Git & GitHub",
        category: "DevOps & Tooling",
        icon: "git",
        level: "Advanced",
        endorsements: 16,
        evidence: [{ title: "Verified 200+ Open Source Commits", tier: "verified-high" }]
      }
    ],
    projects: passportData?.projects || [
      {
        id: "proj-1",
        title: "EcoTrack – Carbon Footprint Tracker",
        description: "A web application to track and analyze carbon footprint using interactive dashboards and ML insights.",
        githubUrl: "https://github.com/ananya-sharma/ecotrack",
        skills: ["React.js", "Python"]
      },
      {
        id: "proj-2",
        title: "ShopNest – E-commerce Web App",
        description: "Full-stack e-commerce platform with authentication, payment integration, and order management.",
        githubUrl: "https://github.com/ananya-sharma/shopnest",
        skills: ["React.js", "Node.js", "JavaScript"]
      },
      {
        id: "proj-3",
        title: "NexusChat – Real-time Chat Application",
        description: "Real-time chat application using Socket.io, Express.js, and MongoDB.",
        githubUrl: "https://github.com/ananya-sharma/nexuschat",
        skills: ["Node.js", "JavaScript", "Git & GitHub"]
      }
    ]
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

  const getSkillIcon = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("react")) {
      return (
        <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-500 shadow-2xs">
          <Atom className="w-5 h-5" />
        </div>
      );
    }
    if (n.includes("node")) {
      return (
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs">
          <Server className="w-5 h-5" />
        </div>
      );
    }
    if (n.includes("python")) {
      return (
        <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-2xs">
          <FileCode2 className="w-5 h-5" />
        </div>
      );
    }
    if (n.includes("javascript") || n.includes("js")) {
      return (
        <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-500 shadow-2xs">
          <Braces className="w-5 h-5" />
        </div>
      );
    }
    if (n.includes("git")) {
      return (
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500 shadow-2xs">
          <GitBranch className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shadow-2xs">
        <Sparkles className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Top Integrated Action Bar */}
      {showControls && (
        <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-4 px-2">
          {/* Badge indicator with hover hint */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Skill Passport</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-xs text-neutral-500">
              <RotateCw className="w-3 h-3 text-emerald-600 animate-spin-slow" />
              Click card to flip • Click again to return
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Public/Private */}
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

            {/* Copy Link */}
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

            {/* Export PDF */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isExportingPdf ? "Exporting..." : "PDF"}</span>
            </button>

            {/* Flip / Proof Button */}
            <button
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-neutral-700 border border-black/10 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-all cursor-pointer shadow-2xs"
            >
              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isFlipped ? "Show Front" : "Verify Proof"}</span>
            </button>
          </div>
        </div>
      )}

      {/* 3D Flip Card Container: Flips on Click */}
      <div 
        style={{ perspective: 1600 }} 
        className="w-full relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.35, 0, 0.2, 1] }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full"
        >
          {/* ========================================================================= */}
          {/* ========================= FRONT SIDE OF CARD =========================== */}
          {/* ========================================================================= */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden" 
            }}
            className="w-full bg-white text-neutral-900 rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 lg:p-10 border border-neutral-200/90 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.07),_0_0_0_1px_rgba(16,185,129,0.08)] overflow-hidden relative"
          >
            {/* Subtle Ambient Radial Glows in Light Palette */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/40 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute top-1/2 -right-32 w-96 h-96 bg-teal-100/30 rounded-full blur-[90px] pointer-events-none" />
            
            {/* Subtle Cyberpunk Laser Mesh Wave Background (bottom left) */}
            <svg 
              className="absolute bottom-0 left-0 w-[55%] h-[40%] opacity-25 pointer-events-none" 
              viewBox="0 0 500 200" 
              fill="none"
            >
              <path d="M0,180 C150,120 280,200 450,130 C490,110 520,70 600,60" stroke="#10B981" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M0,160 C140,100 270,180 430,110 C480,90 510,50 600,40" stroke="#10B981" strokeWidth="1" />
              <path d="M0,140 C130,80 260,160 410,90 C460,70 500,30 600,20" stroke="#10B981" strokeWidth="0.75" />
              <path d="M0,120 C120,60 250,140 390,70 C440,50 490,10 600,0" stroke="#10B981" strokeWidth="0.5" strokeDasharray="2 4" />
            </svg>

            <div className="relative z-10 flex flex-col justify-between h-full gap-8">
              {/* TOP HEADER */}
              <div className="flex items-center justify-between gap-4 border-b border-black/5 pb-4">
                {/* Left: SkillSync Brand Logo */}
                <div className="flex items-center gap-2.5">
                  <SkillSyncLogo />
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-[#111111]">
                    SkillSync
                  </span>
                </div>

                {/* Right: "SKILL PASSPORT" Badge */}
                <div>
                  <span className="text-xs sm:text-sm font-extrabold tracking-[0.2em] text-emerald-700 uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                    SKILL PASSPORT
                  </span>
                </div>
              </div>

              {/* MAIN CONTENT 2-COLUMN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* ================= LEFT COLUMN: STUDENT PROFILE & ACADEMICS (5 Cols) ================= */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  {/* Top sub-section: Photo + Name/Gender/DOB */}
                  <div className="flex items-center gap-5 sm:gap-6">
                    {/* Avatar with glowing ring and verified shield */}
                    <div className="relative shrink-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-neutral-100 relative">
                        <Image
                          src={student.photoUrl}
                          alt={student.name}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 112px, 112px"
                          className="object-cover"
                          priority
                        />
                      </div>
                      
                      {/* Shield checkmark badge */}
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center shadow-md">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                    </div>

                    {/* Name, Gender, DOB */}
                    <div className="flex flex-col gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                          <User className="w-3.5 h-3.5 text-emerald-600" />
                          <span>NAME</span>
                        </div>
                        <div className="text-lg sm:text-xl font-black text-[#111111] leading-tight mt-0.5">
                          {student.name}
                        </div>
                      </div>

                      <div className="flex items-center gap-6 flex-nowrap whitespace-nowrap">
                        <div className="shrink-0">
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                            <GenderIcon />
                            <span>GENDER</span>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-0.5 whitespace-nowrap">
                            {student.gender}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>DOB</span>
                          </div>
                          <div className="text-xs sm:text-sm font-semibold text-neutral-800 mt-0.5 whitespace-nowrap">
                            {student.dob}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details List */}
                  <div className="flex flex-col gap-3.5 pt-2">
                    {/* College */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 shadow-2xs">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          COLLEGE
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[#111111] leading-snug">
                          {student.college}
                        </div>
                      </div>
                    </div>

                    {/* Degree */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 shadow-2xs">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          DEGREE
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[#111111] leading-snug">
                          {student.degree}
                        </div>
                      </div>
                    </div>

                    {/* Batch */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-emerald-700 shadow-2xs">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          BATCH
                        </div>
                        <div className="text-xs sm:text-sm font-bold text-[#111111]">
                          {student.batch}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ================= RIGHT COLUMN: SKILLS & PROJECTS (7 Cols) ================= */}
                <div className="lg:col-span-7 flex flex-col gap-6 relative">
                  {/* 1. SKILLS SECTION */}
                  <div className="flex flex-col gap-3 relative">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                      <Hexagon className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/10" />
                      <span>SKILLS</span>
                    </div>

                    {/* Skills Grid with Lucide React Icons & Full Name Visibility */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
                      {student.skills.map((skill) => (
                        <div
                          key={skill.skillId}
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
                            setSelectedSkill(selectedSkill?.skillId === skill.skillId ? null : skill);
                          }}
                          className="group relative bg-[#F8FAF9] border border-neutral-200/90 hover:border-emerald-500/60 hover:bg-emerald-50/40 rounded-2xl p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all duration-200 hover:scale-105 shadow-2xs hover:shadow-md min-h-[84px]"
                          title="Hover to view verified evidence citations"
                        >
                          <div className="h-8 flex items-center justify-center">
                            {getSkillIcon(skill.name)}
                          </div>
                          <span className="text-[11px] sm:text-xs font-bold text-neutral-800 group-hover:text-black text-center leading-tight whitespace-normal break-normal px-0.5">
                            {skill.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Contextual Floating Skill Popover (Positioned Near the Hovered Skills on the Right) */}
                    <SkillEvidenceModal
                      skill={selectedSkill}
                      isOpen={Boolean(selectedSkill)}
                      onClose={() => setSelectedSkill(null)}
                      projects={student.projects}
                      onMouseEnter={handlePopoverMouseEnter}
                      onMouseLeave={handlePopoverMouseLeave}
                    />
                  </div>

                  {/* 2. PROJECTS SECTION (Clean - without redundant left icons) */}
                  <div className="flex flex-col gap-3 pt-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#111111]">
                      <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>PROJECTS</span>
                    </div>

                    {/* Project Cards Stack */}
                    <div className="flex flex-col gap-2.5">
                      {student.projects.map((proj) => (
                        <div
                          key={proj.id}
                          className="bg-[#F8FAF9] border border-neutral-200/90 hover:border-emerald-500/50 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-all hover:bg-white hover:shadow-md shadow-2xs"
                        >
                          {/* Project Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-[#111111] truncate">
                              {proj.title}
                            </h4>
                            <p className="text-[11px] text-[#494D4D] line-clamp-1 mt-0.5 leading-snug">
                              {proj.description}
                            </p>
                          </div>

                          {/* GitHub Icon Link */}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-all shrink-0 cursor-pointer"
                              title="View GitHub repository"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GitHubLogo className="w-5 h-5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTTOM FOOTER */}
              <div className="flex items-center justify-between pt-4 border-t border-black/5 text-xs">
                {/* ID */}
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-neutral-500">ID:</span>
                  <button
                    onClick={handleCopyId}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    title="Click to copy student ID"
                  >
                    <span>{student.id}</span>
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 opacity-60" />}
                  </button>
                </div>

                {/* Tagline & Shield */}
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-600">
                  <span>EMPOWERING VERIFIED SKILLS</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ========================== BACK SIDE OF CARD ============================ */}
          {/* ========================================================================= */}
          <div
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)" 
            }}
            className="absolute inset-0 w-full h-full bg-white text-neutral-900 rounded-[28px] sm:rounded-[36px] p-6 sm:p-9 lg:p-10 border border-neutral-200/90 shadow-[0_15px_45px_-10px_rgba(0,0,0,0.07),_0_0_0_1px_rgba(16,185,129,0.08)] overflow-hidden flex flex-col justify-between"
          >
            {/* Ambient Lighting */}
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-100/40 rounded-full blur-[90px] pointer-events-none" />
            
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-black/5 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#111111]">Cryptographic Verification Proof</h3>
                  <p className="text-[11px] text-neutral-500">SkillSync Trust & Verifiable Credentials Registry</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
                STATUS: VERIFIED
              </span>
            </div>

            {/* Center Content Box: Student Details & QR Code */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#F8FAF9] p-6 sm:p-7 rounded-2xl border border-neutral-200/80 my-auto relative z-10 shadow-2xs">
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                    Credential Subject
                  </span>
                  <div className="text-sm sm:text-base font-bold text-[#111111] mt-0.5">
                    {student.name} ({student.id})
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                    Academic Institution
                  </span>
                  <div className="text-sm font-bold text-[#111111] mt-0.5">
                    {student.college}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                      SHA-256 Merkle Root
                    </span>
                    <button
                      onClick={handleCopyHash}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedHash ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHash ? "Copied" : "Copy Hash"}</span>
                    </button>
                  </div>
                  <div className="text-xs font-mono text-emerald-800 break-all bg-white p-2.5 rounded-xl border border-neutral-200/90 font-semibold mt-1 shadow-2xs">
                    {student.credentialHash}
                  </div>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-white rounded-xl border border-neutral-200/90 gap-2.5 text-center shadow-2xs">
                <QrCode className="w-24 h-24 sm:w-28 sm:h-28 text-emerald-700" />
                <span className="text-[11px] font-mono text-neutral-500">
                  Scan to verify against institutional registry
                </span>
              </div>
            </div>

            {/* Bottom Footer on Back Side */}
            <div className="flex items-center justify-between pt-4 border-t border-black/5 text-xs text-neutral-500 gap-3 relative z-10">
              <span>Fairness Filter: Demographic parameters excluded from recruiter ranking algorithms.</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
