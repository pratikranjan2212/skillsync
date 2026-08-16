"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Award, ShieldCheck, Layers, FileCheck, RefreshCw, AlertCircle, FileText } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import ShareExportButtons from "@/app/components/passport/ShareExportButtons";
import Badge from "@/app/components/ui/Badge";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";

async function fetchPassportData() {
  const res = await fetch("/api/passport");
  if (!res.ok) throw new Error("Failed to fetch passport data");
  const data = await res.json();
  return data.passport;
}

/**
 * Skill Passport View Screen.
 * Categorizes student skills and presents verified supporting evidence citations.
 * Protected: Displays full passport when signed in, or AuthRequiredView when signed out.
 */
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
      <div className="h-screen overflow-hidden bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <AuthRequiredView
            badgeText="Verified Portable Skill Passport"
            badgeIcon={Award}
            badgeColor="amber"
            title="Skill Passport Access"
            subtitle="Sign in to view, verify, and export your official Skill Passport with evidence-backed coursework and credential citations."
            sectionName="Skill Passport"
            publicLink="/passport/sp-token-alex-chen"
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
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        {/* Passport Header Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-full border border-amber-200 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Verified Portable Skill Passport</span>
              </span>
              <span className="text-xs text-[#494D4D] font-mono">ID: {passport?.studentId || "std-101"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-2">
              Alex Chen&apos;s Skill Passport
            </h1>
            <p className="text-sm text-[#494D4D] mt-1 max-w-2xl">
              Skills grouped by taxonomy domain with citations of backing coursework, projects, and micro-credentials.
            </p>
          </div>

          {passport && (
            <ShareExportButtons
              passportData={passport}
              isPublic={passport.isPublic}
              shareToken={passport.shareToken}
              onTogglePublic={handleTogglePublic}
            />
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-[32px] p-12 text-center border border-black/5 flex flex-col items-center gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-emerald-200 animate-spin"></div>
            <p className="text-xs font-bold text-neutral-500">Loading Skill Passport...</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-rose-50 rounded-[28px] p-8 border border-rose-200 text-center flex flex-col items-center gap-3">
            <AlertCircle className="w-8 h-8 text-rose-600" />
            <h3 className="text-lg font-bold text-rose-900">Failed to load Skill Passport</h3>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-rose-800 text-white rounded-xl text-xs font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skills Grouped by Domain */}
        {passport && passport.skills && (
          <div id="evidence" className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-mt-28">
            {passport.skills.map((skillItem) => (
              <div
                key={skillItem.skillId}
                className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 flex flex-col justify-between gap-4 hover:shadow-md transition-all"
              >
                <div>
                  {/* Category Pill & Skill Name */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-black/5">
                      {skillItem.category}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-[#111111] mt-2.5 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-600 shrink-0" />
                    {skillItem.name}
                  </h3>

                  {/* Supporting Evidence Items List */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
                      Supporting Evidence Citations ({skillItem.evidence?.length || 0}):
                    </div>
                    {skillItem.evidence && skillItem.evidence.length > 0 ? (
                      skillItem.evidence.map((ev, idx) => (
                        <div
                          key={idx}
                          className="bg-[#F8F9FA] p-3 rounded-2xl border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <div className="text-xs font-semibold text-[#111111] flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{ev.title}</span>
                          </div>
                          <Badge tier={ev.tier} showIcon={false} />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-400 italic">No supporting evidence items linked.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
                  <span>Skill ID: {skillItem.skillId}</span>
                  <span className="text-emerald-700 font-bold">100% Citation Backed</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
