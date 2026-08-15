"use client";

import React, { useState } from "react";
import { FAQ_ITEMS } from "@/app/data/skillsyncData.js";
import { Plus, X, Headphones, HelpCircle } from "lucide-react";
import RollingText from "@/app/components/ui/RollingText";
import { FadeIn, FadeInStagger, FadeInItem } from "@/app/components/ui/FadeIn";

export default function FAQSection() {
  const [openId, setOpenId] = useState("faq1");
  const [hovered, setHovered] = useState(false);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto scroll-mt-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch">
        {/* Left Column: Heading & Contact Card */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full gap-10">
          <FadeIn distance={28} duration={0.85} delay={0.1} className="flex flex-col justify-between h-full gap-10">
            <div>
              {/* Pill with increased Y-axis padding */}
              <span className="px-4.5 py-2.5 sm:py-3 bg-white text-emerald-800 text-xs sm:text-sm font-bold rounded-full border border-black/5 shadow-2xs inline-flex items-center gap-2 mb-6 sm:mb-8">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Frequently Asked Questions</span>
              </span>

              {/* Heading positioned nicely with middle spacing */}
              <h2 className="text-3xl sm:text-5xl font-black text-[#111111] leading-tight tracking-tight mt-2">
                Everything<br />
                about<br />
                SkillSync
              </h2>
            </div>

            {/* Contact Support Box with increased right padding */}
            <div className="bg-white rounded-[28px] sm:rounded-4xl py-7 pl-7 pr-12 sm:py-9 sm:pl-9 sm:pr-16 border border-black/5 shadow-xs flex flex-col items-start gap-5 sm:gap-6 w-full max-w-95">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25 shrink-0">
                <Headphones className="w-6 h-6 stroke-[2.5]" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-[#111111] leading-snug">
                Can’t find your answer?
              </h3>

              <a
                href="mailto:support@skillsync.dev"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="px-6 py-3.5 bg-[#111111] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-full shadow-[0_18px_40px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.25)] transition-all hover:scale-95 active:scale-90 inline-flex items-center justify-center"
              >
                <RollingText
                  text="Contact us"
                  autoPlay={hovered}
                  animationTrigger="onAppear"
                  rollDuration={0.8}
                  staggerDelay={0.02}
                  textColor="#FFFFFF"
                  font={{ fontSize: "14px", fontWeight: "700", lineHeight: "1.2em" }}
                />
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Right Column: Accordion Items */}
        <div className="lg:col-span-7">
          <FadeInStagger className="flex flex-col gap-3.5 sm:gap-4" staggerDelay={0.14} delayChildren={0.2}>
            {FAQ_ITEMS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <FadeInItem key={faq.id}>
                  <div
                    className="bg-white rounded-3xl sm:rounded-[28px] p-6 sm:p-7 shadow-xs border border-black/5 transition-all duration-200"
                  >
                    <button
                      onClick={() => toggle(faq.id)}
                      className="w-full flex items-center justify-between gap-4 text-left font-bold text-[17px] sm:text-xl text-[#111111] group"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-neutral-100 group-hover:bg-neutral-200/80 flex items-center justify-center shrink-0 transition-colors">
                        <Plus
                          className={`w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 stroke-[2.5] transition-transform duration-500 ease-out ${
                            isOpen ? "rotate-45" : "rotate-0"
                          }`}
                        />
                      </div>
                    </button>

                    <div
                      className={`grid transition-all duration-500 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-3.5"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={`text-sm sm:text-[15px] text-[#494D4D] leading-relaxed font-medium transition-all duration-500 ease-out transform ${
                            isOpen
                              ? "translate-y-0 opacity-100"
                              : "translate-y-3 opacity-0"
                          }`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
