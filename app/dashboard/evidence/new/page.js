"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import jsQR from "jsqr";
import {
  FilePlus,
  FileEdit,
  QrCode,
  Sparkles,
  Check,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Link2,
  FileUp,
  FileCheck,
  Award,
  Layers,
  X,
  RefreshCw,
  Search,
  Plus,
  AlertCircle,
  FolderGit2,
  CheckSquare,
  Square,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Badge from "@/app/components/ui/Badge";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";
import { GitHubIcon } from "@/app/components/icons";
import { STUDENT_INTERN_SKILLS, PRELOADED_SKILL_RECOMMENDATIONS as SKILL_TAXONOMY_OPTIONS } from "@/app/data/studentInternSkills";

function GitHubLogo({ className = "w-4 h-4 text-emerald-400" }) {
  return <GitHubIcon className={className} />;
}

async function fetchUserGitHubRepos() {
  const res = await fetch("/api/github/repos");
  if (!res.ok) throw new Error("Failed to fetch GitHub repositories");
  return res.json();
}

async function fetchUserEvidence() {
  const res = await fetch("/api/evidence");
  if (!res.ok) return [];
  const json = await res.json();
  return json.evidence || [];
}

const normalizeUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  let cleaned = url.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, "").replace(/^www\./, "");
  cleaned = cleaned.replace(/\.git\/?$/, "");
  cleaned = cleaned.replace(/\/+$/, "");
  return cleaned;
};

