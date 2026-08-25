"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck,
  Award,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  FilePlus2,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import EvidenceCard from "@/app/components/evidence/EvidenceCard";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

async function fetchEvidence() {
  const res = await fetch("/api/evidence");
  if (!res.ok) throw new Error("Failed to fetch evidence");
  const data = await res.json();
  return data.evidence || [];
}

async function fetchPassport() {
  const res = await fetch("/api/passport");
  if (!res.ok) throw new Error("Failed to fetch passport");
  const data = await res.json();
  return data.passport;
}

export default function UnifiedDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const { data: evidenceList = [], isLoading: loadingEv, refetch: refetchEv } = useQuery({
    queryKey: ["dash-evidence"],
    queryFn: fetchEvidence,
    enabled: isAuthenticated,
    refetchOnMount: "always",
  });

  const { data: passport, isLoading: loadingPass, refetch: refetchPass } = useQuery({
    queryKey: ["dash-passport"],
    queryFn: fetchPassport,
    enabled: isAuthenticated,
    refetchOnMount: "always",
  });

  const highCount = evidenceList.filter((e) => e.verificationTier === "verified-high").length;
  const medCount = evidenceList.filter((e) => e.verificationTier === "verified-medium").length;
  const lowCount = evidenceList.filter((e) => e.verificationTier === "flagged-low").length;

  const isDashboardLoading = authLoading || (isAuthenticated && (loadingEv || loadingPass));

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen pb-12 bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-7xl 2xl:max-w-384 mx-auto px-4 sm:px-6 2xl:px-8 w-full">
          <AuthRequiredView
            badgeText="SkillSync Student Dashboard"
            badgeIcon={LayoutDashboard}
            badgeColor="emerald"
            title="SkillSync Dashboard Access"
            subtitle="Sign in to manage your evidence records, view your Skill Passport, and monitor matching opportunities."
            sectionName="Dashboard"
            features={[
              {
                icon: FileCheck,
                title: "Evidence Ingestion & Validation",
                desc: "Upload coursework transcripts and GitHub projects with multi-tier automated validation and confidence scores.",
              },
              {
                icon: Award,
                title: "Skill Passport Management",
                desc: "Group verified skills into taxonomy domains, generate official PDF transcripts, and toggle public share links.",
              },
              {
                icon: ShieldCheck,
                title: "Fairness Guaranteed Matching",
                desc: "AI matching strictly evaluates verified competencies while excluding demographic variables.",
              },
            ]}
          />
        </main>
      </div>
    );
  }

  if (isDashboardLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
        <Navbar />

        <main className="max-w-7xl 2xl:max-w-384 mx-auto px-3.5 sm:px-6 2xl:px-8 flex flex-col gap-6 sm:gap-8 animate-pulse">
          {/* Header Card Skeleton */}
          <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-6 w-44 bg-neutral-200 rounded-full" />
                <div className="h-4 w-24 bg-neutral-200 rounded-md" />
              </div>
              <div className="h-8 sm:h-9 w-64 sm:w-80 bg-neutral-200 rounded-xl" />
              <div className="h-4 w-72 sm:w-96 bg-neutral-200 rounded-md" />
            </div>

            <div className="h-12 bg-neutral-200 rounded-2xl w-full md:w-44 shrink-0" />
          </div>

          {/* Metric Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-black/5 flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-3 w-28 bg-neutral-200 rounded-md" />
                  <div className="h-7 w-20 bg-neutral-200 rounded-lg" />
                </div>
                <div className="w-10 h-10 rounded-2xl bg-neutral-200 shrink-0" />
              </div>
            ))}
          </div>

          {/* Evidence Grid Skeleton */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div className="h-6 w-56 bg-neutral-200 rounded-md" />
              <div className="h-8 w-24 bg-neutral-200 rounded-xl" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-black/5 shadow-xs flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    <div className="h-6 w-28 bg-neutral-200 rounded-xl" />
                    <div className="h-6 w-20 bg-neutral-200 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-neutral-200 rounded-md" />
                    <div className="h-4 w-full bg-neutral-100 rounded-md" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-neutral-200 rounded-lg" />
                    <div className="h-6 w-16 bg-neutral-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-7xl 2xl:max-w-384 mx-auto px-3.5 sm:px-6 2xl:px-8 flex flex-col gap-6 sm:gap-8">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                Student Verification Console
              </span>
              <span className="text-xs text-[#494D4D] font-mono">ID: {passport?.studentId || "Student"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-2">
              Evidence & Skills Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1 max-w-2xl">
              Upload coursework transcripts and GitHub projects to build your automated verifiable Skill Passport.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/evidence/new"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl font-bold text-xs shadow-md transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform" />
              <span>Add Evidence Record</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#494D4D]">Verified High Tier</div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 mt-1">{highCount} Items</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#494D4D]">Verified Medium Tier</div>
                <div className="text-xl sm:text-2xl font-extrabold text-amber-700 mt-1">{medCount} Items</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xs border border-black/5 flex items-center justify-between">
              <div>
                <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#494D4D]">Flagged Low Tier</div>
                <div className="text-xl sm:text-2xl font-extrabold text-rose-700 mt-1">{lowCount} Items</div>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs border border-rose-200">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#111111]">
              Coursework & Evidence Items ({evidenceList.length})
            </h2>
            <button
              onClick={() => {
                refetchEv();
                refetchPass();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-xs font-bold text-[#494D4D] hover:text-[#111111] rounded-xl border border-black/5 transition-all shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh</span>
            </button>
          </div>

          {evidenceList.length === 0 ? (
            <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 text-center border border-black/5 shadow-sm flex flex-col items-center gap-4">
              <FilePlus2 className="w-10 h-10 text-neutral-300" />
              <h3 className="text-lg sm:text-xl font-bold text-[#111111]">No Evidence Uploaded Yet</h3>
              <p className="text-xs text-[#494D4D] max-w-md">
                Upload your course certificates, transcripts, or link your GitHub repositories to earn verified skill credentials.
              </p>
              <Link
                href="/dashboard/evidence/new"
                className="px-5 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-xs shadow-md hover:bg-neutral-800 transition-colors"
              >
                Add Evidence Record
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
              {evidenceList.map((item) => (
                <EvidenceCard key={item.id} evidence={item} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
