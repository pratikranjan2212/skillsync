"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Search, Sparkles, Filter, RefreshCw, AlertCircle, ShieldCheck, Layers, Award, ArrowRight, FilePlus2, CheckCircle2 } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import OpportunityCard from "@/app/components/opportunities/OpportunityCard";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

async function fetchOpportunitiesFeed() {
  const res = await fetch("/api/opportunities");
  if (!res.ok) throw new Error("Failed to fetch ingested opportunities");
  const data = await res.json();
  return {
    opportunities: data.opportunities || [],
    hasPassport: data.hasPassport ?? (data.opportunities && data.opportunities.length > 0),
  };
}

export default function OpportunityFeedPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");

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
    staleTime: 60000,
    enabled: isAuthenticated,
  });

  const opportunities = feedData?.opportunities || [];
  const hasPassport = feedData?.hasPassport ?? false;

  const filteredList = opportunities.filter((op) => {
    const matchesKeyword =
      op.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (op.requiredSkills && op.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesSource = selectedSource === "all" || (op.sourceApi && op.sourceApi.toLowerCase() === selectedSource.toLowerCase());

    return matchesKeyword && matchesSource;
  });

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-16">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full pt-4">
          <AuthRequiredView
            badgeText="Automated Ingestion Job Feed"
            badgeIcon={Briefcase}
            badgeColor="emerald"
            title="Matched Opportunities Access"
            subtitle="Sign in to explore AI-ranked internship and job opportunities calibrated strictly against your verified Skill Passport."
            sectionName="Opportunities Feed"
            features={[
              {
                icon: Sparkles,
                title: "Explainable AI Match Scoring",
                desc: "Percentage match rankings calculated transparently using your verified coursework, projects, and credential citations.",
              },
              {
                icon: ShieldCheck,
                title: "Demographic Bias Exclusion",
                desc: "Strictly excludes race, gender, age, and postal code from ranking algorithms to ensure fair evaluation.",
              },
              {
                icon: Layers,
                title: "Multi-Source Job Ingestion",
                desc: "Real-time automated listings continuously ingested from leading career sources like Adzuna, Jooble, and Remotive.",
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8 pt-4 sm:pt-6">
        <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Automated Ingestion Job Feed</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-2">
              Ingested Internship Match Rankings
            </h1>
            <p className="text-sm text-[#494D4D] mt-1 max-w-2xl">
              Public listings ingested automatically from Adzuna, Jooble, and Remotive — ranked strictly against your verified Skill Passport.
            </p>
          </div>

          <div className="bg-[#F5F5F3] p-4 rounded-2xl border border-black/5 flex items-center gap-3 shrink-0">
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs font-bold text-[#111111]">Explainable Ranking</div>
              <div className="text-[11px] text-[#494D4D]">Demographic data excluded from ranking model</div>
            </div>
          </div>
        </div>

        {/* When User Has NOT built their Skill Passport yet */}
        {!isLoading && !isError && !hasPassport && (
          <div className="bg-white rounded-4xl p-8 sm:p-14 text-center border border-black/5 shadow-md flex flex-col items-center gap-6 max-w-3xl mx-auto w-full">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-inner">
              <Award className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div>
              <span className="px-3.5 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 uppercase tracking-wider inline-block mb-3">
                Skill Passport Required
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                Build Your Skill Passport to Unlock Matched Opportunities
              </h2>
              <p className="text-sm text-[#494D4D] mt-2.5 max-w-xl mx-auto leading-relaxed">
                Opportunity match scores are calculated dynamically against your verified coursework, lab grades, and project evidence with zero demographic bias. Add your first evidence record to start receiving AI-matched internships.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left my-2">
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold text-[#111111]">Zero Demographic Bias</span>
                <span className="text-[11px] text-[#666666]">Ranking model excludes gender, photo, name, and college tier.</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold text-[#111111]">100% Verifiable Citations</span>
                <span className="text-[11px] text-[#666666]">Matches are backed by automated OCR and QR signatures.</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col gap-1.5">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                <span className="text-xs font-bold text-[#111111]">Instant Percentage Scores</span>
                <span className="text-[11px] text-[#666666]">See exact skill match breakdown and missing skills.</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/evidence/new"
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold text-sm shadow-md transition-all active:scale-95"
              >
                <FilePlus2 className="w-4.5 h-4.5" />
                <span>Upload Coursework & Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/passport"
                className="inline-flex items-center gap-2 px-6 py-4 bg-neutral-100 hover:bg-neutral-200 text-[#111111] rounded-full font-bold text-sm transition-all active:scale-95"
              >
                <span>View Skill Passport</span>
              </Link>
            </div>
          </div>
        )}

        {/* When User HAS built their Skill Passport */}
        {!isLoading && !isError && hasPassport && (
          <>
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search roles, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="flex items-center gap-1 bg-[#F5F5F3] p-1 rounded-2xl border border-black/5 text-xs font-bold w-full sm:w-auto">
                  <span className="px-3 text-neutral-400 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Source:</span>
                  </span>
                  {["all", "adzuna", "jooble", "remotive"].map((src) => (
                    <button
                      key={src}
                      onClick={() => setSelectedSource(src)}
                      className={`px-3 py-1.5 rounded-xl uppercase tracking-wider text-[11px] transition-all ${
                        selectedSource === src
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-[#494D4D] hover:bg-neutral-200"
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => refetch()}
                  className="p-2.5 bg-[#F5F5F3] text-[#494D4D] hover:text-[#111111] rounded-2xl border border-black/5 transition-all shrink-0 cursor-pointer"
                  title="Refresh feed"
                >
                  <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
                </button>
              </div>
            </div>

            {filteredList.length === 0 && (
              <div className="bg-white rounded-4xl p-12 text-center border border-black/5 shadow-sm flex flex-col items-center gap-3">
                <Briefcase className="w-10 h-10 text-neutral-300" />
                <h3 className="text-xl font-bold text-[#111111]">No Matching Opportunities</h3>
                <p className="text-xs text-[#494D4D]">No job listings match your current keyword or source filter.</p>
              </div>
            )}

            {filteredList.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredList.map((op) => (
                  <OpportunityCard key={op.id} opportunity={op} />
                ))}
              </div>
            )}
          </>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl p-6 h-64 animate-pulse border border-black/5">
                <div className="h-4 bg-neutral-200 rounded-full w-1/4 mb-4"></div>
                <div className="h-6 bg-neutral-200 rounded-full w-3/4 mb-2"></div>
                <div className="h-4 bg-neutral-150 rounded-full w-full mb-3"></div>
                <div className="h-4 bg-neutral-150 rounded-full w-2/3"></div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 rounded-[28px] p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-rose-900">Failed to load opportunity feed</h3>
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


