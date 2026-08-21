"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, AlertCircle, Layers, FileCheck, FileText } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import InteractivePassportCard from "@/app/components/passport/InteractivePassportCard";
import SkillPassportFolder from "@/app/components/passport/SkillPassportFolder";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

async function fetchPassportData() {
  const res = await fetch("/api/passport");
  if (!res.ok) throw new Error("Failed to fetch passport data");
  const data = await res.json();
  return data.passport;
}

export default function SkillPassportPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const {
    data: passport,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["skill-passport"],
    queryFn: fetchPassportData,
    enabled: isAuthenticated,
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });

  const handleTogglePublic = async (newPublicState) => {
    try {
      await fetch("/api/passport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: newPublicState }),
      });
      refetch();
    } catch (err) {
      console.error("Failed to update visibility:", err);
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen pb-12 bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 2xl:px-8 w-full">
          <AuthRequiredView
            badgeText="Verified Portable Skill Passport"
            badgeIcon={Award}
            badgeColor="amber"
            title="Skill Passport Access"
            subtitle="Sign in to view, verify, and export your official Skill Passport with evidence-backed coursework and credential citations."
            sectionName="Skill Passport"
            publicLink="/passport/sp-token-9942a"
            publicLinkText="View Sample Public Passport"
            features={[
              {
                icon: Layers,
                title: "Taxonomy-Grouped Skills",
                desc: "Verified skills organized systematically across Programming Languages, Databases, AI/ML, and Frontend Web domains.",
              },
              {
                icon: FileCheck,
                title: "100% Backed Evidence Citations",
                desc: "Every skill maps directly to verified university coursework, GitHub repositories, and accredited micro-credentials.",
              },
              {
                icon: FileText,
                title: "Verifiable PDF Export & Sharing",
                desc: "Generate official PDF skill transcripts or toggle public read-only share links for recruiters.",
              },
            ]}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-8 md:px-12 flex flex-col items-center justify-start sm:justify-center w-full min-h-0 py-4 sm:py-8">
        {isLoading && (
          <div className="w-full bg-white rounded-4xl p-16 text-center border border-black/5 flex flex-col items-center gap-4 shadow-sm animate-pulse">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            <p className="text-sm font-bold text-neutral-600">Loading Verifiable Skill Passport...</p>
          </div>
        )}

        {isError && (
          <div className="w-full bg-rose-50 rounded-[28px] p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-rose-900">Failed to load Skill Passport</h3>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {passport && (
          <div className="w-full flex justify-center items-center py-2">
            <SkillPassportFolder
              passportData={passport}
              onTogglePublic={handleTogglePublic}
            />
          </div>
        )}
      </main>
    </div>
  );
}

