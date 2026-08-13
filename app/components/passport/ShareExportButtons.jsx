"use client";

import React, { useState } from "react";
import { Download, FileJson, Share2, Check, Lock, Globe } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";

/**
 * Share & Export Buttons for Skill Passport.
 * @param {Object} props
 * @param {Object} props.passportData - Full Section 4 passport object
 * @param {boolean} props.isPublic - Initial public visibility status
 * @param {string} props.shareToken - Public share token
 * @param {Function} [props.onTogglePublic] - Handler to update public/private status
 */
export default function ShareExportButtons({ passportData, isPublic: initialPublic, shareToken, onTogglePublic }) {
  const [isPublic, setIsPublic] = useState(initialPublic);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [hovered, setHovered] = useState(null);

  const handleToggle = async () => {
    const nextState = !isPublic;
    setIsPublic(nextState);
    if (onTogglePublic) {
      await onTogglePublic(nextState);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/passport/${shareToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(passportData, null, 2)
    )}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", `SkillSync_Passport_${passportData?.studentId || "export"}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      // Trigger server-side PDF generator route
      const res = await fetch(`/api/passport/pdf?studentId=${passportData?.studentId || "std-101"}`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `SkillSync_Passport_${passportData?.studentId || "export"}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        // Fallback print/pdf trigger
        window.print();
      }
    } catch (err) {
      console.error("PDF export error:", err);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Public / Private Toggle */}
      <button
        onClick={handleToggle}
        onMouseEnter={() => setHovered('toggle')}
        onMouseLeave={() => setHovered(null)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs border transition-all ${
          isPublic
            ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100"
            : "bg-neutral-100 text-neutral-700 border-neutral-300 hover:bg-neutral-200"
        }`}
      >
        {isPublic ? (
          <>
            <Globe className="w-4 h-4 text-emerald-600" />
            <RollingText
              text="Passport: Public"
              autoPlay={hovered === 'toggle'}
              animationTrigger="onAppear"
              rollDuration={0.4}
              staggerDelay={0.015}
              textColor="#065f46"
              font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
            />
          </>
        ) : (
          <>
            <Lock className="w-4 h-4 text-neutral-500" />
            <RollingText
              text="Passport: Private"
              autoPlay={hovered === 'toggle'}
              animationTrigger="onAppear"
              rollDuration={0.4}
              staggerDelay={0.015}
              textColor="#404040"
              font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
            />
          </>
        )}
      </button>

      {/* Copy Public Link */}
      {isPublic && (
        <button
          onClick={handleCopyLink}
          onMouseEnter={() => setHovered('copy')}
          onMouseLeave={() => setHovered(null)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#111111] hover:bg-neutral-50 border border-black/10 rounded-2xl font-bold text-xs shadow-xs transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-neutral-600" />
              <RollingText
                text="Copy Public Link"
                autoPlay={hovered === 'copy'}
                animationTrigger="onAppear"
                rollDuration={0.4}
                staggerDelay={0.015}
                textColor="#111111"
                font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
              />
            </>
          )}
        </button>
      )}

      {/* Export JSON Button */}
      <button
        onClick={handleExportJson}
        onMouseEnter={() => setHovered('json')}
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#111111] hover:bg-neutral-50 border border-black/10 rounded-2xl font-bold text-xs shadow-xs transition-all"
      >
        <FileJson className="w-4 h-4 text-amber-600" />
        <RollingText
          text="Export JSON"
          autoPlay={hovered === 'json'}
          animationTrigger="onAppear"
          rollDuration={0.4}
          staggerDelay={0.015}
          textColor="#111111"
          font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
        />
      </button>

      {/* Export PDF Button */}
      <button
        onClick={handleExportPdf}
        disabled={isExportingPdf}
        onMouseEnter={() => setHovered('pdf')}
        onMouseLeave={() => setHovered(null)}
        className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl font-bold text-xs shadow-md transition-all disabled:opacity-50"
      >
        <Download className="w-4 h-4 text-emerald-400" />
        <RollingText
          text={isExportingPdf ? "Generating PDF..." : "Export PDF"}
          autoPlay={hovered === 'pdf'}
          animationTrigger="onAppear"
          rollDuration={0.4}
          staggerDelay={0.015}
          textColor="#FFFFFF"
          font={{ fontSize: '12px', fontWeight: '700', lineHeight: '1.2em' }}
        />
      </button>
    </div>
  );
}

