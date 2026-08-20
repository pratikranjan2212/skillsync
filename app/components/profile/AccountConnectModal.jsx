"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Globe,
  Trash2,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon, CourseraIcon, CredlyIcon } from "@/app/components/icons";
import { signIn } from "next-auth/react";

export default function AccountConnectModal({
  isOpen,
  onClose,
  provider = "github", // "github" | "linkedin" | "portfolio" | "coursera" | "credly"
  currentUrl = "",
  onSaveSuccess,
}) {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentUrl || "");
      setErrorMessage("");
      setSuccessMessage("");
      setIsSubmitting(false);
    }
  }, [isOpen, provider, currentUrl]);

  if (!isOpen) return null;

  const getProviderConfig = () => {
    switch (provider) {
      case "github":
        return {
          title: "GitHub Profile",
          subtitle: "Connect your GitHub account to verify repository code, commits, and project evidence in your Skill Passport.",
          placeholder: "https://github.com/your-username or your-username",
          example: "e.g. https://github.com/tonystark or tonystark",
          icon: <GitHubIcon className="w-5 h-5 fill-current" />,
          iconBg: "bg-neutral-900 text-white",
          brandColor: "text-neutral-900",
          brandButtonBg: "bg-neutral-900 hover:bg-neutral-800 text-white",
          allowOAuth: true,
          oauthProvider: "github",
          oauthLabel: "Verify with GitHub",
          oauthSubtitle: "Sign in with GitHub to auto-verify your handle & import public repositories.",
          oauthBtnBg: "bg-neutral-900 hover:bg-neutral-800 text-white",
          oauthIcon: <GitHubIcon className="w-3.5 h-3.5 fill-current" />,
          fieldName: "github",
          formatUrl: (val) => {
            const trimmed = val.trim().replace(/^https?:\/\/(www\.)?github\.com\/?/, "");
            return trimmed ? `https://github.com/${trimmed}` : "";
          },
        };
      case "linkedin":
        return {
          title: "LinkedIn Profile",
          subtitle: "Connect your LinkedIn profile to display your professional network, sync your profile photo, and verify accredited industry licenses.",
          placeholder: "https://linkedin.com/in/your-username or your-username",
          example: "e.g. https://linkedin.com/in/tonystark or in/tonystark",
          icon: <LinkedInIcon className="w-5 h-5 fill-current" />,
          iconBg: "bg-[#0A66C2] text-white",
          brandColor: "text-[#0A66C2]",
          brandButtonBg: "bg-[#0A66C2] hover:bg-[#084E96] text-white",
          allowOAuth: true,
          oauthProvider: "linkedin",
          oauthLabel: "Verify & Sync with LinkedIn",
          oauthSubtitle: "Sign in with LinkedIn to auto-sync your profile photo, handle & accredited credentials.",
          oauthBtnBg: "bg-[#0A66C2] hover:bg-[#084E96] text-white",
          oauthIcon: <LinkedInIcon className="w-3.5 h-3.5 fill-current" />,
          fieldName: "linkedin",
          formatUrl: (val) => {
            let trimmed = val.trim().replace(/^https?:\/\/(www\.)?linkedin\.com\/?/, "");
            if (trimmed.startsWith("in/")) trimmed = trimmed.slice(3);
            return trimmed ? `https://linkedin.com/in/${trimmed}` : "";
          },
        };
      case "credly":
        return {
          title: "Credly Public Profile",
          subtitle: "Link your public Credly profile to verify and display your verified industry badges & IT certifications.",
          placeholder: "https://www.credly.com/users/your-username/badges",
          example: "e.g. https://www.credly.com/users/tonystark/badges or tonystark",
          icon: <CredlyIcon className="w-5 h-5" />,
          iconBg: "bg-[#FF6B00] text-white",
          brandColor: "text-[#FF6B00]",
          brandButtonBg: "bg-[#FF6B00] hover:bg-[#E05E00] text-white",
          allowOAuth: false,
          fieldName: "credly",
          formatUrl: (val) => {
            let trimmed = val.trim().replace(/^https?:\/\/(www\.)?credly\.com\/?/, "");
            if (trimmed.startsWith("users/")) trimmed = trimmed.slice(6);
            if (trimmed.startsWith("u/")) trimmed = trimmed.slice(2);
            if (trimmed.endsWith("/badges")) trimmed = trimmed.slice(0, -7);
            return trimmed ? `https://www.credly.com/users/${trimmed}/badges` : "";
          },
        };
      case "coursera":
        return {
          title: "Coursera Account",
          subtitle: "Link your Coursera public profile to import verified coursework certificates and skill specializations.",
          placeholder: "https://coursera.org/user/your-username",
          example: "e.g. https://coursera.org/user/tonystark or user/tonystark",
          icon: <CourseraIcon className="w-5 h-5" />,
          iconBg: "bg-[#0056D2] text-white",
          brandColor: "text-[#0056D2]",
          brandButtonBg: "bg-[#0056D2] hover:bg-[#0047B3] text-white",
          allowOAuth: false,
          fieldName: "coursera",
          formatUrl: (val) => {
            let trimmed = val.trim().replace(/^https?:\/\/(www\.)?coursera\.org\/?/, "");
            if (trimmed.startsWith("user/")) trimmed = trimmed.slice(5);
            return trimmed ? `https://coursera.org/user/${trimmed}` : "";
          },
        };
      case "portfolio":
      default:
        return {
          title: "Personal Portfolio / Website",
          subtitle: "Link your personal engineering portfolio, developer blog, or project showcase URL.",
          placeholder: "https://yourportfolio.dev",
          example: "e.g. https://tonystark.dev or portfolio.io",
          icon: <Globe className="w-5 h-5" />,
          iconBg: "bg-emerald-600 text-white",
          brandColor: "text-emerald-700",
          brandButtonBg: "bg-emerald-600 hover:bg-emerald-700 text-white",
          allowOAuth: false,
          fieldName: "portfolio",
          formatUrl: (val) => {
            const trimmed = val.trim();
            if (!trimmed) return "";
            if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
              return `https://${trimmed}`;
            }
            return trimmed;
          },
        };
    }
  };

  const config = getProviderConfig();

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    const formatted = config.formatUrl(inputValue);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [config.fieldName]: formatted,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update profile link.");
      }

      setSuccessMessage(`${config.title} successfully updated!`);
      if (onSaveSuccess) {
        onSaveSuccess(data.profile);
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || "Failed to save link. Please check the URL format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisconnect = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [config.fieldName]: "",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to disconnect account.");
      }

      setSuccessMessage(`${config.title} disconnected.`);
      if (onSaveSuccess) {
        onSaveSuccess(data.profile);
      }

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setErrorMessage(err.message || "Failed to disconnect link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConnected = Boolean(currentUrl && currentUrl.trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl sm:rounded-4xl shadow-2xl border border-black/10 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 sm:p-7 border-b border-neutral-100 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className={`w-11 h-11 rounded-2xl ${config.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              {config.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-[#111111] tracking-tight">
                  {isConnected ? `Manage ${config.title}` : `Connect ${config.title}`}
                </h2>
                {isConnected && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#494D4D] mt-0.5 leading-relaxed">
                {config.subtitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content / Form */}
        <div className="p-6 sm:p-7 space-y-5 overflow-y-auto">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5 flex items-center justify-between">
                <span>Profile URL or Handle</span>
                <span className="text-[10px] text-neutral-400 font-normal">{config.example}</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={config.placeholder}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F8F9FA] hover:bg-white focus:bg-white text-xs sm:text-sm font-semibold text-[#111111] border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-neutral-400"
                  autoFocus
                />
                {inputValue && (
                  <button
                    type="button"
                    onClick={() => setInputValue("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              {inputValue && (
                <div className="mt-2 text-[11px] font-medium text-neutral-500 flex items-center gap-1.5 truncate">
                  <span className="text-neutral-400">Preview:</span>
                  <span className="font-mono text-emerald-700 truncate">{config.formatUrl(inputValue)}</span>
                </div>
              )}
            </div>

            {/* Direct OAuth Alternative for Supported Providers (LinkedIn / GitHub) */}
            {config.allowOAuth && (
              <div className="p-4 rounded-2xl bg-[#F8F9FA] border border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-[#111111] block">Automatic OAuth Verification</span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    {config.oauthSubtitle || `Sign in with ${config.title} to auto-verify your handle & credentials.`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => signIn(config.oauthProvider || "github", { callbackUrl: "/profile" })}
                  className={`px-3.5 py-2 rounded-xl ${config.oauthBtnBg || "bg-neutral-900 text-white"} text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs`}
                >
                  {config.oauthIcon}
                  <span>{config.oauthLabel || `Verify with ${config.title}`}</span>
                </button>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              {isConnected ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleDisconnect}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !inputValue.trim()}
                  className={`px-5 py-2.5 rounded-xl ${config.brandButtonBg} text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isSubmitting ? "Saving..." : isConnected ? "Update Link" : "Save & Connect"}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
