"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Check,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Award,
  ShieldCheck,
  Search,
  Link2,
  FileCheck2,
  AlertCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { CourseraIcon, LinkedInIcon } from "@/app/components/icons";

export default function CertificateImportModal({
  isOpen,
  onClose,
  provider = "coursera", // "coursera" | "linkedin"
  initialUrl = "",
  onImportSuccess,
}) {
  const isCoursera = provider === "coursera";
  const [activeTab, setActiveTab] = useState("verify_link"); // "verify_link" | "catalog_search" | "manual_entry"

  // Input states
  const [certificateLink, setCertificateLink] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [manualTitle, setManualTitle] = useState("");
  const [manualIssuer, setManualIssuer] = useState("");
  const [manualCredId, setManualCredId] = useState("");

  // Async states
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [successResult, setSuccessResult] = useState(null);

  const brandTitle = isCoursera ? "Coursera Certificate Verification" : "LinkedIn & Credly Certifications";
  const brandColor = isCoursera ? "bg-[#0056D2]" : "bg-[#0A66C2]";

  // Reset states on open
  useEffect(() => {
    if (isOpen) {
      setCertificateLink(initialUrl || "");
      setSearchQuery("");
      setManualTitle("");
      setManualIssuer("");
      setManualCredId("");
      setErrorMessage("");
      setSuccessResult(null);
      setItems([]);
      setSelectedIds(new Set());
      setActiveTab(isCoursera ? "verify_link" : "verify_link");

      if (initialUrl) {
        verifyByLink(initialUrl);
      }
    }
  }, [isOpen, provider, initialUrl, isCoursera]);

  // 1. Verify by Certificate URL / Code
  const verifyByLink = async (inputLink) => {
    const target = (inputLink || certificateLink).trim();
    if (!target) {
      setErrorMessage("Please enter a valid certificate link or verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessResult(null);

    try {
      const endpoint = isCoursera
        ? `/api/coursera/certificates?courseraUrl=${encodeURIComponent(target)}`
        : `/api/linkedin/certifications?verificationUrl=${encodeURIComponent(target)}&linkedinUrl=${encodeURIComponent(target)}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not verify this credential.");
      }

      const fetchedList = isCoursera ? data.certificates || [] : data.certifications || [];
      if (fetchedList.length === 0) {
        setErrorMessage(
          isCoursera
            ? "No certificate found for this code or link. Please verify the link format (e.g., https://coursera.org/verify/YOUR_CODE) or search for your course."
            : "No certification found for this link. You can also add it via the Custom Entry tab below."
        );
        setItems([]);
        setSelectedIds(new Set());
      } else {
        setItems(fetchedList);
        setSelectedIds(new Set(fetchedList.map((item) => item.id)));
      }
    } catch (err) {
      console.error(`Verification error for ${provider}:`, err);
      setErrorMessage(err.message || "Failed to verify certificate.");
      setItems([]);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Search Live Coursera Course Catalog
  const handleSearchCourses = async (queryText) => {
    const q = (queryText !== undefined ? queryText : searchQuery).trim();
    if (!q) {
      setItems([]);
      setSelectedIds(new Set());
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessResult(null);

    try {
      const endpoint = `/api/coursera/certificates?query=${encodeURIComponent(q)}`;
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Course search failed.");
      }

      const list = data.certificates || [];
      setItems(list);
      setSelectedIds(new Set(list.map((c) => c.id)));
      if (list.length === 0) {
        setErrorMessage(`No Coursera courses found matching "${q}". Try another keyword.`);
      }
    } catch (err) {
      console.error("Search error:", err);
      setErrorMessage(err.message || "Failed to search Coursera catalog.");
      setItems([]);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Manual / Custom Certification Verification
  const handleAddManualCertification = async (e) => {
    if (e) e.preventDefault();
    if (!manualTitle.trim()) {
      setErrorMessage("Please enter a certification title.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = `/api/linkedin/certifications?title=${encodeURIComponent(
        manualTitle
      )}&issuer=${encodeURIComponent(manualIssuer)}&credentialId=${encodeURIComponent(manualCredId)}`;
      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to add certification.");
      }

      const list = data.certifications || [];
      setItems(list);
      setSelectedIds(new Set(list.map((c) => c.id)));
    } catch (err) {
      console.error("Manual cert error:", err);
      setErrorMessage(err.message || "Failed to add certification.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
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
        ? { certificates: selectedItems, courseraUrl: certificateLink }
        : { certifications: selectedItems, linkedinUrl: certificateLink };

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
              className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${brandColor}`}
            >
              {isCoursera ? <CourseraIcon className="w-6 h-6" /> : <LinkedInIcon className="w-5 h-5 fill-current" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">{brandTitle}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Instant Verification
                </span>
              </div>
              <p className="text-xs text-[#494D4D] mt-0.5">
                {isCoursera
                  ? "Verify your Coursera certificate or search from 5,000+ certified courses."
                  : "Import verified licenses and certifications directly into your Skill Passport."}
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 sm:px-6 pt-4 border-b border-neutral-100 bg-white">
          <button
            type="button"
            onClick={() => {
              setActiveTab("verify_link");
              setErrorMessage("");
            }}
            className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "verify_link"
                ? isCoursera
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-[#0A66C2] text-[#0A66C2]"
                : "border-transparent text-[#494D4D] hover:text-[#111111]"
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Verify by Certificate Link / Code</span>
          </button>

          {isCoursera ? (
            <button
              type="button"
              onClick={() => {
                setActiveTab("catalog_search");
                setErrorMessage("");
              }}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "catalog_search"
                  ? "border-[#0056D2] text-[#0056D2]"
                  : "border-transparent text-[#494D4D] hover:text-[#111111]"
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Coursera Catalog</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setActiveTab("manual_entry");
                setErrorMessage("");
              }}
              className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
                activeTab === "manual_entry"
                  ? "border-[#0A66C2] text-[#0A66C2]"
                  : "border-transparent text-[#494D4D] hover:text-[#111111]"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Credential</span>
            </button>
          )}
        </div>

        {/* Sync Controls / Form Area */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-white flex flex-col gap-3">
          {activeTab === "verify_link" && (
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                {isCoursera
                  ? "Coursera Certificate Verification Link or Code"
                  : "Credly / LinkedIn Certification Link"}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={certificateLink}
                    onChange={(e) => setCertificateLink(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyByLink(certificateLink)}
                    placeholder={
                      isCoursera
                        ? "e.g. https://coursera.org/verify/YOUR_CODE or code..."
                        : "e.g. https://www.credly.com/badges/... or cert URL"
                    }
                    className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => verifyByLink(certificateLink)}
                  disabled={isLoading || isImporting}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50 ${
                    isCoursera ? "bg-[#0056D2] hover:bg-[#0047B3]" : "bg-[#0A66C2] hover:bg-[#084E96]"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verify & Fetch</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "catalog_search" && (
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">
                Search Completed Coursera Course / Specialization
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearchCourses(searchQuery)}
                    placeholder="e.g. Python, Machine Learning, Google Data, React, AWS..."
                    className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0056D2]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleSearchCourses(searchQuery)}
                  disabled={isLoading || isImporting}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0056D2] hover:bg-[#0047B3] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-3.5 h-3.5" />
                      <span>Search Catalog</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "manual_entry" && (
            <form onSubmit={handleAddManualCertification} className="flex flex-col gap-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Certification Title *</label>
                  <input
                    type="text"
                    required
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. AWS Solutions Architect, CKA, Meta Frontend"
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#111111] mb-1">Issuing Organization</label>
                  <input
                    type="text"
                    value={manualIssuer}
                    onChange={(e) => setManualIssuer(e.target.value)}
                    placeholder="e.g. Amazon Web Services, Google, Microsoft, Cisco"
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={manualCredId}
                    onChange={(e) => setManualCredId(e.target.value)}
                    placeholder="Credential ID or License Number (Optional)"
                    className="w-full px-3 py-2 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || isImporting || !manualTitle.trim()}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#084E96] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Verify & Add</span>
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center justify-between text-[11px] text-[#494D4D] pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isCoursera
                  ? "Direct cryptographic registry verification & skill extraction"
                  : "Verified credential registry & skill taxonomy extraction"}
              </span>
            </div>
            {items.length > 0 && (
              <span className="font-bold text-neutral-600">
                {items.length} {items.length === 1 ? "certificate" : "certificates"} ready
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
              <div className="text-xs font-bold text-[#111111]">Verifying Credential Details...</div>
              <p className="text-[11px] text-[#494D4D] max-w-xs">
                Extracting verified course completions, institutional signatures, and skill tags.
              </p>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                  Verified Digital Credentials
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
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                        isSelected
                          ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/15"
                          : "bg-white/80 border-black/5 hover:border-black/15 hover:bg-white"
                      }`}
                    >
                      {/* Checkbox */}
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                          isSelected ? "bg-emerald-600 text-white" : "border border-neutral-300 bg-neutral-50"
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
                            {item.skills.slice(0, 6).map((sk) => (
                              <span
                                key={sk}
                                className="px-2 py-0.5 rounded-md bg-[#F5F5F3] text-[10px] font-bold text-neutral-700 border border-black/5"
                              >
                                {sk}
                              </span>
                            ))}
                            {item.skills.length > 6 && (
                              <span className="text-[10px] text-neutral-400 font-bold self-center">
                                +{item.skills.length - 6} more
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
              <Award className="w-10 h-10 text-neutral-300" />
              <div className="text-xs font-bold text-[#111111]">
                {isCoursera ? "Enter Your Certificate Link or Search Courses" : "Enter Your Credly/LinkedIn Certificate Link"}
              </div>
              <p className="text-[11px] text-[#494D4D] max-w-sm">
                {isCoursera
                  ? "Paste your Coursera certificate verification link (https://coursera.org/verify/...) or search for your course to import verified credentials into your Skill Passport."
                  : "Paste your Credly badge URL or enter your certification title above to verify and attach it to your Skill Passport."}
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
