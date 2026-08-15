"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Lock,
  LogIn,
  UserCheck,
  UserPlus,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";

/**
 * Reusable Auth Required Gate View for protected sections (Skill Passport & Opportunities).
 * Prompts user to sign in, use 1-click instant demo access, or create an account,
 * while showcasing preview features unlocked upon authentication.
 *
 * @param {Object} props
 * @param {string} props.badgeText - e.g. "Verified Portable Skill Passport"
 * @param {React.ComponentType} [props.badgeIcon] - Lucide icon
 * @param {string} [props.badgeColor] - "amber" | "emerald" | "blue"
 * @param {string} props.title - Main header title
 * @param {string} props.subtitle - Descriptive subtitle
 * @param {string} props.sectionName - "Skill Passport" | "Opportunities Feed"
 * @param {Array<{icon: React.ComponentType, title: string, desc: string}>} [props.features]
 * @param {string} [props.publicLink] - Optional public preview link URL
 * @param {string} [props.publicLinkText] - Optional public preview link text
 * @param {string} [props.backLink] - Optional back link URL
 * @param {string} [props.backText] - Optional back link text
 */
export default function AuthRequiredView({
  badgeText = "Authentication Required",
  badgeIcon: BadgeIcon = Lock,
  badgeColor = "emerald",
  title = "Sign In to Access This Section",
  subtitle = "This section contains personalized verified records and features. Sign in or try our instant demo to view.",
  sectionName = "Protected Content",
  features = [],
  publicLink,
  publicLinkText,
  backLink,
  backText,
}) {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleDemoSignIn = async (role = "student") => {
    setIsLoggingIn(true);
    setLoginError("");
    try {
      const email = role === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu";
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo", role }),
      });

      if (res.ok) {
        document.cookie = `skillsync_session=active-token; path=/;`;
        document.cookie = `next-auth.session-token=active-token; path=/;`;
        document.cookie = `skillsync_role=${role}; path=/;`;
        window.location.reload();
      } else {
        setLoginError("Demo sign in failed. Please try again.");
      }
    } catch (err) {
      setLoginError("An error occurred during demo sign in.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const badgeColorClasses = {
    amber: "bg-amber-50 text-amber-800 border-amber-200",
    emerald: "bg-emerald-50 text-emerald-800 border-emerald-200",
    blue: "bg-blue-50 text-blue-800 border-blue-200",
  }[badgeColor] || "bg-neutral-100 text-neutral-800 border-neutral-200";

  const iconColorClasses = {
    amber: "text-amber-600",
    emerald: "text-emerald-600",
    blue: "text-blue-600",
  }[badgeColor] || "text-neutral-600";

  return (
    <div className="flex flex-col gap-8">
      {backLink && (
        <div>
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#111111] hover:bg-neutral-50 rounded-2xl text-xs font-bold border border-black/5 transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-neutral-600" />
            <span>{backText || "Back"}</span>
          </Link>
        </div>
      )}

      {/* Main Hero Card */}
      <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2">
            <span className={`px-3.5 py-1 text-xs font-bold rounded-full border inline-flex items-center gap-1.5 ${badgeColorClasses}`}>
              <BadgeIcon className={`w-3.5 h-3.5 ${iconColorClasses}`} />
              <span>{badgeText}</span>
            </span>
            <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 text-[11px] font-bold rounded-md uppercase tracking-wider">
              Sign In Required
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111111] mt-3 tracking-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[#494D4D] mt-2 leading-relaxed">
            {subtitle}
          </p>

          {loginError && (
            <div className="mt-4 p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
              {loginError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => handleDemoSignIn("student")}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>{isLoggingIn ? "Signing In..." : "⚡ Quick Demo Student Sign In"}</span>
            </button>

            <Link
              href="/signin"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Sign In with Email</span>
            </Link>

            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-4 py-3.5 bg-[#F5F5F3] hover:bg-[#EAEAEA] text-[#111111] rounded-2xl font-bold text-xs sm:text-sm border border-black/5 transition-all"
            >
              <UserPlus className="w-4 h-4 text-neutral-600" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>

        {/* Lock Info Box */}
        <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-black/5 flex flex-col gap-3 w-full md:w-80 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 shrink-0">
              <Lock className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="text-xs font-black text-[#111111]">Privacy & Verification</div>
              <div className="text-[11px] text-[#494D4D]">Individual Access Control</div>
            </div>
          </div>
          <p className="text-xs text-[#494D4D] leading-relaxed">
            Only authenticated student owners can access private credentials, manage export visibility, and view match analytics.
          </p>
          {publicLink && (
            <div className="pt-2 border-t border-black/5">
              <Link
                href={publicLink}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>{publicLinkText || "View Sample Public Passport"}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Feature Preview Cards */}
      {features && features.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-[#111111]">
              What You Unlock in {sectionName}
            </h2>
            <span className="text-xs font-bold text-neutral-500">
              Instant access upon sign in
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const FeatIcon = feat.icon || Sparkles;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-[28px] p-6 shadow-sm border border-black/5 flex flex-col gap-3 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <FeatIcon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#111111]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#494D4D] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
