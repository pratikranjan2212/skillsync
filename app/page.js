"use client";

import React from "react";
import Navbar from "@/app/components/layout/Navbar";
import Hero from "@/app/components/landing/Hero";
import FeatureBento from "@/app/components/landing/FeatureBento";
import UseCaseTabs from "@/app/components/landing/UseCaseTabs";
import Metrics from "@/app/components/landing/Metrics";
import SmartAssist from "@/app/components/landing/SmartAssist";
import FAQSection from "@/app/components/landing/FAQSection";
import FinalCTA from "@/app/components/landing/FinalCTA";
import Footer from "@/app/components/layout/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] relative selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main>
        <Hero />
        <FeatureBento />
        <UseCaseTabs />
        <Metrics />
        <SmartAssist />
        <FAQSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

