"use client";

import React from "react";
import Link from "next/link";
import { FadeIn } from "@/app/components/ui/FadeIn";

export default function Footer() {
  const quickLinks = [
    { name: "Features", href: "/#features" },
    { name: "Use Cases", href: "/#use-cases" },
    { name: "AI Verification", href: "/#smart-assist" },
    { name: "Metrics & Numbers", href: "/#metrics" },
  ];

  const pagesLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Skill Passport", href: "/passport" },
    { name: "Opportunity Feed", href: "/opportunities" },
    { name: "Admin Console", href: "/admin" },
  ];

  const supportLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "FAQs", href: "/#faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-white text-neutral-900 antialiased border-t border-neutral-100">
      <FadeIn distance={32} duration={0.85} delay={0.1}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-8">
            <Link 
              href="/" 
              className="flex items-center gap-3 group transition-transform duration-200 hover:opacity-90"
              aria-label="SkillSync Home"
            >
              <img 
                src="/logo.svg" 
                alt="SkillSync Logo" 
                className="h-9 w-auto object-contain shrink-0" 
              />
              <span className="font-extrabold text-2xl tracking-tight text-[#111111]">
                SkillSync
              </span>
            </Link>

            <p className="text-neutral-600 text-[14.5px] sm:text-[15px] font-normal mt-4 max-w-sm leading-relaxed">
              Automated skill verification and explainable job matching platform with guaranteed demographic non-discrimination.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">
            <div>
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Quick links
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-200 text-left"
                    >
                      <span>{link.name}</span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 -bottom-px w-full h-[1.5px] bg-neutral-900 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-active:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Pages
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {pagesLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-200 text-left"
                    >
                      <span>{link.name}</span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 -bottom-px w-full h-[1.5px] bg-neutral-900 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-active:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Support
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group relative inline-block text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-200 text-left"
                    >
                      <span>{link.name}</span>
                      <span
                        aria-hidden="true"
                        className="absolute left-0 -bottom-px w-full h-[1.5px] bg-neutral-900 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100 group-active:scale-x-100 group-focus-visible:scale-x-100"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        <div className="border-t border-neutral-200/80 my-10 sm:my-12" />

        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-[13.5px] text-neutral-500 font-normal tracking-tight">
            © 2026 SkillSync Platform. All rights reserved.
          </p>
        </div>
      </div>
    </FadeIn>
  </footer>
);
}