export default function AddEvidencePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Mode: "bulk" (AI multi-certificate upload) vs "manual" (Manual upload / single submission)
  const [uploadMode, setUploadMode] = useState("bulk");

  // GitHub Multi-Select state
  const [isGhMultiModalOpen, setIsGhMultiModalOpen] = useState(false);
  const [selectedGhRepoUrls, setSelectedGhRepoUrls] = useState(new Set());
  const [ghRepoSearch, setGhRepoSearch] = useState("");
  const [isImportingGhRepos, setIsImportingGhRepos] = useState(false);
  const [ghImportSuccess, setGhImportSuccess] = useState(null);

  // Manual form states
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [isSkillFocused, setIsSkillFocused] = useState(false);
  const skillInputRef = React.useRef(null);
  const [isQrDetected, setIsQrDetected] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedResult, setAssignedResult] = useState(null);
  const [submitError, setSubmitError] = useState("");

  // Bulk certificate upload states
  const [bulkFiles, setBulkFiles] = useState([]);
  const [isBulkExtracting, setIsBulkExtracting] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [selectedBulkIds, setSelectedBulkIds] = useState(new Set());
  const [bulkImportSuccess, setBulkImportSuccess] = useState(null);
  const [bulkError, setBulkError] = useState("");
  const [editingCertId, setEditingCertId] = useState(null);
  const [editingCertData, setEditingCertData] = useState({ title: "", issuer: "", issueDate: "", credentialId: "" });
  const bulkFileInputRef = React.useRef(null);

  const {
    data: ghData,
    isLoading: isGhLoading,
  } = useQuery({
    queryKey: ["user-github-repos"],
    queryFn: fetchUserGitHubRepos,
    enabled: isAuthenticated,
    staleTime: 60000,
  });

  const { data: existingEvidence = [] } = useQuery({
    queryKey: ["dash-evidence"],
    queryFn: fetchUserEvidence,
    enabled: isAuthenticated,
    staleTime: 30000,
  });

  const ghRepos = ghData?.repos || [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "coursework",
      title: "",
      description: "",
      fileUrl: "",
    },
  });

  const watchedFileUrl = watch("fileUrl");
  const watchedTitle = watch("title");

  const isRepoAlreadyAdded = (repoUrl, repoName) => {
    if (!repoUrl && !repoName) return false;
    const normUrl = normalizeUrl(repoUrl);
    const normName = (repoName || "").trim().toLowerCase();

    return existingEvidence.some((ev) => {
      const existingUrl = normalizeUrl(ev.fileUrl);
      const existingTitle = (ev.title || "").trim().toLowerCase();
      return (normUrl && existingUrl && normUrl === existingUrl) || (normName && existingTitle && normName === existingTitle);
    });
  };

  const isCurrentDuplicate = React.useMemo(() => {
    if (!watchedFileUrl && !watchedTitle) return { isDuplicate: false, reason: "" };

    const normUrl = normalizeUrl(watchedFileUrl);
    const normTitle = (watchedTitle || "").trim().toLowerCase();

    const urlMatch = normUrl
      ? existingEvidence.find((ev) => {
          const evUrl = normalizeUrl(ev.fileUrl);
          return evUrl && evUrl === normUrl;
        })
      : null;

    if (urlMatch) {
      return {
        isDuplicate: true,
        reason: `This URL has already been added as "${urlMatch.title}" (${urlMatch.verificationTier}).`,
      };
    }

    const titleMatch = normTitle
      ? existingEvidence.find((ev) => (ev.title || "").trim().toLowerCase() === normTitle)
      : null;

    if (titleMatch) {
      return {
        isDuplicate: true,
        reason: `A project with the title "${titleMatch.title}" already exists in your Skill Passport.`,
      };
    }

    return { isDuplicate: false, reason: "" };
  }, [watchedFileUrl, watchedTitle, existingEvidence]);

  // Single repo selection handler
  const handleSelectRepo = (repoUrl) => {
    const selected = ghRepos.find((r) => r.htmlUrl === repoUrl);
    if (!selected) return;

    if (isRepoAlreadyAdded(selected.htmlUrl, selected.name)) {
      setSubmitError(`"${selected.name}" has already been submitted to your Skill Passport.`);
      return;
    }

    setSubmitError("");
    setValue("title", selected.name);
    setValue("type", "project");
    setValue("fileUrl", selected.htmlUrl);
    if (selected.description) {
      setValue("description", selected.description);
    }

    const newSkills = [...selectedSkills];
    if (selected.language && !newSkills.includes(selected.language)) {
      newSkills.push(selected.language);
    }

    if (selected.topics && Array.isArray(selected.topics)) {
      selected.topics.forEach((topic) => {
        const matching = SKILL_TAXONOMY_OPTIONS.find((s) => s.toLowerCase() === topic.toLowerCase());
        const skillName = matching || topic.charAt(0).toUpperCase() + topic.slice(1);
        if (!newSkills.includes(skillName)) {
          newSkills.push(skillName);
        }
      });
    }

    setSelectedSkills(newSkills);
  };

  // GitHub Multi-Select handlers
  const handleToggleSelectGhRepo = (url) => {
    const next = new Set(selectedGhRepoUrls);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    setSelectedGhRepoUrls(next);
  };

  const handleToggleSelectAllGhRepos = (availableRepos) => {
    if (selectedGhRepoUrls.size === availableRepos.length) {
      setSelectedGhRepoUrls(new Set());
    } else {
      setSelectedGhRepoUrls(new Set(availableRepos.map((r) => r.htmlUrl)));
    }
  };

  // Bulk import multiple GitHub projects at once
  const handleBulkImportGhRepos = async () => {
    const selectedRepos = ghRepos.filter((r) => selectedGhRepoUrls.has(r.htmlUrl));
    if (selectedRepos.length === 0) return;

    setIsImportingGhRepos(true);
    setSubmitError("");

    const items = selectedRepos.map((repo) => {
      const skills = [repo.language, ...(repo.topics || [])].filter(Boolean);
      const title = repo.name
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

      return {
        title,
        description: repo.description || `GitHub project repository (${repo.language || "Codebase"}).`,
        type: "project",
        fileUrl: repo.htmlUrl,
        claimedSkills: skills,
        verificationTier: "verified-high",
        verificationReason: `GitHub repository verified: ${repo.name} (${repo.language || "Software Engineering"})`,
      };
    });

    try {
      const res = await fetch("/api/evidence/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import GitHub repositories.");
      }

      setGhImportSuccess(data);
      setIsGhMultiModalOpen(false);
      setSelectedGhRepoUrls(new Set());

      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["skill-passport"] }),
        queryClient.invalidateQueries({ queryKey: ["dash-passport"] }),
        queryClient.invalidateQueries({ queryKey: ["dash-evidence"] }),
        queryClient.invalidateQueries({ queryKey: ["evidence"] }),
        queryClient.invalidateQueries({ queryKey: ["user-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
      ]);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("GitHub bulk import error:", err);
      setSubmitError(err.message || "Failed to import GitHub repositories.");
    } finally {
      setIsImportingGhRepos(false);
    }
  };

  const addCustomSkill = (skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills((prev) => [...prev, trimmed]);
    }
    setCustomSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            setIsQrDetected(true);
            setQrCodeData(code.data);
            setValue("fileUrl", `https://verified-qr.org/token/${code.data.substring(0, 12)}`);
          } else {
            setIsQrDetected(false);
            setQrCodeData("");
          }
        };
        img.src = event.target?.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBulkFilesSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setBulkError("");
    setBulkImportSuccess(null);

    const validFiles = files.filter((f) => f.type.startsWith("image/") || f.name.endsWith(".pdf") || f.type === "application/pdf");
    
    if (validFiles.length === 0) {
      setBulkError("Please select valid image (PNG, JPG, WEBP) or PDF certificate files.");
      return;
    }

    const filePromises = validFiles.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          resolve({
            name: file.name,
            size: file.size,
            type: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
            base64: ev.target?.result || "",
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((loaded) => {
      setBulkFiles((prev) => [...prev, ...loaded]);
    });
  };

  const removeBulkFile = (index) => {
    setBulkFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkExtractWithGemini = async () => {
    if (bulkFiles.length === 0) {
      setBulkError("Please select certificate files first.");
      return;
    }

    setIsBulkExtracting(true);
    setBulkError("");
    setBulkImportSuccess(null);

    try {
      const res = await fetch("/api/evidence/extract-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: bulkFiles }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to extract certificates with Gemini AI.");
      }

      const extracted = data.certificates || [];
      if (extracted.length === 0) {
        setBulkError("Could not detect certificates in the uploaded documents. Please check file clarity.");
      } else {
        setExtractedItems(extracted);
        setSelectedBulkIds(new Set(extracted.map((c) => c.id)));
      }
    } catch (err) {
      console.error("Bulk AI extraction error:", err);
      setBulkError(err.message || "Failed to process files with Gemini AI.");
    } finally {
      setIsBulkExtracting(false);
    }
  };

  const handleToggleSelectCert = (id) => {
    const next = new Set(selectedBulkIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedBulkIds(next);
  };

  const handleToggleSelectAllCerts = () => {
    if (selectedBulkIds.size === extractedItems.length) {
      setSelectedBulkIds(new Set());
    } else {
      setSelectedBulkIds(new Set(extractedItems.map((c) => c.id)));
    }
  };

  const handleRemoveExtractedCert = (id) => {
    setExtractedItems((prev) => prev.filter((c) => c.id !== id));
    setSelectedBulkIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const startEditCert = (item) => {
    setEditingCertId(item.id);
    setEditingCertData({
      title: item.title || "",
      issuer: item.issuer || "",
      issueDate: item.issueDate || "",
      credentialId: item.credentialId || "",
    });
  };

  const saveEditCert = (id) => {
    setExtractedItems((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              title: editingCertData.title.trim() || c.title,
              issuer: editingCertData.issuer.trim() || c.issuer,
              issueDate: editingCertData.issueDate.trim() || c.issueDate,
              credentialId: editingCertData.credentialId.trim() || c.credentialId,
            }
          : c
      )
    );
    setEditingCertId(null);
  };

  const handleImportSelectedCerts = async () => {
    const itemsToImport = extractedItems.filter((c) => selectedBulkIds.has(c.id));
    if (itemsToImport.length === 0) {
      setBulkError("Please select at least one certificate to import.");
      return;
    }

    setIsSubmitting(true);
    setBulkError("");

    try {
      const res = await fetch("/api/evidence/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToImport }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to import certificates.");
      }

      setBulkImportSuccess(data);
      await Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["skill-passport"] }),
        queryClient.invalidateQueries({ queryKey: ["dash-passport"] }),
        queryClient.invalidateQueries({ queryKey: ["dash-evidence"] }),
        queryClient.invalidateQueries({ queryKey: ["evidence"] }),
        queryClient.invalidateQueries({ queryKey: ["user-profile"] }),
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
      ]);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      console.error("Import error:", err);
      setBulkError(err.message || "Failed to import certificates.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    setSubmitError("");
    if (isCurrentDuplicate.isDuplicate) {
      setSubmitError(isCurrentDuplicate.reason);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          claimedSkills: selectedSkills,
          hasQrCode: isQrDetected,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setSubmitError("");
        setAssignedResult(json.evidence);
        await Promise.allSettled([
          queryClient.invalidateQueries({ queryKey: ["skill-passport"] }),
          queryClient.invalidateQueries({ queryKey: ["dash-passport"] }),
          queryClient.invalidateQueries({ queryKey: ["dash-evidence"] }),
          queryClient.invalidateQueries({ queryKey: ["evidence"] }),
          queryClient.invalidateQueries({ queryKey: ["user-profile"] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
        ]);
        router.refresh();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        setSubmitError(json.error || "Failed to submit evidence. Please try again.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("An unexpected error occurred while submitting evidence.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen pb-12 bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-2xl 2xl:max-w-3xl mx-auto px-3.5 sm:px-6 w-full">
          <AuthRequiredView
            badgeText="Evidence Ingestion & Verification"
            badgeIcon={FilePlus}
            badgeColor="emerald"
            title="Submit Evidence Access"
            subtitle="Sign in to upload coursework transcripts, GitHub projects, and credentials for automated tier verification."
            sectionName="Evidence Submission"
            backLink="/dashboard"
            backText="Back to Dashboard"
            features={[
              {
                icon: ShieldCheck,
                title: "Multimodal Gemini AI Extraction",
                desc: "Instant course title, date, credential ID, and skill extraction from multiple certificate files at once.",
              },
              {
                icon: Layers,
                title: "Taxonomy Skill Mapping",
                desc: "Automatic tagging and verification against standardized SkillSync taxonomy categories.",
              },
              {
                icon: Award,
                title: "Direct Passport Citation",
                desc: "Verified submissions instantly citation-back your skills in your official Skill Passport.",
              },
            ]}
          />
        </main>
      </div>
    );
  }

  // Filtered available GitHub repositories for multi-select
  const availableGhRepos = ghRepos.filter((r) => {
    if (isRepoAlreadyAdded(r.htmlUrl, r.name)) return false;
    if (!ghRepoSearch.trim()) return true;
    const q = ghRepoSearch.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.language && r.language.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-3xl 2xl:max-w-4xl mx-auto px-3.5 sm:px-6">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Evidence Ingestion &amp; Verification
              </span>
              <h1 className="text-xl sm:text-3xl font-extrabold text-[#111111] mt-2">
                Submit Certificates &amp; Evidence
              </h1>
              <p className="text-xs text-[#494D4D] mt-1">
                Upload certificates or GitHub projects for automated AI extraction, multi-repo import, and cryptographic Passport verification.
              </p>
            </div>

            {/* Mode Switcher: Bulk AI Upload vs Manual Upload */}
            <div className="inline-flex p-1 bg-[#F5F5F3] rounded-2xl border border-black/5 shrink-0 self-start sm:self-center">
              <button
                type="button"
                onClick={() => setUploadMode("bulk")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  uploadMode === "bulk"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bulk AI Upload</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-extrabold uppercase">
                  Multi
                </span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode("manual")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  uploadMode === "manual"
                    ? "bg-neutral-900 text-white shadow-xs"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Manual Upload</span>
              </button>
            </div>
          </div>

          {/* GitHub Bulk Import Success Notification */}
          {ghImportSuccess && (
            <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    GitHub Projects Added!
                  </div>
                  <div className="text-sm font-bold text-emerald-950 mt-0.5">
                    {ghImportSuccess.message}
                  </div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    Redirecting to your dashboard...
                  </div>
                </div>
              </div>
              <Badge tier="verified-high" />
            </div>
          )}

          {/* ======================================================== */}
          {/* BULK UPLOAD MODE (GEMINI AI MULTIMODAL EXTRACTION) */}
          {/* ======================================================== */}
          {uploadMode === "bulk" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              {/* Success Notification */}
              {bulkImportSuccess && (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 animate-in fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                        Import Successful!
                      </div>
                      <div className="text-sm font-bold text-emerald-950 mt-0.5">
                        {bulkImportSuccess.message}
                      </div>
                      <div className="text-xs text-emerald-700 mt-0.5">
                        Redirecting to your dashboard...
                      </div>
                    </div>
                  </div>
                  <Badge tier="verified-high" />
                </div>
              )}

              {/* Upload Dropzone */}
              <div className="bg-[#F8F9FA] rounded-3xl p-6 sm:p-8 border-2 border-dashed border-neutral-300/80 hover:border-emerald-500 transition-colors flex flex-col items-center justify-center text-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-md border border-black/5 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <FileUp className="w-7 h-7" />
                </div>

                <div className="max-w-md">
                  <h3 className="text-sm font-bold text-[#111111]">
                    Choose Multiple Certificates or Drag &amp; Drop
                  </h3>
                  <p className="text-xs text-[#494D4D] mt-1 leading-relaxed">
                    Upload multiple course certificates, diplomas, completion badges, or transcripts (PNG, JPG, WEBP, PDF). Gemini AI extracts titles, dates, credential IDs, and skills all at once.
                  </p>
                </div>

                <input
                  ref={bulkFileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleBulkFilesSelect}
                  className="hidden"
                />

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => bulkFileInputRef.current?.click()}
                    className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Select Certificate Files</span>
                  </button>
                  {bulkFiles.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setBulkFiles([]);
                        setExtractedItems([]);
                        setSelectedBulkIds(new Set());
                      }}
                      className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Clear Files
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-mono text-neutral-400">
                  Supported formats: PNG, JPG, JPEG, WEBP, PDF (Up to 15 certificates per batch)
                </span>
              </div>

              {/* Selected Files Preview Chips */}
              {bulkFiles.length > 0 && (
                <div className="flex flex-col gap-3 p-4 bg-neutral-50 rounded-2xl border border-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111]">
                      Selected Files ({bulkFiles.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleBulkExtractWithGemini}
                      disabled={isBulkExtracting}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isBulkExtracting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Extracting with Gemini AI...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Extract All with Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {bulkFiles.map((file, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-black/10 text-xs font-semibold text-neutral-800 shadow-2xs"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="max-w-45 truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeBulkFile(idx)}
                          className="p-0.5 text-neutral-400 hover:text-rose-500 rounded-md transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Notification */}
              {bulkError && (
                <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                  <div className="flex-1">{bulkError}</div>
                </div>
              )}

              {/* Loading Banner */}
              {isBulkExtracting && (
                <div className="p-6 bg-emerald-50/70 border border-emerald-200 rounded-3xl flex flex-col items-center justify-center text-center gap-3 animate-in fade-in">
                  <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                  <div className="text-sm font-bold text-emerald-950">
                    Analyzing Documents with Multimodal Gemini AI...
                  </div>
                  <p className="text-xs text-emerald-800 max-w-md">
                    Extracting course titles, completion dates, accredited institutions, credential IDs, and mapped skill taxonomies simultaneously.
                  </p>
                </div>
              )}

              {/* Extracted Certificates Review Cards */}
              {extractedItems.length > 0 && !isBulkExtracting && (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-[#111111]">
                        AI Extracted Certificates ({extractedItems.length})
                      </h2>
                      <p className="text-xs text-[#494D4D]">
                        Review extracted fields, edit details if needed, and choose which certificates to add.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleToggleSelectAllCerts}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
                    >
                      {selectedBulkIds.size === extractedItems.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {extractedItems.map((item) => {
                      const isSelected = selectedBulkIds.has(item.id);
                      const isEditing = editingCertId === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isSelected
                              ? "bg-white border-emerald-500/60 shadow-md ring-2 ring-emerald-500/10"
                              : "bg-neutral-50/70 border-black/5 opacity-75"
                          }`}
                        >
                          {isEditing ? (
                            /* Inline Edit Mode */
                            <div className="flex flex-col gap-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                    Certificate / Course Title
                                  </label>
                                  <input
                                    type="text"
                                    value={editingCertData.title}
                                    onChange={(e) =>
                                      setEditingCertData((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 bg-white rounded-xl border border-black/10 text-xs font-bold"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                    Issuing Organization / University
                                  </label>
                                  <input
                                    type="text"
                                    value={editingCertData.issuer}
                                    onChange={(e) =>
                                      setEditingCertData((prev) => ({ ...prev, issuer: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 bg-white rounded-xl border border-black/10 text-xs font-bold"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                    Issue Date (e.g. Aug 2026)
                                  </label>
                                  <input
                                    type="text"
                                    value={editingCertData.issueDate}
                                    onChange={(e) =>
                                      setEditingCertData((prev) => ({ ...prev, issueDate: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 bg-white rounded-xl border border-black/10 text-xs font-medium"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                                    Credential ID
                                  </label>
                                  <input
                                    type="text"
                                    value={editingCertData.credentialId}
                                    onChange={(e) =>
                                      setEditingCertData((prev) => ({ ...prev, credentialId: e.target.value }))
                                    }
                                    className="w-full px-3 py-2 bg-white rounded-xl border border-black/10 text-xs font-medium font-mono"
                                  />
                                </div>
                              </div>
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => setEditingCertId(null)}
                                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold rounded-lg cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => saveEditCert(item.id)}
                                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          ) : (
                            /* Normal Card View */
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectCert(item.id)}
                                  className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 shrink-0 transition-colors cursor-pointer ${
                                    isSelected
                                      ? "bg-emerald-600 text-white"
                                      : "border border-neutral-300 hover:border-neutral-500 bg-white"
                                  }`}
                                >
                                  {isSelected && <Check className="w-3.5 h-3.5" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xs sm:text-sm font-extrabold text-[#111111]">
                                      {item.title}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                      {item.type}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#494D4D] mt-1 font-medium">
                                    <span><strong>Issuer:</strong> {item.issuer}</span>
                                    <span>•</span>
                                    <span><strong>Date:</strong> {item.issueDate}</span>
                                    {item.credentialId && (
                                      <>
                                        <span>•</span>
                                        <span className="font-mono text-[11px]">ID: {item.credentialId}</span>
                                      </>
                                    )}
                                  </div>

                                  {/* Skills Tags */}
                                  {item.skills && item.skills.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                                      {item.skills.map((skill, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 text-[10px] font-bold"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => startEditCert(item)}
                                  className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer text-xs font-semibold"
                                  title="Edit certificate details"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExtractedCert(item.id)}
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Remove certificate"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Bulk Action Submit Bar */}
                  <div className="p-4 sm:p-5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <div className="text-xs font-bold text-neutral-700">
                      {selectedBulkIds.size} of {extractedItems.length} certificates selected for import
                    </div>

                    <button
                      type="button"
                      onClick={handleImportSelectedCerts}
                      disabled={isSubmitting || selectedBulkIds.size === 0}
                      className="w-full sm:w-auto px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                          <span>Importing into Skill Passport...</span>
                        </>
                      ) : (
                        <>
                          <span>Add {selectedBulkIds.size} Verified Certificates to Passport</span>
                          <ArrowRight className="w-4 h-4 text-emerald-400" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* MANUAL UPLOAD MODE (SINGLE FORM + MULTI-REPO SUPPORT) */}
          {/* ======================================================== */}
          {uploadMode === "manual" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-200">
              {assignedResult && (
                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between gap-4 animate-in fade-in">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">Verification Complete!</div>
                    <div className="text-sm font-bold text-emerald-950 mt-0.5">{assignedResult.title}</div>
                    <div className="text-xs text-emerald-800 mt-1">{assignedResult.verificationReason}</div>
                  </div>
                  <Badge tier={assignedResult.verificationTier} />
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">Evidence Category Type</label>
                  <select
                    {...register("type", { required: true })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="coursework">Coursework &amp; Transcript</option>
                    <option value="project">GitHub Code Project</option>
                    <option value="competition">Hackathon / Competition Award</option>
                    <option value="micro-credential">Micro-Credential Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">Title / Course Name</label>
                  <input
                    type="text"
                    placeholder="e.g. CS229 Machine Learning / ETL Data Pipeline Project"
                    {...register("title", { required: "Title is required" })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.title && <p className="text-[11px] text-rose-600 mt-1">{errors.title.message}</p>}
                </div>

                <div>
                  <label className="text-xs font-bold text-[#111111] mb-1.5 flex items-center justify-between">
                    <span>Description &amp; Key Highlights</span>
                    <span className="text-[10px] text-neutral-400 font-normal">Optional</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detail what you built, coursework topics, grades, or technologies used..."
                    {...register("description")}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-emerald-600" />
                      <span>Upload File / Certificate Image (Optional jsQR Scan)</span>
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">PNG / JPG / PDF</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-neutral-800"
                  />

                  {isQrDetected && (
                    <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        <strong>QR Code Detected!</strong> Pre-flagged as an instant verification candidate.
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>External Link (GitHub Repo / Credential URL / Transcript Link)</span>
                    </label>
                    {ghData?.hasPermissions && ghRepos.length > 0 && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsGhMultiModalOpen(true)}
                          className="text-[11px] text-emerald-700 font-extrabold bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Select Multiple Repos ({ghRepos.length})</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* GitHub Repositories Dropdown or Permission Action Banner */}
                  {isGhLoading ? (
                    <div className="px-4 py-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center gap-2 text-xs text-neutral-500">
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>Checking linked GitHub repositories...</span>
                    </div>
                  ) : ghData?.hasPermissions && ghRepos.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      <div className="relative">
                        <select
                          onChange={(e) => {
                            const selectedUrl = e.target.value;
                            if (selectedUrl) {
                              handleSelectRepo(selectedUrl);
                            }
                          }}
                          defaultValue=""
                          className="w-full px-4 py-3 rounded-2xl bg-emerald-50/60 border border-emerald-300/80 text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-2xs"
                        >
                          <option value="" disabled>
                            -- Choose a GitHub Repository ({ghRepos.length} available) --
                          </option>
                          {ghRepos.map((repo) => {
                            const alreadyAdded = isRepoAlreadyAdded(repo.htmlUrl, repo.name);
                            return (
                              <option key={repo.id} value={repo.htmlUrl} disabled={alreadyAdded}>
                                {alreadyAdded ? "✓" : "📁"} {repo.name} {repo.language ? `• ${repo.language}` : ""} {alreadyAdded ? "• [Already in Passport]" : (repo.isPrivate ? "• [Private]" : "")}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      
                      <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] text-neutral-500">
                          Selecting fills fields automatically. Want to import multiple projects?
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsGhMultiModalOpen(true)}
                          className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
                        >
                          Select Multiple at Once &rarr;
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-neutral-900 text-white rounded-2xl border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                          <GitHubLogo className="w-4.5 h-4.5 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>Load Your GitHub Repositories in Dropdown</span>
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            Allow repository permissions to auto-select or bulk import projects from your GitHub account
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => signIn("github", { callbackUrl: "/dashboard/evidence/new" })}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                      >
                        <GitHubLogo className="w-3.5 h-3.5 text-white" />
                        <span>Allow Permissions</span>
                      </button>
                    </div>
                  )}

                  {/* Direct URL Input */}
                  <input
                    type="url"
                    placeholder="https://github.com/username/project or any credential URL"
                    {...register("fileUrl")}
                    onChange={(e) => {
                      setSubmitError("");
                      register("fileUrl").onChange(e);
                    }}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  {/* Duplicate Warning Banner */}
                  {isCurrentDuplicate.isDuplicate && (
                    <div className="p-3.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="flex-1">
                        <div className="font-bold">Project Already Added to Passport</div>
                        <div className="text-[11px] text-amber-800 mt-0.5">{isCurrentDuplicate.reason}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Claimed Skills Selector */}
                <div>
                  <label className="text-xs font-bold text-[#111111] mb-2 flex items-center justify-between">
                    <span>Select or Add Claimed Skills ({selectedSkills.length})</span>
                    <span className="text-[10px] text-neutral-400">Match against Skill Taxonomy</span>
                  </label>

                  <div className="relative mb-3">
                    <div
                      className={`relative flex items-center bg-[#F8F9FA] rounded-2xl border transition-all duration-300 ease-out ${
                        isSkillFocused
                          ? "scale-[1.015] bg-white border-emerald-500 shadow-xl shadow-emerald-500/10 ring-4 ring-emerald-500/15"
                          : "border-black/5 hover:border-black/10"
                      }`}
                    >
                      <Search
                        className={`w-4 h-4 ml-4 shrink-0 transition-colors duration-300 ${
                          isSkillFocused ? "text-emerald-600" : "text-neutral-400"
                        }`}
                      />
                      <input
                        ref={skillInputRef}
                        type="text"
                        value={customSkillInput}
                        onFocus={() => setIsSkillFocused(true)}
                        onBlur={() => {
                          setTimeout(() => setIsSkillFocused(false), 200);
                        }}
                        onChange={(e) => setCustomSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (customSkillInput.trim()) {
                              const matching = SKILL_TAXONOMY_OPTIONS.find(
                                (sk) =>
                                  !selectedSkills.includes(sk) &&
                                  sk.toLowerCase() === customSkillInput.trim().toLowerCase()
                              );
                              addCustomSkill(matching || customSkillInput);
                              setIsSkillFocused(false);
                            }
                          } else if (e.key === "Escape") {
                            setIsSkillFocused(false);
                            skillInputRef.current?.blur();
                          }
                        }}
                        placeholder="Type a skill (e.g. React, Python, SQL, Node js)..."
                        className="w-full px-3.5 py-3 bg-transparent text-xs sm:text-sm font-semibold text-[#111111] placeholder:text-neutral-400 placeholder:font-normal focus:outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          addCustomSkill(customSkillInput);
                        }}
                        disabled={!customSkillInput.trim()}
                        className="mr-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-40 disabled:hover:bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Recommendations Dropdown */}
                    {isSkillFocused && customSkillInput.trim().length > 0 && (
                      <div
                        className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-black/10 z-50 p-2 max-h-64 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                          <span>Recommended Skills</span>
                          <span className="text-[9px] font-normal text-neutral-400">Click to add</span>
                        </div>

                        {(() => {
                          const q = customSkillInput.trim().toLowerCase();
                          const startsWith = [];
                          const contains = [];

                          for (const s of STUDENT_INTERN_SKILLS) {
                            if (selectedSkills.includes(s.name)) continue;
                            const sLower = s.name.toLowerCase();
                            if (sLower.startsWith(q)) {
                              startsWith.push(s);
                            } else if (sLower.includes(q)) {
                              contains.push(s);
                            }
                          }

                          const matching = [...startsWith, ...contains].slice(0, 16);

                          if (matching.length > 0) {
                            return (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                                {matching.map((sk) => (
                                  <button
                                    key={sk.name}
                                    type="button"
                                    onClick={() => {
                                      addCustomSkill(sk.name);
                                      setIsSkillFocused(false);
                                    }}
                                    className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-emerald-50 text-left transition-colors group cursor-pointer"
                                  >
                                    <div className="flex items-center gap-2 min-w-0">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform shrink-0" />
                                      <span className="text-xs font-bold text-neutral-800 group-hover:text-emerald-950 truncate">
                                        {sk.name}
                                      </span>
                                      {sk.category && (
                                        <span className="text-[9px] font-semibold text-neutral-400 bg-neutral-100 group-hover:bg-emerald-100 group-hover:text-emerald-800 px-1.5 py-0.2 rounded-md shrink-0">
                                          {sk.category}
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-100/70 px-2 py-0.5 rounded-md shrink-0 ml-2">
                                      + Add
                                    </span>
                                  </button>
                                ))}
                              </div>
                            );
                          }

                          if (customSkillInput.trim()) {
                            return (
                              <div className="p-3 text-center text-xs text-neutral-500">
                                No matching preset. Press{" "}
                                <kbd className="px-1.5 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-800">
                                  Enter
                                </kbd>{" "}
                                or click <strong className="text-neutral-900">+ Add</strong> to save custom skill.
                              </div>
                            );
                          }

                          return (
                            <div className="p-3 text-center text-xs text-neutral-400">All preset skills added!</div>
                          );
                        })()}

                        {customSkillInput.trim() &&
                          !SKILL_TAXONOMY_OPTIONS.some(
                            (sk) => sk.toLowerCase() === customSkillInput.trim().toLowerCase()
                          ) &&
                          !selectedSkills.includes(customSkillInput.trim()) && (
                            <button
                              type="button"
                              onClick={() => {
                                addCustomSkill(customSkillInput.trim());
                                setIsSkillFocused(false);
                              }}
                              className="w-full mt-1.5 pt-2 border-t border-neutral-100 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-neutral-50 hover:bg-emerald-50 text-left transition-colors cursor-pointer"
                            >
                              <span className="text-xs font-bold text-emerald-800">
                                Add "{customSkillInput.trim()}" as custom skill
                              </span>
                              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                Custom
                              </span>
                            </button>
                          )}
                      </div>
                    )}
                  </div>

                  {selectedSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-2 bg-[#F8F9FA] rounded-2xl border border-black/5 min-h-12 items-center">
                      {selectedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-neutral-900 text-white shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            title={`Remove ${skill}`}
                            className="ml-1 p-0.5 text-neutral-400 hover:text-rose-400 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center bg-[#F8F9FA] rounded-xl border border-dashed border-neutral-300 text-xs font-medium text-neutral-400">
                      No skills selected yet. Choose from the dropdown or type a custom skill above.
                    </div>
                  )}
                </div>

                {submitError && (
                  <div className="p-4 bg-rose-50 border border-rose-300 text-rose-900 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4.5 h-4.5 text-rose-600 shrink-0" />
                    <div className="flex-1">
                      <div className="font-bold">Submission Not Allowed</div>
                      <div className="text-[11px] text-rose-700 mt-0.5">{submitError}</div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || isCurrentDuplicate.isDuplicate}
                  className="mt-2 w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      <span>Running Automated Verification Engine...</span>
                    </>
                  ) : isCurrentDuplicate.isDuplicate ? (
                    <>
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      <span>Project Already in Skill Passport</span>
                    </>
                  ) : (
                    <>
                      <span>Submit for Automated Verification</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 text-[11px] text-[#494D4D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital signatures, Gemini AI extractions, and SHA-256 proofs are cryptographically verified for your Skill Passport.</span>
          </div>
        </div>
      </main>

      {/* ======================================================== */}
      {/* GITHUB MULTI-SELECT REPOSITORIES MODAL */}
      {/* ======================================================== */}
      {isGhMultiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-3xl sm:rounded-4xl max-w-2xl w-full shadow-2xl border border-black/10 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-start justify-between gap-4 bg-[#FBFBFB]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-md">
                  <GitHubLogo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-[#111111] tracking-tight">
                      Select Multiple GitHub Projects
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                      Bulk Import
                    </span>
                  </div>
                  <p className="text-xs text-[#494D4D] mt-0.5">
                    Select all the repositories you want to verify and add to your Skill Passport simultaneously.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGhMultiModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 sm:px-6 bg-white border-b border-neutral-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ghRepoSearch}
                  onChange={(e) => setGhRepoSearch(e.target.value)}
                  placeholder="Filter repositories by name or tech stack (e.g. React, Python)..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F3] rounded-xl border border-black/5 text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleToggleSelectAllGhRepos(availableGhRepos)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 whitespace-nowrap self-end sm:self-center cursor-pointer underline"
              >
                {selectedGhRepoUrls.size === availableGhRepos.length && availableGhRepos.length > 0
                  ? "Deselect All"
                  : `Select All Available (${availableGhRepos.length})`}
              </button>
            </div>

            {/* Repositories List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F8F9FA] flex flex-col gap-2.5">
              {availableGhRepos.length === 0 && ghRepos.length > 0 ? (
                <div className="py-12 text-center text-xs text-neutral-500 flex flex-col items-center gap-2">
                  <FolderGit2 className="w-8 h-8 text-neutral-300" />
                  <span className="font-bold">No unadded repositories match your search.</span>
                  <span className="text-[11px] text-neutral-400">All matching repositories may already be in your Skill Passport.</span>
                </div>
              ) : (
                ghRepos.map((repo) => {
                  const alreadyAdded = isRepoAlreadyAdded(repo.htmlUrl, repo.name);
                  const isSelected = selectedGhRepoUrls.has(repo.htmlUrl);

                  return (
                    <div
                      key={repo.id}
                      onClick={() => !alreadyAdded && handleToggleSelectGhRepo(repo.htmlUrl)}
                      className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 cursor-pointer ${
                        alreadyAdded
                          ? "bg-neutral-100/60 border-neutral-200 opacity-60 cursor-not-allowed"
                          : isSelected
                          ? "bg-white border-emerald-500/80 shadow-sm ring-2 ring-emerald-500/15"
                          : "bg-white border-black/5 hover:border-black/15 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="mt-0.5 shrink-0">
                          {alreadyAdded ? (
                            <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-emerald-600 text-white"
                                  : "border border-neutral-300 bg-white"
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5" />}
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-neutral-900 truncate">
                              📁 {repo.name}
                            </span>
                            {repo.language && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-neutral-100 text-neutral-800">
                                {repo.language}
                              </span>
                            )}
                            {repo.isPrivate && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-800 font-bold">
                                Private
                              </span>
                            )}
                            {alreadyAdded && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800">
                                ✓ In Passport
                              </span>
                            )}
                          </div>

                          {repo.description && (
                            <p className="text-[11px] text-neutral-600 mt-1 line-clamp-2">
                              {repo.description}
                            </p>
                          )}

                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {repo.topics.slice(0, 5).map((t, idx) => (
                                <span key={idx} className="text-[9px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.2 rounded">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <a
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors shrink-0"
                        title="View on GitHub"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-neutral-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs font-semibold text-neutral-700">
                <strong>{selectedGhRepoUrls.size}</strong> projects selected for import
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setIsGhMultiModalOpen(false)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-neutral-700 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleBulkImportGhRepos}
                  disabled={isImportingGhRepos || selectedGhRepoUrls.size === 0}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isImportingGhRepos ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Importing Projects...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Add {selectedGhRepoUrls.size} Projects to Passport</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
