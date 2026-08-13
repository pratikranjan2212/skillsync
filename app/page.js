"use client";
import React from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import FeatureBento from "./components/FeatureBento.jsx";
import UseCaseTabs from "./components/UseCaseTabs.jsx";
import Metrics from "./components/Metrics.jsx";
import SmartAssist from "./components/SmartAssist.jsx";
import FAQSection from "./components/FAQSection.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] relative selection:bg-emerald-500 selection:text-white">
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Main Landing Sections */}
      <main>
        <Hero />
        <FeatureBento />
        <UseCaseTabs />
        <Metrics />
        <SmartAssist />
        <FAQSection />
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
