"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Building2,
  MapPin,
  ShieldCheck,
  Layers,
  FileCheck,
  Globe,
  Home,
  Briefcase,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import MatchExplanationCard from "@/app/components/opportunities/MatchExplanationCard";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

async function fetchMatchDetail(id) {
  const res = await fetch(`/api/opportunities/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match explanation detail");
  return res.json();
}

export default function MatchDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["match-detail", id],
    queryFn: () => fetchMatchDetail(id),
    enabled: isAuthenticated,
  });

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="h-screen overflow-hidden bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 w-full">
          <AuthRequiredView
            badgeText="Explainable Match Verification"
            badgeIcon={Sparkles}
            badgeColor="emerald"
            title="Opportunity Match Detail Access"
            subtitle="Sign in to inspect full skill match breakdown, verified citations, and demographic audit details for this opportunity."
            sectionName="Match Explanation"
            backLink="/opportunities"
            backText="Back to Opportunities Feed"
            features={[
              {
                icon: ShieldCheck,
                title: "Transparent Evidence Mapping",
                desc: "Inspect precisely which verified coursework and projects satisfy each individual job requirement.",
              },
              {
                icon: Layers,
                title: "Missing Skill Gap Analysis",
                desc: "Actionable recommendations on skills to acquire to maximize your application match rate.",
              },
              {
                icon: FileCheck,
                title: "Bias-Free Audit Checklist",
                desc: "Verified exclusion of sensitive demographic markers from ranking computations.",
              },
            ]}
          />
        </main>
      </div>
    );
  }

  const opportunity = data?.opportunity;
  const explanation = data?.explanation;

  const normalizedMode = (opportunity?.workMode || "").toLowerCase();
  let modeBadge = {
    label: "Remote",
    icon: Globe,
    style: "bg-teal-50 text-teal-800 border-teal-200",
  };

  if (normalizedMode === "hybrid") {
    modeBadge = {
      label: "Hybrid",
      icon: Home,
      style: "bg-indigo-50 text-indigo-800 border-indigo-200",
    };
  } else if (
    normalizedMode === "on-site" ||
    normalizedMode === "onsite" ||
    normalizedMode === "offline"
  ) {
    modeBadge = {
      label: "On-site",
      icon: Building2,
      style: "bg-amber-50 text-amber-900 border-amber-200",
    };
  }

  const ModeIcon = modeBadge.icon;

  const directLinkedInUrl =
    opportunity?.linkedinUrl ||
    opportunity?.url ||
    opportunity?.externalUrl ||
    (opportunity ? `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(`${opportunity.title} ${opportunity.company}`.trim())}` : "");

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-6 pt-4 sm:pt-6">
        <div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#111111] hover:bg-neutral-50 rounded-2xl text-xs font-bold border border-black/5 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600" />
            <span>Back to Opportunities Feed</span>
          </Link>
        </div>

        {opportunity && (
          <div className="bg-white rounded-[28px] p-6 shadow-md border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl border ${modeBadge.style}`}>
                  <ModeIcon className="w-3.5 h-3.5" />
                  <span>{modeBadge.label}</span>
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#111111] mt-2">{opportunity.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[#494D4D] mt-1.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-bold text-neutral-800">{opportunity.company}</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{opportunity.location}</span>
                </span>
                {opportunity.stipend && (
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{opportunity.stipend}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center shrink-0">
              {directLinkedInUrl && (
                <a
                  href={directLinkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] rounded-2xl text-xs font-bold transition-all border border-[#0A66C2]/20 hover:border-[#0A66C2]/40 active:scale-95 group/linkedin cursor-pointer"
                  title="View job directly on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                  <span>LinkedIn Listing</span>
                </a>
              )}

              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Verified Match</span>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-4xl p-12 text-center border border-black/5 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-emerald-200 animate-spin"></div>
            <p className="text-xs font-bold text-neutral-500">Computing Explainable Match Detail...</p>
          </div>
        )}

        {isError && (
          <div className="bg-rose-50 rounded-[28px] p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-rose-900">Failed to load match detail</h3>
            <p className="text-xs text-rose-700">{error?.message || "Opportunity details could not be retrieved."}</p>
          </div>
        )}

        {explanation && (
          <MatchExplanationCard
            explanation={explanation}
            externalUrl={directLinkedInUrl}
          />
        )}
      </main>
    </div>
  );
}
