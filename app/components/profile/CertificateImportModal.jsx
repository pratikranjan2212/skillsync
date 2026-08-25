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
  FileCheck2,
  AlertCircle,
  Lock,
  Sparkles,
  Edit2,
  Save,
  Calendar,
} from "lucide-react";
import { LinkedInIcon, CredlyIcon } from "@/app/components/icons";

export default function CertificateImportModal({
  isOpen,
  onClose,
  provider = "linkedin", // "linkedin" | "credly"
  initialUrl = "",
  onImportSuccess,
}) {
  const isCredly = provider === "credly";
  const [inputValue, setInputValue] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [errorMessage, setErrorMessage] = useState("");
  const [isPrivateProfile, setIsPrivateProfile] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", issuer: "", issueDate: "", credentialId: "" });

  const brandTitle = isCredly ? "Credly Digital Badges" : "LinkedIn Certifications & Licenses";
  const brandColor = isCredly ? "bg-[#FF6B00]" : "bg-[#0A66C2]";
  const brandHoverColor = isCredly ? "hover:bg-[#E05E00]" : "hover:bg-[#084E96]";
  const brandLabel = "Credly Public Profile URL or Badge Link";
  const brandPlaceholder = "https://www.credly.com/users/username/badges or badge URL...";

  useEffect(() => {
    if (isOpen) {
      setInputValue(initialUrl || "");
      setPasteText("");
      setErrorMessage("");
      setIsPrivateProfile(false);
      setSuccessResult(null);
      setItems([]);
      setSelectedIds(new Set());
      setEditingId(null);

      if (initialUrl && isCredly) {
        verifyCredentials(initialUrl);
      }
    }
  }, [isOpen, provider, initialUrl, isCredly]);

  const verifyCredentials = async (inputUrl) => {
    const target = (inputUrl || inputValue).trim();
    if (!target) {
      setErrorMessage(
        "Please enter a valid Credly public profile URL (https://www.credly.com/users/username/badges) or badge link."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setIsPrivateProfile(false);
    setSuccessResult(null);

    try {
      const endpoint = `/api/credly/badges?badgeUrl=${encodeURIComponent(target)}&credlyUrl=${encodeURIComponent(target)}`;

      const res = await fetch(endpoint);
      const data = await res.json();

      if (!res.ok || !data.success) {
        if (data.isPrivate || (data.error && data.error.toLowerCase().includes("private"))) {
          setIsPrivateProfile(true);
          setErrorMessage(
            data.message ||
              "Your Credly profile appears to be set to Private. Credly does not allow public badge fetching for private accounts."
          );
        } else {
          throw new Error(data.error || data.message || "Could not verify credentials.");
        }
        setItems([]);
        setSelectedIds(new Set());
        return;
      }

      const list = data.badges || [];
      if (list.length === 0) {
        setErrorMessage(
          "No public badges found on this profile. Please make sure your profile has public badges or try entering an individual badge URL."
        );
        setItems([]);
        setSelectedIds(new Set());
      } else {
        setItems(list);
        setSelectedIds(new Set(list.map((item) => item.id)));
      }
    } catch (err) {
      console.error(`Verification error for ${provider}:`, err);
      setErrorMessage(err.message || "Failed to verify credentials.");
      setItems([]);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiExtract = async () => {
    const raw = pasteText.trim();
    if (!raw) {
      setErrorMessage("Please paste the text from your LinkedIn 'Licenses & certifications' section or resume.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessResult(null);

    try {
      const res = await fetch("/api/linkedin/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw, linkedinUrl: inputValue }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to extract certificates with Gemini AI.");
      }

      const list = data.certifications || [];
      if (list.length === 0) {
        setErrorMessage("Could not detect certificates in the pasted text. Please make sure to copy your LinkedIn certifications including titles and dates.");
        setItems([]);
        setSelectedIds(new Set());
      } else {
        setItems(list);
        setSelectedIds(new Set(list.map((item) => item.id)));
      }
    } catch (err) {
      console.error("AI extraction error:", err);
      setErrorMessage(err.message || "Failed to process text with Gemini AI.");
      setItems([]);
      setSelectedIds(new Set());
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (item, e) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditForm({
      title: item.title || "",
      issuer: item.issuer || "",
      issueDate: item.issueDate || "",
      credentialId: item.credentialId || "",
    });
  };

  const saveEdit = (id, e) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              title: editForm.title.trim() || item.title,
              issuer: editForm.issuer.trim() || item.issuer,
              issueDate: editForm.issueDate.trim() || item.issueDate,
              credentialId: editForm.credentialId.trim() || item.credentialId,
            }
          : item
      )
    );
    setEditingId(null);
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
      const endpoint = isCredly ? "/api/credly/import" : "/api/linkedin/import";
      const payload = isCredly
        ? { badges: selectedItems, credlyUrl: inputValue }
        : { certifications: selectedItems, linkedinUrl: inputValue };

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
              {isCredly ? <CredlyIcon className="w-6 h-6" /> : <LinkedInIcon className="w-5 h-5 fill-current" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">{brandTitle}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  Gemini AI Verified
                </span>
              </div>
              <p className="text-xs text-[#494D4D] mt-0.5">
                {isCredly
                  ? "Fetch and choose which verified badges to add from your public Credly profile into your Skill Passport."
                  : "Extract and import verified licenses, credentials, and certifications directly into your Skill Passport using Gemini AI."}
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

        {/* Sync Controls / Form Area */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 bg-white flex flex-col gap-3">
          {!isCredly ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#111111]">
                  Paste Text from LinkedIn &quot;Licenses &amp; certifications&quot; or Resume:
                </label>
                <span className="text-[11px] text-[#0A66C2] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Powered by Gemini AI
                </span>
              </div>
              <textarea
                rows={4}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                placeholder={`Example:
AWS Cloud Practitioner Essentials
Amazon Web Services
Issued Aug 2026
Credential ID AWS-12345
Skills: AWS, EC2, Cloud Architecture

Google AI Professional Certificate
Google
Issued Feb 2024 · Credential ID GCP-7788`}
                className="w-full p-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#0A66C2] resize-none"
              />
              <div className="flex items-center justify-between pt-1">
                <p className="text-[11px] text-[#494D4D]">
                  Tip: On your LinkedIn Profile, scroll to <strong>Licenses &amp; certifications</strong>, select all text and copy.
                </p>
                <button
                  type="button"
                  onClick={handleAiExtract}
                  disabled={isLoading || isImporting || !pasteText.trim()}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0A66C2] hover:bg-[#084E96] transition-all flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting Certificates...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract &amp; Verify with AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">{brandLabel}</label>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyCredentials(inputValue)}
                    placeholder={brandPlaceholder}
                    className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => verifyCredentials(inputValue)}
                  disabled={isLoading || isImporting}
                  className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-white ${brandColor} ${brandHoverColor} transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Fetching Badges...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Fetch Badges</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-[11px] text-[#494D4D] pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isCredly
                  ? "Live API sync with Credly public badge registry & skill taxonomy extraction"
                  : "Cryptographic SHA-256 verification & verified skill taxonomy mapping"}
              </span>
            </div>
            {items.length > 0 && (
              <span className="font-bold text-neutral-600">
                {items.length} {items.length === 1 ? "credential" : "credentials"} ready
              </span>
            )}
          </div>
        </div>

        {/* Body: Certificates list, Private Profile Alert, or empty states */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-[#F8F9FA] flex flex-col gap-3">
          {/* Private Profile Warning Dialog */}
          {isPrivateProfile && (
            <div className="p-5 bg-amber-50/90 border border-amber-300/80 rounded-3xl flex flex-col gap-3.5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-amber-950">
                    Credly Profile is Set to Private
                  </h4>
                  <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                    Credly security policies restrict automated badge fetching for private accounts. To fetch all your badges automatically, your Credly profile needs to be visible publicly.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-white/80 rounded-2xl border border-amber-200/60 flex flex-col gap-2 text-xs text-neutral-800 font-medium">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  How to make your Credly badges accessible:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-neutral-700">
                  <li>Log in to your account at <a href="https://www.credly.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">credly.com</a></li>
                  <li>Click your profile icon → <strong>Settings</strong> → <strong>Privacy + Security</strong></li>
                  <li>Toggle <strong>Public Profile Visibility</strong> to <strong>Enabled (Public)</strong></li>
                  <li>Save changes, then click <strong>Retry Verification</strong> below</li>
                </ol>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => verifyCredentials(inputValue)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Verification</span>
                </button>
                <a
                  href="https://www.credly.com/users/settings/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-bold border border-black/10 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Credly Privacy Settings</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                </a>
              </div>
            </div>
          )}

          {errorMessage && !isPrivateProfile && (
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
              <RefreshCw className="w-8 h-8 text-[#0A66C2] animate-spin" />
              <div className="text-xs font-bold text-[#111111]">
                {isCredly ? "Connecting to Credly Registry API..." : "Analyzing & Extracting Certificates..."}
              </div>
              <p className="text-[11px] text-[#494D4D] max-w-xs">
                Extracting exact certification titles, issuing bodies, dates of issue, credential IDs, and mapped skill tags.
              </p>
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#111111]">
                  Choose Credentials to Add ({selectedIds.size} of {items.length} Selected)
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
                  const isEditingThis = editingId === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => !isEditingThis && handleToggleSelect(item.id)}
                      className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                        isEditingThis
                          ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/15"
                          : isSelected
                          ? "bg-white border-emerald-500 shadow-md ring-2 ring-emerald-500/15 cursor-pointer"
                          : "bg-white/80 border-black/5 hover:border-black/15 hover:bg-white cursor-pointer"
                      }`}
                    >
                      {isEditingThis ? (
                        <div className="flex flex-col gap-2.5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                              Edit Certificate Details
                            </span>
                            <button
                              type="button"
                              onClick={(e) => saveEdit(item.id, e)}
                              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              Save
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">Certificate Title</label>
                              <input
                                type="text"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">Issuing Organization</label>
                              <input
                                type="text"
                                value={editForm.issuer}
                                onChange={(e) => setEditForm({ ...editForm, issuer: e.target.value })}
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">Date of Issue (e.g. Aug 2026, May 2024)</label>
                              <input
                                type="text"
                                value={editForm.issueDate}
                                onChange={(e) => setEditForm({ ...editForm, issueDate: e.target.value })}
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-600 block mb-0.5">Credential ID</label>
                              <input
                                type="text"
                                value={editForm.credentialId}
                                onChange={(e) => setEditForm({ ...editForm, credentialId: e.target.value })}
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-neutral-50 border border-black/10 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3.5">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded-lg flex items-center justify-center mt-1 shrink-0 transition-colors ${
                              isSelected ? "bg-emerald-600 text-white" : "border border-neutral-300 bg-neutral-50"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-3" />}
                          </div>

                          {/* Badge Thumbnail / Icon */}
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-12 h-12 object-contain shrink-0 rounded-lg p-1 bg-neutral-50 border border-black/5"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center shrink-0 border border-[#0A66C2]/20">
                              <Award className="w-6 h-6" />
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs sm:text-sm font-extrabold text-[#111111] leading-snug">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => startEdit(item, e)}
                                  className="px-2 py-0.5 rounded text-[10px] font-bold text-neutral-500 hover:text-blue-600 hover:bg-neutral-100 flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Edit details"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified</span>
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#494D4D] mt-1 font-medium">
                              <span className="font-semibold text-neutral-900">{item.issuer}</span>
                              <span>•</span>
                              <span className="inline-flex items-center gap-1 text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                                <Calendar className="w-3 h-3 text-blue-600" />
                                Issued: {item.issueDate}
                              </span>
                              {item.credentialId && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-[10px] bg-neutral-100 px-1.5 py-0.2 rounded text-neutral-600">
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

                            {/* Description */}
                            {item.description && (
                              <p className="text-[11px] text-neutral-500 mt-2 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : !isPrivateProfile ? (
            <div className="py-10 flex flex-col items-center justify-center gap-2 text-center">
              <Award className="w-10 h-10 text-neutral-300" />
              <div className="text-xs font-bold text-[#111111]">
                {isCredly
                  ? "Enter Your Credly Public Profile URL"
                  : "Paste your LinkedIn Certificates or Resume above"}
              </div>
              <p className="text-[11px] text-[#494D4D] max-w-sm leading-relaxed">
                {isCredly
                  ? "Enter your Credly public profile (e.g. https://www.credly.com/users/username/badges) to fetch all verified badges."
                  : "Gemini AI will instantly extract all credentials, exact dates of issue, credential IDs, issuing bodies, and skill tags."}
              </p>
            </div>
          ) : null}
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
                  <span>Importing Credentials to Passport...</span>
                </>
              ) : (
                <>
                  <FileCheck2 className="w-4 h-4" />
                  <span>
                    Add {selectedIds.size > 0 ? `${selectedIds.size} Selected ` : ""}to Passport
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
