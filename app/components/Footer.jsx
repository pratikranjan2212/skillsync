"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-black/5 pt-16 pb-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5 font-black text-xl text-[#111111]">
            <img src="/logo.svg" alt="SkillSync Logo" className="h-7 w-auto object-contain" />
            <span>SkillSync</span>
          </Link>
          <p className="text-xs text-[#494D4D] mt-2 max-w-sm font-medium">
            Automated skill verification and explainable job matching platform with guaranteed demographic non-discrimination.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-[#494D4D]">
          <Link href="/dashboard" className="hover:text-[#111111] transition-colors">
            Dashboard
          </Link>
          <Link href="/passport" className="hover:text-[#111111] transition-colors">
            Skill Passport
          </Link>
          <Link href="/opportunities" className="hover:text-[#111111] transition-colors">
            Opportunity Feed
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center text-xs text-neutral-400 gap-4">
        <div>© 2026 SkillSync Platform. All rights reserved.</div>
        <div className="flex items-center gap-2 text-emerald-700 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Fairness Guarantee Verified</span>
        </div>
      </div>
    </footer>
  );
}
