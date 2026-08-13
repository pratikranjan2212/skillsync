"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Sparkles, AlertCircle, Building2, MapPin } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import MatchExplanationCard from "@/app/components/opportunities/MatchExplanationCard";

async function fetchMatchDetail(id) {
  const res = await fetch(`/api/opportunities/${id}`);
  if (!res.ok) throw new Error("Failed to fetch match explanation detail");
  return res.json();
}

/**
 * Match Detail Screen - The Demo Centerpiece.
 * Fetches and renders full explanation object including matched evidence citations,
 * missing skills breakdown, and explicit rendering of excludedFromRanking parameters.
 */
export default function MatchDetailPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["match-detail", id],
    queryFn: () => fetchMatchDetail(id),
  });

  const opportunity = data?.opportunity;
  const explanation = data?.explanation;

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
        {/* Back Button */}
        <div>
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#111111] hover:bg-neutral-50 rounded-2xl text-xs font-bold border border-black/5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600" />
            <span>Back to Opportunities Feed</span>
          </Link>
        </div>

        {/* Opportunity Overview Header */}
        {opportunity && (
          <div className="bg-white rounded-[28px] p-6 shadow-md border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-xs font-bold rounded-xl border border-black/5">
                  via {opportunity.sourceApi}
                </span>
                <span className="text-xs font-mono text-neutral-400">Ref ID: {opportunity.sourceListingId}</span>
              </div>
              <h1 className="text-2xl font-black text-[#111111] mt-2">{opportunity.title}</h1>
              <div className="flex items-center gap-4 text-xs font-semibold text-[#494D4D] mt-1">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                  {opportunity.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {opportunity.location}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-4 py-2.5 rounded-2xl border border-emerald-200 text-xs font-bold self-start sm:self-center">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Verified Recommendation</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-[32px] p-12 text-center border border-black/5 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-emerald-200 animate-spin"></div>
            <p className="text-xs font-bold text-neutral-500">Computing Explainable Match Detail...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-rose-50 rounded-[28px] p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-rose-900">Failed to load match detail</h3>
            <p className="text-xs text-rose-700">{error?.message}</p>
          </div>
        )}

        {/* Match Explanation Card - Centerpiece */}
        {explanation && (
          <MatchExplanationCard
            explanation={explanation}
            externalUrl={opportunity?.externalUrl}
          />
        )}
      </main>
    </div>
  );
}
