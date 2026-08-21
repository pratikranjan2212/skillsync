"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Lock, ExternalLink, ArrowLeft, Loader2, AlertTriangle, ShieldCheck } from "lucide-react";
import SkillPassportFolder from "@/app/components/passport/SkillPassportFolder";
import Navbar from "@/app/components/layout/Navbar";

async function fetchPublicPassport(token) {
  if (!token) throw new Error("Share token is missing.");
  const res = await fetch(`/api/passport/${encodeURIComponent(token)}`);
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.error || `Passport unavailable (${res.status})`;
    const err = new Error(errorMsg);
    err.status = res.status;
    throw err;
  }
  return data.passport;
}

export default function PublicPassportPage({ params: paramsProp }) {
  const urlParams = useParams();
  const tokenFromUrl = urlParams?.shareToken;
  const tokenFromProp = paramsProp?.shareToken;
  const rawToken = tokenFromUrl || tokenFromProp;
  const shareToken = Array.isArray(rawToken) ? rawToken[0] : rawToken;

  const {
    data: passport,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public-passport", shareToken],
    queryFn: () => fetchPublicPassport(shareToken),
    enabled: Boolean(shareToken),
    retry: 1,
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-5xl 2xl:max-w-6xl w-full mx-auto px-4 sm:px-8 py-20 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white shadow-xl border border-black/5 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
          <h2 className="text-base font-bold text-neutral-800">Verifying Skill Passport...</h2>
          <p className="text-xs text-neutral-500 font-mono">Token: {shareToken || "Loading..."}</p>
        </main>
      </div>
    );
  }

  if (isError || !passport) {
    const errorMessage = error?.message || "Invalid or expired share link token.";
    const isPrivate = error?.status === 403 || errorMessage.toLowerCase().includes("private");

    return (
      <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-md w-full mx-auto px-4 py-20 flex flex-col items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${isPrivate ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
              {isPrivate ? <Lock className="w-7 h-7" /> : <AlertTriangle className="w-7 h-7" />}
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#111111]">{isPrivate ? "Private Passport" : "Passport Unavailable"}</h1>
              <p className="text-xs text-neutral-600 mt-1">{errorMessage}</p>
            </div>

            <div className="pt-2 flex flex-col gap-2 w-full">
              <Link
                href="/"
                className="w-full py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to SkillSync Home</span>
              </Link>
              <Link
                href="/passport/sp-token-9942a"
                className="w-full py-2.5 bg-white text-neutral-800 border border-neutral-200 rounded-xl text-xs font-bold hover:bg-neutral-50 transition-colors shadow-2xs flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>View Sample Public Passport</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] py-6 sm:py-10 flex flex-col items-center">
      <main className="max-w-5xl 2xl:max-w-6xl w-full mx-auto px-3.5 sm:px-8 md:px-12 flex flex-col gap-6">
        <div className="w-full flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-white text-neutral-700 hover:text-black rounded-xl text-xs font-bold border border-black/5 shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>SkillSync Home</span>
          </Link>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Create Your Passport</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        <div className="w-full flex justify-center py-4 sm:py-8">
          <SkillPassportFolder passportData={passport} />
        </div>
      </main>
    </div>
  );
}
