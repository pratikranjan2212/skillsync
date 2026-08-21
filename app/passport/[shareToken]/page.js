"use client";

import React, { use } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Lock, ExternalLink, ArrowLeft, AlertCircle, Sparkles, ShieldCheck } from "lucide-react";
import SkillPassportFolder from "@/app/components/passport/SkillPassportFolder";

async function fetchPublicPassport(token) {
  if (!token) throw new Error("Missing share token");
  const res = await fetch(`/api/passport/${encodeURIComponent(token)}`);
  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.error || "Could not fetch public passport.");
    error.status = res.status;
    throw error;
  }

  return data.passport;
}

export default function PublicPassportPage({ params }) {
  // Support both React 19 Promise params and Next.js useParams hook
  const routeParams = useParams();
  const unwrappedParams = params ? (typeof params.then === "function" ? use(params) : params) : null;
  const shareToken = unwrappedParams?.shareToken || routeParams?.shareToken || "";

  const {
    data: passport,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["public-passport", shareToken],
    queryFn: () => fetchPublicPassport(shareToken),
    enabled: Boolean(shareToken),
    retry: 1,
    staleTime: 30000,
    refetchOnMount: "always",
  });

  // Case 1: Loading Screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-10 max-w-md w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-neutral-900">Verifying Skill Passport...</h2>
            <p className="text-xs text-neutral-500">Decrypting cryptographically signed credential transcript</p>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Private Passport (403)
  if (isError && error?.status === 403) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 max-w-md w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-[#111111]">Private Skill Passport</h1>
            <p className="text-xs text-[#494D4D] leading-relaxed">
              This Skill Passport is set to private by the student and can only be viewed by the verified account owner.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2 w-full">
            <Link
              href="/"
              className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors text-center"
            >
              Back to Home
            </Link>
            <Link
              href="/signin"
              className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Invalid / Expired Token (404) or General Error
  if (isError || !passport) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 max-w-md w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="flex flex-col gap-1.5">
            <h1 className="text-xl font-bold text-[#111111]">Passport Unavailable</h1>
            <p className="text-xs text-[#494D4D] leading-relaxed">
              {error?.message || "Invalid or expired share link token. The requested Skill Passport could not be loaded."}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2 w-full">
            <button
              type="button"
              onClick={() => refetch()}
              className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors text-center cursor-pointer"
            >
              Retry
            </button>
            <Link
              href="/"
              className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors text-center"
            >
              SkillSync Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: Successfully Loaded Public Passport
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] py-6 sm:py-10 flex flex-col items-center justify-between">
      <header className="max-w-6xl 2xl:max-w-7xl w-full mx-auto px-4 sm:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-neutral-700 hover:text-black rounded-xl text-xs font-bold border border-black/5 shadow-2xs transition-all hover:scale-102"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>SkillSync Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-all shadow-xs hover:scale-102"
          >
            <span>Create Your Passport</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>
      </header>

      <main className="max-w-6xl 2xl:max-w-7xl w-full mx-auto px-4 sm:px-8 my-auto flex flex-col items-center justify-center py-6">
        <SkillPassportFolder passportData={passport} />
      </main>

      <footer className="w-full text-center py-4 text-[11px] text-neutral-400 font-medium">
        <span>Verified by SkillSync Cryptographic Credential Engine</span>
      </footer>
    </div>
  );
}
