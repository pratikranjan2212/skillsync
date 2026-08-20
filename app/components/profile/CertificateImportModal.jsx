"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Award,
  ShieldCheck,
  Sparkles,
  Link2,
  Layers,
  ArrowRight,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { CourseraIcon, LinkedInIcon } from "@/app/components/icons";

export default function CertificateImportModal({
  isOpen,
  onClose,
  provider = "coursera", // "coursera" | "linkedin"
  initialUrl = "",
  onImportSuccess,
}) {
  const [profileUrl, setProfileUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  const isCoursera = provider === "coursera";
  const brandTitle = isCoursera ? "Coursera Account & Certificates" : "LinkedIn Certifications & Licenses";
  const brandColor = isCoursera ? "bg-[#0056D2]" : "bg-[#0A66C2]";
  const brandTextColor = isCoursera ? "text-[#0056D2]" : "text-[#0A66C2]";
  const brandBorderColor = isCoursera ? "border-[#0056D2]/30" : "border-[#0A66C2]/30";
  const brandBgLight = isCoursera ? "bg-[#0056D2]/5" : "bg-[#0A66C2]/5";
  const inputPlaceholder = isCoursera
    ? "https://coursera.org/user/username or certificate ID..."
    : "https://linkedin.com/in/username or profile handle...";

  useEffect(() => {
    if (isOpen) {
      setProfileUrl(initialUrl || "");
      setErrorMessage("");
      setSuccessResult(null);
      fetchCertificates(initialUrl || "");
    }
  }, [isOpen, provider, initialUrl]);

  const fetchCertificates = async (urlToUse) => {
    setIsLoading(true);
    setErrorMessage("");
    setSuccessResult(null);

    try {
      const endpoint = isCoursera
        ? `/api/coursera/certificates?courseraUrl=${encodeURIComponent(urlToUse || "")}`
        : `/api/linkedin/certifications?linkedinUrl=${encodeURIComponent(urlToUse || "")}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to retrieve credentials.");
      }

      const fetchedList = isCoursera ? data.certificates || [] : data.certifications || [];
      setItems(fetchedList);
      // Select all by default
      setSelectedIds(new Set(fetchedList.map((item) => item.id)));
    } catch (err) {
      console.error(`Error fetching ${provider} credentials:`, err);
      setErrorMessage(err.message || "Failed to fetch credentials. Please check the profile URL or try again.");
      setItems([]);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.id)));
    }
  };

  const handleImport = async () => {
    const selectedItems = items.filter((item) => selectedIds.has(item.id));
    if (selectedItems.length === 0) return;

    setIsImporting(true);
    setErrorMessage("");

    try {
      const endpoint = isCoursera ? "/api/coursera/import" : "/api/linkedin/import";
      const payload = isCoursera
        ? { certificates: selectedItems, courseraUrl: profileUrl }
        : { certifications: selectedItems, linkedinUrl: profileUrl };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Import failed. Please try again.");
      }

      setSuccessResult(data);
      if (onImportSuccess) {
        onImportSuccess(data);
      }
    } catch (err) {
      console.error(`Import ${provider} error:`, err);
      setErrorMessage(err.message || "Failed to import certificates.");
    } finally {
      setIsImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full shadow-2xl border border-black/10 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-start justify-between gap-4 bg-[#FBFBFB]">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${isCoursera ? "bg-[#0056D2]" : "bg-[#0A66C2]"
                }`}
            >
              {isCoursera ? <CourseraIcon className="w-6 h-6" /> : <LinkedInIcon className="w-5 h-5 fill-current" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">{brandTitle}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-[#494D4D] mt-0.5">
                Fetch and verify digital credentials directly into your Skill Passport.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sync Controls & URL input */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-white flex flex-col gap-3">
          <label className="block text-xs font-bold text-[#111111]">
            {isCoursera ? "Coursera Profile Link / Credential Code" : "LinkedIn Profile URL / Public Handle"}
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchCertificates(profileUrl)}
              disabled={isLoading || isImporting}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${isCoursera ? "bg-[#0056D2] hover:bg-[#0047B3]" : "bg-[#0A66C2] hover:bg-[#084E96]"
                }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sync Credentials</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#494D4D] pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isCoursera
                  ? "Configured with official Coursera Credentials API Key"
                  : "Verified with LinkedIn Profile Scraper & Credential Engine"}
              </span>
            </div>
            {items.length > 0 && (
              <span className="font-bold text-neutral-600">
                {items.length} {items.length === 1 ? "credential" : "credentials"} found
              </span>
            )}
          </div>
        </div>

        {/* Body: Certificates list or states */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#F8F9FA] flex flex-col gap-3">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-800 font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs text-emerald-900 font-semibold animate-in fade-in duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold">{successResult.message}</div>
                <div className="text-[11px] font-normal text-emerald-800 mt-0.5">
                  Your Skill Passport, verified competencies, and evidence count have been updated in real-time.
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <div className="text-xs font-bold text-[#111111]">
                Querying {isCoursera ? "Coursera" : "LinkedIn"} Credential Registry...
              </div>
              <p className="text-[11px] text-[#494D4D] max-w-xs">
                Extracting verified course completions, institutional signatures, and skill tags.
              </p>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                  Available Verifiable Certificates
                </span>
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {selectedIds.size === items.length ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {items.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleToggleSelect(item.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${isSelected
                          ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/15"
                          : "bg-white/80 border-black/5 hover:border-black/15 hover:bg-white"
                        }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${isSelected ? "bg-emerald-600 text-white" : "border border-neutral-300 bg-neutral-50"
                          }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] leading-snug">
                            {item.title}
                          </h4>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#494D4D] mt-1 font-medium">
                          <span>{item.partner || item.issuer}</span>
                          <span>•</span>
                          <span>Issued: {item.issueDate}</span>
                          {item.credentialId && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded">
                                ID: {item.credentialId}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Skills */}
                        {item.skills && item.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {item.skills.slice(0, 5).map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md bg-[#F5F5F3] text-[10px] font-bold text-neutral-700 border border-black/5"
                              >
                                {sk}
                              </span>
                            ))}
                            {item.skills.length > 5 && (
                              <span className="text-[10px] text-neutral-400 font-bold self-center">
                                +{item.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Verification Link */}
                        {item.verificationUrl && (
                          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                            <a
                              href={item.verificationUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-bold text-neutral-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                            >
                              <span>View Public Registry</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            <span className="text-[10px] text-neutral-400">Tier: High Institutional Trust</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-center">
              <Award className="w-8 h-8 text-neutral-300" />
              <div className="text-xs font-bold text-[#111111]">No Certificates Discovered</div>
              <p className="text-[11px] text-[#494D4D] max-w-sm">
                Enter your valid {isCoursera ? "Coursera" : "LinkedIn"} profile URL or click &quot;Sync
                Credentials&quot; to fetch your accomplishments.
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-semibold text-[#494D4D]">
            {selectedIds.size} of {items.length} {items.length === 1 ? "credential" : "credentials"} selected
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#494D4D] transition-colors cursor-pointer"
            >
              {successResult ? "Close" : "Cancel"}
            </button>

            <button
              type="button"
              onClick={handleImport}
              disabled={selectedIds.size === 0 || isImporting || isLoading}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Importing to Passport...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>Import {selectedIds.size > 0 ? `(${selectedIds.size})` : ""} to Passport</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
