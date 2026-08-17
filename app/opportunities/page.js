"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  Search,
  Sparkles,
  Filter,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Award,
  ArrowRight,
  FilePlus2,
  CheckCircle2,
  Plus,
  Globe,
  Home,
  Building2,
  Layers,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import OpportunityCard from "@/app/components/opportunities/OpportunityCard";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

const WORK_MODE_OPTIONS = [
  { id: "all", label: "All Modes", icon: Layers },
  { id: "remote", label: "Remote", icon: Globe },
  { id: "hybrid", label: "Hybrid", icon: Home },
  { id: "onsite", label: "On-site", icon: Building2 },
];

async function fetchOpportunitiesFeed() {
  const res = await fetch("/api/opportunities");
  if (!res.ok) throw new Error("Failed to fetch matched opportunities");
  const data = await res.json();
  return {
    opportunities: data.opportunities || [],
    hasPassport: data.hasPassport ?? (data.opportunities && data.opportunities.length > 0),
    userSkillCount: data.userSkillCount || 0,
  };
}

export default function OpportunityFeedPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState("all");

  const {
    data: feedData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["opportunities-feed"],
    queryFn: fetchOpportunitiesFeed,
    staleTime: 5 * 60 * 1000, // 5 minutes fresh in client cache
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false, // Prevents laggy refetches on tab switching
    enabled: isAuthenticated,
  });

  const opportunities = feedData?.opportunities || [];
  const hasPassport = feedData?.hasPassport ?? false;

  const filteredList = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return opportunities.filter((op) => {
      const matchesKeyword =
        !term ||
        op.title?.toLowerCase().includes(term) ||
        op.company?.toLowerCase().includes(term) ||
        op.location?.toLowerCase().includes(term) ||
        (op.requiredSkills && op.requiredSkills.some((s) => s.toLowerCase().includes(term)));

      const opMode = (op.workMode || "").toLowerCase();
      const opLoc = (op.location || "").toLowerCase();

      let matchesWorkMode = true;
      if (selectedWorkMode === "remote") {
        matchesWorkMode =
          opMode === "remote" ||
          opLoc.includes("remote") ||
          opLoc.includes("worldwide") ||
          opLoc.includes("wfh");
      } else if (selectedWorkMode === "hybrid") {
        matchesWorkMode = opMode === "hybrid" || opLoc.includes("hybrid");
      } else if (selectedWorkMode === "onsite" || selectedWorkMode === "offline") {
        matchesWorkMode =
          opMode === "on-site" ||
          opMode === "onsite" ||
          opMode === "offline" ||
          opLoc.includes("on-site") ||
          opLoc.includes("onsite") ||
          opLoc.includes("in-office") ||
          (!opLoc.includes("remote") && !opLoc.includes("hybrid") && !opLoc.includes("worldwide"));
      }

      return matchesKeyword && matchesWorkMode;
    });
  }, [opportunities, searchTerm, selectedWorkMode]);

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-16">
        <Navbar />
        <main className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 2xl:px-8 w-full pt-4">
          <AuthRequiredView
            badgeText="Skill-Calibrated Opportunities"
            badgeIcon={Briefcase}
            badgeColor="emerald"
            title="Matched Opportunities Access"
            subtitle="Sign in to explore internships and roles calibrated strictly against the skills added to your profile & verified Skill Passport."
            sectionName="Opportunities Feed"
            features={[
              {
                icon: Sparkles,
                title: "Dynamic Profile Skill Calibration",
                desc: "Every opportunity is ranked dynamically against your active technical skills, coursework, and project citations.",
              },
              {
                icon: ShieldCheck,
                title: "Demographic Bias Exclusion",
                desc: "Strictly excludes race, gender, age, and postal code from ranking algorithms to ensure fair evaluation.",
              },
              {
                icon: Building2,
                title: "Flexible Work Modes",
                desc: "Filter seamlessly across Remote, Hybrid, and On-site opportunities with verified compensation.",
              },
            ]}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 2xl:px-8 flex flex-col gap-6 sm:gap-8 pt-4 sm:pt-6">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Skill-Matched Career Feed</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-2">
              Opportunities Calibrated to Your Skills
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1 max-w-2xl">
              Internships and roles curated and ranked in real-time based on the technical skills added in your profile & verified Skill Passport.
            </p>
          </div>

          <div className="bg-[#F5F5F3] p-3.5 sm:p-4 rounded-2xl border border-black/5 flex items-center gap-3 shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111111]">Zero-Bias Ranking</div>
              <div className="text-[10px] sm:text-[11px] text-[#494D4D]">Demographics excluded • 100% skill-based</div>
            </div>
          </div>
        </div>

        {/* When User Has NOT added skills or evidence yet */}
        {!isLoading && !isError && !hasPassport && (
          <div className="bg-white rounded-3xl sm:rounded-4xl p-6 sm:p-14 text-center border border-black/5 shadow-md flex flex-col items-center gap-5 sm:gap-6 w-full">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-inner">
              <Award className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
            </div>

            <div>
              <span className="px-3.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider inline-block mb-3">
                Profile Skills Required
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-[#111111] tracking-tight">
                Add Your Skills to Unlock Matched Opportunities
              </h2>
              <p className="text-xs sm:text-sm text-[#494D4D] mt-2.5 max-w-2xl mx-auto leading-relaxed">
                Opportunity match scores and curated roles are calibrated dynamically against the skills you add to your profile and verified project evidence. Add your skills to start receiving personalized internship matches across Remote, Hybrid, and On-site modes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full text-left my-2 max-w-4xl">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-emerald-600" />
                <span className="text-xs font-bold text-[#111111]">Zero Demographic Bias</span>
                <span className="text-[10px] sm:text-[11px] text-[#666666]">Evaluates only technical skills, project citations, and proof.</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-amber-600" />
                <span className="text-xs font-bold text-[#111111]">Real-Time Skill Matching</span>
                <span className="text-[10px] sm:text-[11px] text-[#666666]">Roles adapt instantly whenever you update your profile skills.</span>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <CheckCircle2 className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-teal-600" />
                <span className="text-xs font-bold text-[#111111]">Accurate Percentage Scores</span>
                <span className="text-[10px] sm:text-[11px] text-[#666666]">See exact skill match percentage and actionable missing skills.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full sm:w-auto">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Add Skills in Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/evidence/new"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-neutral-100 hover:bg-neutral-200 text-[#111111] rounded-full font-bold text-xs sm:text-sm transition-all active:scale-95"
              >
                <FilePlus2 className="w-4.5 h-4.5 text-emerald-600" />
                <span>Upload Evidence</span>
              </Link>
            </div>
          </div>
        )}

        {/* When User HAS added skills */}
        {!isLoading && !isError && hasPassport && (
          <>
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 shadow-sm border border-black/5 flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="relative w-full lg:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search roles, companies, skills, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-between lg:justify-end">
                {/* Work Mode Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#F5F5F3] p-1 rounded-2xl border border-black/5 text-xs font-bold overflow-x-auto max-w-full">
                  <span className="px-2 text-neutral-400 flex items-center gap-1 text-[11px] shrink-0">
                    <Filter className="w-3.5 h-3.5" />
                    <span className="hidden xs:inline">Mode:</span>
                  </span>
                  {WORK_MODE_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isActive = selectedWorkMode === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedWorkMode(opt.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isActive
                            ? "bg-neutral-900 text-white shadow-xs"
                            : "text-[#494D4D] hover:bg-neutral-200"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
                        <span>{opt.label}</span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => refetch()}
                  className="p-2 sm:p-2.5 bg-[#F5F5F3] text-[#494D4D] hover:text-[#111111] rounded-2xl border border-black/5 transition-all shrink-0 cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Refresh opportunities feed"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              </div>
            </div>

            {filteredList.length === 0 && (
              <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 text-center border border-black/5 shadow-sm flex flex-col items-center gap-3">
                <Briefcase className="w-10 h-10 text-neutral-300" />
                <h3 className="text-lg sm:text-xl font-bold text-[#111111]">No Matching Opportunities</h3>
                <p className="text-xs text-[#494D4D]">
                  No opportunities match your current search query or work mode filter. Try selecting &quot;All Modes&quot; or refining your search.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedWorkMode("all");
                  }}
                  className="mt-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {filteredList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredList.map((op) => (
                  <OpportunityCard key={op.id} opportunity={op} />
                ))}
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 h-64 animate-pulse border border-black/5 flex flex-col justify-between">
                <div>
                  <div className="h-4 bg-neutral-200 rounded-full w-1/4 mb-4"></div>
                  <div className="h-6 bg-neutral-200 rounded-full w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-150 rounded-full w-full mb-3"></div>
                  <div className="h-4 bg-neutral-150 rounded-full w-2/3"></div>
                </div>
                <div className="h-8 bg-neutral-100 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 rounded-3xl p-6 sm:p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-base sm:text-lg font-bold text-rose-900">Failed to load opportunity feed</h3>
            <p className="text-xs text-rose-700">{error?.message || "An error occurred while fetching opportunities."}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
