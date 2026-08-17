"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import jsQR from "jsqr";
import { 
  FilePlus, 
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
  FolderGit2,
  RefreshCw,
  Lock,
  ExternalLink,
  Search,
  Plus,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Badge from "@/app/components/ui/Badge";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";
import { GitHubIcon } from "@/app/components/icons";

function GitHubLogo({ className = "w-4 h-4 text-emerald-400" }) {
  return <GitHubIcon className={className} />;
}

import { STUDENT_INTERN_SKILLS, PRELOADED_SKILL_RECOMMENDATIONS as SKILL_TAXONOMY_OPTIONS } from "@/app/data/studentInternSkills";

async function fetchUserGitHubRepos() {
  const res = await fetch("/api/github/repos");
  if (!res.ok) throw new Error("Failed to fetch GitHub repositories");
  return res.json();
}

export default function AddEvidencePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [isSkillFocused, setIsSkillFocused] = useState(false);
  const skillInputRef = React.useRef(null);
  const [isQrDetected, setIsQrDetected] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedResult, setAssignedResult] = useState(null);

  const {
    data: ghData,
    isLoading: isGhLoading,
    refetch: refetchGh,
  } = useQuery({
    queryKey: ["user-github-repos"],
    queryFn: fetchUserGitHubRepos,
    enabled: isAuthenticated,
    staleTime: 60000,
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

  const addCustomSkill = (skillName) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkillInput("");
  };

  const handleSelectRepo = (repoUrl) => {
    setValue("fileUrl", repoUrl);
    const matchedRepo = ghRepos.find((r) => r.htmlUrl === repoUrl);
    if (matchedRepo) {
      setValue("type", "project");
      const currentTitle = watch("title");
      if (!currentTitle) {
        const formattedTitle = matchedRepo.name
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setValue("title", formattedTitle);
      }
      const currentDesc = watch("description");
      if (!currentDesc && matchedRepo.description) {
        setValue("description", matchedRepo.description);
      }
      if (matchedRepo.language) {
        addCustomSkill(matchedRepo.language);
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
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

  const onSubmit = async (data) => {
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
        setAssignedResult(json.evidence);
        // Instantly invalidate all query caches across the application
        await Promise.allSettled([
          queryClient.invalidateQueries({ queryKey: ["skill-passport"] }),
          queryClient.invalidateQueries({ queryKey: ["dash-passport"] }),
          queryClient.invalidateQueries({ queryKey: ["dash-evidence"] }),
          queryClient.invalidateQueries({ queryKey: ["evidence"] }),
          queryClient.invalidateQueries({ queryKey: ["user-profile"] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["opportunities-feed"] }),
        ]);
        router.refresh();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err) {
      console.error("Submission error:", err);
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
                title: "Automated OCR & QR Verification",
                desc: "Instant client-side QR code analysis and institutional certificate signature validation.",
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

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-2xl 2xl:max-w-3xl mx-auto px-3.5 sm:px-6">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <FilePlus className="w-3.5 h-3.5" />
              Evidence Submission
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold text-[#111111] mt-2">
              Submit Coursework or Project
            </h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Automated multi-stage verification parses your file and assigns an evidence tier (`verified-high`, `verified-medium`, or `flagged-low`).
            </p>
          </div>

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
                <option value="coursework">Coursework & Transcript</option>
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
                <span>Description & Key Highlights</span>
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
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 inline-flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{ghRepos.length} Repos Linked</span>
                  </span>
                )}
              </div>

              {/* GitHub Repositories Dropdown or Permission Action Banner */}
              {isGhLoading ? (
                <div className="px-4 py-3 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-center gap-2 text-xs text-neutral-500">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>Checking linked GitHub repositories...</span>
                </div>
              ) : ghData?.hasPermissions && ghRepos.length > 0 ? (
                <div className="flex flex-col gap-1.5">
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
                        -- Select from your GitHub Repositories ({ghRepos.length}) --
                      </option>
                      {ghRepos.map((repo) => (
                        <option key={repo.id} value={repo.htmlUrl}>
                          📁 {repo.name} {repo.language ? `• ${repo.language}` : ""} {repo.isPrivate ? "• [Private]" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="text-[10px] text-neutral-500 px-1">
                    Selecting a repository automatically fills the URL, title, description, and matching skills.
                  </p>
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
                        Allow repository permissions to auto-select projects from your GitHub account
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
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Claimed Skills Selector */}
            <div>
              <label className="text-xs font-bold text-[#111111] mb-2 flex items-center justify-between">
                <span>Select or Add Claimed Skills ({selectedSkills.length})</span>
                <span className="text-[10px] text-neutral-400">Match against Skill Taxonomy</span>
              </label>

              {/* Unified Add Skill Input with Focus Animation & Recommendations */}
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

                {/* Recommendations Dropdown (shown only when typing) */}
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

                    {/* Custom direct add prompt */}
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

              {/* Selected Skills Chips with Remove Cross Buttons */}
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

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-4 px-6 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                  <span>Running Automated Verification Engine...</span>
                </>
              ) : (
                <>
                  <span>Submit for Automated Verification</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </>
              )}
            </button>
          </form>

          <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 text-[11px] text-[#494D4D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital signatures and OCR matches are verified automatically within 2 seconds.</span>
          </div>
        </div>
      </main>
    </div>
  );
}

