"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import OpportunityCard from "@/app/components/opportunities/OpportunityCard";
import {
  Search,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Globe,
  Home,
  Building2,
  AlertCircle,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { getOpportunityWorkMode, deduplicateOpportunities } from "@/lib/opportunities/workModeUtils";

const WORK_MODE_TABS = [
  { id: "all", label: "All Modes", icon: Layers },
  { id: "remote", label: "Remote", icon: Globe },
  { id: "hybrid", label: "Hybrid", icon: Home },
  { id: "onsite", label: "On-site", icon: Building2 },
];

async function fetchOpportunitiesFeed() {
  const res = await fetch("/api/opportunities");
  if (!res.ok) throw new Error("Failed to fetch opportunities feed");
  const data = await res.json();
  return {
    opportunities: data.opportunities || [],
    hasPassport: data.hasPassport ?? (data.opportunities && data.opportunities.length > 0),
    userSkillCount: data.userSkillCount || 0,
    isGuest: data.isGuest ?? false,
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
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const opportunities = feedData?.opportunities || [];
  const hasPassport = feedData?.hasPassport ?? false;

  const filteredList = useMemo(() => {
    if (!Array.isArray(opportunities)) return [];
    const term = searchTerm.toLowerCase().trim();
    const result = [];

    for (const op of opportunities) {
      if (!op) continue;

      const matchesKeyword =
        !term ||
        op.title?.toLowerCase().includes(term) ||
        op.company?.toLowerCase().includes(term) ||
        op.location?.toLowerCase().includes(term) ||
        (op.requiredSkills && op.requiredSkills.some((s) => s.toLowerCase().includes(term)));

      // Strict, exclusive work mode classification matching OpportunityCard
      const standardMode = getOpportunityWorkMode(op);

      let matchesWorkMode = true;
      if (selectedWorkMode === "remote") {
        matchesWorkMode = standardMode === "Remote";
      } else if (selectedWorkMode === "hybrid") {
        matchesWorkMode = standardMode === "Hybrid";
      } else if (selectedWorkMode === "onsite") {
        matchesWorkMode = standardMode === "On-site";
      }

      if (matchesKeyword && matchesWorkMode) {
        result.push(op);
      }
    }

    return deduplicateOpportunities(result);
  }, [opportunities, searchTerm, selectedWorkMode]);

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-16">
      <Navbar />

      <main className="max-w-7xl 2xl:max-w-384 mx-auto px-3.5 sm:px-6 2xl:px-8 w-full pt-4">
        {/* Guest / Non-Authenticated Callout Banner */}
        {!authLoading && !isAuthenticated && (
          <div className="bg-linear-to-r from-neutral-900 to-neutral-800 text-white rounded-3xl p-5 sm:p-6 mb-6 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-white">
                    Explore Verified Opportunities
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live Feed
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 leading-relaxed max-w-2xl">
                  Sign in with your student account to calculate your personalized AI Match Score and calibrate against your verified Skill Passport.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
              <Link
                href="/signin"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold border border-white/10 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        )}

        {/* Search & Filter Header Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-neutral-200/80 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search roles, companies, skills, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white text-sm text-neutral-800 placeholder-neutral-400 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 hidden sm:inline-block mr-1" />
            {WORK_MODE_TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedWorkMode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedWorkMode(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${isActive
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-600 border border-neutral-200/60"
                    }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200/60 transition-colors ml-auto lg:ml-2 disabled:opacity-50 cursor-pointer"
              title="Refresh feed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-neutral-200/80 shadow-sm animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-6 w-20 bg-neutral-200 rounded-xl" />
                  <div className="h-6 w-28 bg-neutral-200 rounded-full" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 w-3/4 bg-neutral-200 rounded-md" />
                  <div className="h-4 w-1/2 bg-neutral-100 rounded-md" />
                </div>
                <div className="h-12 bg-neutral-100 rounded-md" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-neutral-200 rounded-xl" />
                  <div className="h-6 w-16 bg-neutral-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-lg mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-red-800">Unable to load opportunities</h3>
            <p className="text-xs text-red-600 mt-1 mb-4">
              {error?.message || "There was an unexpected connection error while querying opportunities."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State for Signed In Users with 0 Skills and 0 Feed Results */}
        {!isLoading && !isError && isAuthenticated && !hasPassport && opportunities.length === 0 && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200 shadow-sm text-center max-w-xl mx-auto my-6">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-[#111111] mb-2">Build Your Skill Passport to Unlock Calibrated Feed</h2>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              SkillSync matches opportunities dynamically based on your verified technical evidence and claimed skills.
              Add your technical skills or evidence to get personalized, bias-free matched listings.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/profile"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                <span>Add Skills in Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/dashboard/evidence/new"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-semibold transition-all"
              >
                <span>Submit Evidence</span>
              </Link>
            </div>
          </div>
        )}

        {/* Opportunities Grid */}
        {!isLoading && !isError && filteredList.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((opportunity, idx) => (
              <OpportunityCard
                key={opportunity.id ? `${opportunity.id}-${idx}` : `opp-${idx}`}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}

        {/* No Results Filter State */}
        {!isLoading && !isError && opportunities.length > 0 && filteredList.length === 0 && (
          <div className="bg-white rounded-3xl p-10 border border-neutral-200 shadow-sm text-center max-w-md mx-auto my-8">
            <Search className="w-8 h-8 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-neutral-800">No opportunities match your filter</h3>
            <p className="text-xs text-neutral-500 mt-1 mb-4">
              Try adjusting your search keywords or switching to &ldquo;All Modes&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedWorkMode("all");
              }}
              className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
