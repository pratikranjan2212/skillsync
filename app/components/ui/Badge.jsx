import React from "react";
import { CheckCircle2, AlertTriangle, ShieldAlert, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Badge({ tier, variant, icon: CustomIcon, size, className, showIcon = true, children }) {
  let badgeStyles = "bg-gray-100 text-gray-800 border-gray-200";
  let Icon = CustomIcon || Sparkles;
  let label = children || tier || variant;

  const normalized = (tier || variant)?.toLowerCase().replace(/\s+/g, "-");

  if (normalized === "verified-high") {
    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs";
    Icon = CustomIcon || CheckCircle2;
    label = children || "verified-high";
  } else if (normalized === "verified") {
    badgeStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-xs";
    Icon = CustomIcon || ShieldCheck;
    label = children || "Verified Identity";
  } else if (normalized === "verified-medium" || normalized === "tier1") {
    badgeStyles = "bg-amber-50 text-amber-700 border-amber-200/80 shadow-xs";
    Icon = CustomIcon || AlertTriangle;
    label = children || "verified-medium";
  } else if (normalized === "flagged-low") {
    badgeStyles = "bg-rose-50 text-rose-700 border-rose-200/80 shadow-xs";
    Icon = CustomIcon || ShieldAlert;
    label = children || "flagged-low";
  }

  const sizeStyles =
    size === "xs"
      ? "text-[10px] px-2 py-0.5"
      : size === "sm"
      ? "text-xs px-2.5 py-0.5"
      : "text-xs px-3 py-1";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all",
        sizeStyles,
        badgeStyles,
        className
      )}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      <span>{label}</span>
    </span>
  );
}

