"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListFilter, Database, Scale, ShieldCheck } from "lucide-react";

/**
 * Admin Navigation Bar.
 * Renders tab links for Admin Dashboard sections (/admin/pipeline, /admin/taxonomy, /admin/fairness).
 */
export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin/pipeline", label: "Evidence Pipeline Log", icon: ListFilter },
    { href: "/admin/taxonomy", label: "Skill Taxonomy Manager", icon: Database },
    { href: "/admin/fairness", label: "Algorithmic Fairness Audit", icon: Scale },
  ];

  return (
    <div className="bg-white rounded-[24px] p-2 shadow-md border border-black/5 flex items-center justify-between gap-2 overflow-x-auto">
      <div className="flex items-center gap-1 min-w-max">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 shrink-0">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Admin Console Session</span>
      </div>
    </div>
  );
}
