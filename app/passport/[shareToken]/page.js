import React from "react";
import Link from "next/link";
import { Award, Lock, ShieldCheck, Layers, FileCheck, ExternalLink } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { INITIAL_PASSPORT } from "@/app/data/mockData";

export default async function PublicPassportPage({ params }) {
  const { shareToken } = await params;

  // Server-side validation of shareToken & public visibility state
  let passport = null;
  let errorState = null;

  if (shareToken === INITIAL_PASSPORT.shareToken || shareToken.startsWith("sp-token-")) {
    if (!INITIAL_PASSPORT.isPublic && shareToken !== INITIAL_PASSPORT.shareToken) {
      errorState = "This Skill Passport is private and cannot be viewed publicly.";
    } else {
      passport = INITIAL_PASSPORT;
    }
  } else {
    errorState = "Invalid or expired share link token.";
  }

  if (errorState || !passport) {
    return (
      <div className="min-h-screen bg-[#F5F5F3] flex items-center justify-center p-4">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full border border-black/5 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-[#111111]">Passport Unavailable</h1>
          <p className="text-xs text-[#494D4D]">{errorState}</p>
          <Link
            href="/"
            className="mt-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Back to SkillSync Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] py-12 px-4 sm:px-6">
      <main className="max-w-4xl mx-auto flex flex-col gap-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-lg border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Publicly Shared Verified Passport</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-2">
              Verified Skill Passport
            </h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Token: <code className="bg-[#F5F5F3] px-2 py-0.5 rounded font-mono">{shareToken}</code>
            </p>
          </div>

          <Link
            href="/signup"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            <span>Create Your Passport</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          </Link>
        </div>

        {/* Skill Groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {passport.skills.map((skillItem) => (
            <div
              key={skillItem.skillId}
              className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 flex flex-col justify-between gap-4"
            >
              <div>
                <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-black/5">
                  {skillItem.category}
                </span>

                <h3 className="text-xl font-extrabold text-[#111111] mt-2.5 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600 shrink-0" />
                  {skillItem.name}
                </h3>

                <div className="mt-4 flex flex-col gap-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
                    Supporting Evidence ({skillItem.evidence?.length || 0}):
                  </div>
                  {skillItem.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="bg-[#F8F9FA] p-3 rounded-2xl border border-black/5 flex items-center justify-between gap-2"
                    >
                      <div className="text-xs font-semibold text-[#111111] flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{ev.title}</span>
                      </div>
                      <Badge tier={ev.tier} showIcon={false} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
