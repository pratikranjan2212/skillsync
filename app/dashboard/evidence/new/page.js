"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import jsQR from "jsqr";
import { FilePlus, QrCode, Sparkles, Check, ArrowRight, ShieldCheck, Loader2, Link2, FileUp } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import Badge from "@/app/components/ui/Badge";

const SKILL_TAXONOMY_OPTIONS = [
  "Python",
  "SQL",
  "React.js",
  "TensorFlow",
  "Docker",
  "REST API design",
  "Tailwind CSS",
  "Data Engineering",
  "Machine Learning",
  "Mathematics",
];

/**
 * Add Evidence Form Screen.
 * Client Component utilizing React Hook Form and client-side jsQR pre-scanning.
 */
export default function AddEvidencePage() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState(["Python", "SQL"]);
  const [isQrDetected, setIsQrDetected] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignedResult, setAssignedResult] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: "coursework",
      title: "",
      description: "",
      fileUrl: "",
    },
  });

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Client-side jsQR scan pre-check handler
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
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          {/* Header */}
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <FilePlus className="w-3.5 h-3.5" />
              Evidence Submission
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mt-2">
              Submit Coursework or Project
            </h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Automated multi-stage verification parses your file and assigns an evidence tier (`verified-high`, `verified-medium`, or `flagged-low`).
            </p>
          </div>

          {/* Verification Result Banner (when finished submitting) */}
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
            {/* Evidence Type */}
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

            {/* Title */}
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

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">Description & Key Highlights</label>
              <textarea
                rows={3}
                placeholder="Detail what you built, coursework topics, grades, or technologies used..."
                {...register("description")}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* File Upload with jsQR Pre-Check */}
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

              {/* QR Code Detection UX Hint */}
              {isQrDetected && (
                <div className="p-3 bg-emerald-100/70 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    <strong>QR Code Detected!</strong> Pre-flagged as an instant verification candidate.
                  </span>
                </div>
              )}
            </div>

            {/* External URL */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5 flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>External Link (GitHub Repo / Credential URL / Transcript Link)</span>
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                {...register("fileUrl")}
                className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Claimed Skills Selector */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-2 flex items-center justify-between">
                <span>Select Claimed Skills ({selectedSkills.length})</span>
                <span className="text-[10px] text-neutral-400">Match against Skill Taxonomy</span>
              </label>

              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1">
                {SKILL_TAXONOMY_OPTIONS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "bg-[#F5F5F3] text-[#494D4D] hover:bg-neutral-200"
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
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

          {/* Guarantee */}
          <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 text-[11px] text-[#494D4D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital signatures and OCR matches are verified automatically within 2 seconds.</span>
          </div>
        </div>
      </main>
    </div>
  );
}
