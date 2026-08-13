import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Verification Tier & Status Badge Primitive.
 * Renders verified-high (green), verified-medium (yellow), and flagged-low (gray/red) badges.
 * @param {Object} props
 * @param {"verified-high" | "verified-medium" | "flagged-low" | string} props.tier
 * @param {string} [props.className]
 * @param {boolean} [props.showIcon=true]
 * @param {string} [props.children]
 */
export default function Badge({ tier, className, showIcon = true, children }) {
  let badgeStyles = "bg-gray-100 text-gray-800 border-gray-200";
  let Icon = Sparkles;
  let label = children || tier;

  if (tier === "verified-high") {
    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs";
    Icon = CheckCircle2;
    label = children || "verified-high (QR-confirmed)";
  } else if (tier === "verified-medium") {
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200/80 shadow-xs";
    Icon = AlertTriangle;
    label = children || "verified-medium (OCR-parsed)";
  } else if (tier === "flagged-low") {
    badgeStyles = "bg-rose-50 text-rose-700 border-rose-200/80 shadow-xs";
    Icon = ShieldAlert;
    label = children || "flagged-low (Self-submitted)";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all",
        badgeStyles,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}
