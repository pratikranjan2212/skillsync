"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileCheck,
  Award,
  PlusCircle,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  ListFilter,
  Database,
  Plus,
  Trash2,
  SlidersHorizontal,
  BarChart2,
  CheckCircle2,
  FilePlus2,
  LayoutDashboard,
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import EvidenceCard from "@/app/components/evidence/EvidenceCard";
import Badge from "@/app/components/ui/Badge";
import AuthRequiredView from "@/app/components/auth/AuthRequiredView";
import { useAuth } from "@/app/hooks/useAuth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useForm } from "react-hook-form";

async function fetchEvidence() {
  const res = await fetch("/api/evidence");
  if (!res.ok) throw new Error("Failed to fetch evidence");
  const data = await res.json();
  return data.evidence || [];
}

async function fetchPassport() {
  const res = await fetch("/api/passport");
  if (!res.ok) throw new Error("Failed to fetch passport");
  const data = await res.json();
  return data.passport;
}

async function fetchPipelineLog() {
  const res = await fetch("/api/admin/pipeline");
  if (!res.ok) throw new Error("Failed to fetch pipeline log");
  const data = await res.json();
  return data.pipeline || [];
}

async function fetchTaxonomy() {
  const res = await fetch("/api/admin/taxonomy");
  if (!res.ok) throw new Error("Failed to fetch taxonomy");
  const data = await res.json();
  return data.taxonomy || [];
}

async function fetchFairnessAudits() {
  const res = await fetch("/api/admin/fairness");
  if (!res.ok) throw new Error("Failed to fetch fairness audit logs");
  return res.json();
}

export default function UnifiedDashboardPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("evidence");
  const [overrideModalItem, setOverrideModalItem] = useState(null);
  const [selectedTier, setSelectedTier] = useState("verified-high");
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);

  const { data: evidenceList = [], isLoading: loadingEv, refetch: refetchEv } = useQuery({
    queryKey: ["dash-evidence"],
    queryFn: fetchEvidence,
    enabled: isAuthenticated,
  });

  const { data: passport, isLoading: loadingPass, refetch: refetchPass } = useQuery({
    queryKey: ["dash-passport"],
    queryFn: fetchPassport,
    enabled: isAuthenticated,
  });

  const { data: pipeline = [], refetch: refetchPipe } = useQuery({
    queryKey: ["dash-pipeline"],
    queryFn: fetchPipelineLog,
    enabled: isAuthenticated,
  });

  const { data: taxonomy = [], refetch: refetchTax } = useQuery({
    queryKey: ["dash-taxonomy"],
    queryFn: fetchTaxonomy,
    enabled: isAuthenticated,
  });

  const { data: fairnessData, refetch: refetchFair } = useQuery({
    queryKey: ["dash-fairness"],
    queryFn: fetchFairnessAudits,
    enabled: isAuthenticated,
  });

  const { register: regSkill, handleSubmit: submitSkill, reset: resetSkill } = useForm();

  const highCount = evidenceList.filter((e) => e.verificationTier === "verified-high").length;
  const medCount = evidenceList.filter((e) => e.verificationTier === "verified-medium").length;
  const lowCount = evidenceList.filter((e) => e.verificationTier === "flagged-low").length;

  if (!authLoading && !isAuthenticated) {
    return (
      <div className="h-screen overflow-hidden bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <AuthRequiredView
            badgeText="Unified Student & Admin Dashboard"
            badgeIcon={LayoutDashboard}
            badgeColor="emerald"
            title="SkillSync Dashboard Access"
            subtitle="Sign in to manage your evidence records, view your Skill Passport, and monitor pipeline audit logs."
            sectionName="Dashboard"
            features={[
              {
                icon: FileCheck,
                title: "Evidence Ingestion & Validation",
                desc: "Upload coursework transcripts and GitHub projects with multi-tier automated validation and confidence scores.",
              },
              {
                icon: Award,
                title: "Skill Passport Management",
                desc: "Group verified skills into taxonomy domains, generate official PDF transcripts, and toggle public share links.",
              },
              {
                icon: SlidersHorizontal,
                title: "Pipeline & Audit Governance",
                desc: "Monitor multi-stage verification audit logs, score distributions, and custom taxonomy catalog.",
              },
            ]}
          />
        </main>
      </div>
    );
  }



  const handleApplyOverride = async () => {
    if (!overrideModalItem) return;
    await fetch("/api/admin/pipeline", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: overrideModalItem.id, newTier: selectedTier }),
    });
    setOverrideModalItem(null);
    refetchPipe();
    refetchEv();
  };

  const handleAddSkill = async (data) => {
    await fetch("/api/admin/taxonomy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    resetSkill();
    setIsAddSkillOpen(false);
    refetchTax();
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm("Delete skill from taxonomy?")) return;
    await fetch(`/api/admin/taxonomy?id=${id}`, { method: "DELETE" });
    refetchTax();
  };

  const auditLogs = fairnessData?.audits || [];
  const chartData = auditLogs[0]?.scoreDistribution || [];

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                Unified SkillSync Dashboard
              </span>
              <span className="text-xs text-[#494D4D] font-mono">ID: {passport?.studentId || "std-101"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] mt-2">
              Integrated Verification & Match Console
            </h1>
            <p className="text-sm text-[#494D4D] mt-1 max-w-2xl">
              Access your verified evidence records and automated audit pipeline in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/evidence/new"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl font-bold text-xs shadow-md transition-all group"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform" />
              <span>Add Evidence</span>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-2 shadow-md border border-black/5 flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {[
              { id: "evidence", label: "Evidence Records", icon: FileCheck, count: evidenceList.length },
              { id: "audit", label: "Audit & Pipeline Console", icon: SlidersHorizontal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-neutral-900 text-white shadow-sm"
                      : "text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-neutral-500"}`} />
                  <span>{tab.label}</span>
                  {typeof tab.count === "number" && (
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono ${isActive ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-semibold border border-emerald-200 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Fairness Guaranteed</span>
          </div>
        </div>

        {activeTab === "evidence" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">Verified High Tier</div>
                  <div className="text-2xl font-extrabold text-emerald-700 mt-1">{highCount} Items</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">Verified Medium Tier</div>
                  <div className="text-2xl font-extrabold text-amber-700 mt-1">{medCount} Items</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-xs border border-black/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">Flagged Low Tier</div>
                  <div className="text-2xl font-extrabold text-rose-700 mt-1">{lowCount} Items</div>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-xs border border-rose-200">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-[#111111]">
                Coursework & Evidence Items ({evidenceList.length})
              </h2>
              <button
                onClick={() => refetchEv()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-xs font-bold text-[#494D4D] hover:text-[#111111] rounded-xl border border-black/5 transition-all shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>

            {evidenceList.length === 0 ? (
              <div className="bg-white rounded-4xl p-12 text-center border border-black/5 shadow-sm flex flex-col items-center gap-4">
                <FilePlus2 className="w-10 h-10 text-neutral-300" />
                <h3 className="text-xl font-bold text-[#111111]">No Evidence Uploaded Yet</h3>
                <Link
                  href="/dashboard/evidence/new"
                  className="px-5 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-xs shadow-md"
                >
                  Add Evidence Record
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {evidenceList.map((item) => (
                  <EvidenceCard key={item.id} evidence={item} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="flex flex-col gap-8">
            <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-md border border-black/5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-emerald-600" />
                    <span>Candidate Score Distribution Chart</span>
                  </h3>
                  <p className="text-xs text-[#494D4D]">Audit metrics across latest matching run.</p>
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-2">
                  <BarChart2 className="w-8 h-8 text-neutral-300" />
                  <p className="text-sm font-bold text-neutral-700">No Candidate Score Distribution Recorded Yet</p>
                  <p className="text-xs text-[#494D4D]">Score metrics will populate automatically after pipeline evaluation runs.</p>
                </div>
              ) : (
                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="scoreRange" stroke="#494D4D" fontSize={12} tickLine={false} />
                      <YAxis stroke="#494D4D" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111111",
                          borderRadius: "16px",
                          color: "#ffffff",
                          fontSize: "12px",
                          border: "none",
                        }}
                      />
                      <Bar dataKey="count" fill="#059669" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-4xl p-6 shadow-md border border-black/5 overflow-x-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                  <ListFilter className="w-5 h-5 text-emerald-600" />
                  <span>Evidence Pipeline Audit Log ({pipeline.length})</span>
                </h3>
              </div>

              {pipeline.length === 0 ? (
                <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
                  <ListFilter className="w-8 h-8 text-neutral-300" />
                  <p className="text-sm font-bold text-neutral-700">No Evidence Pipeline Audit Records</p>
                  <p className="text-xs text-[#494D4D]">Audit logs will appear here when evidence items are processed through the verification pipeline.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-175">
                  <thead>
                    <tr className="border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
                      <th className="pb-3 px-3">Student ID</th>
                      <th className="pb-3 px-3">Title</th>
                      <th className="pb-3 px-3">Stage</th>
                      <th className="pb-3 px-3">Tier</th>
                      <th className="pb-3 px-3">Verification Reason</th>
                      <th className="pb-3 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-xs">
                    {pipeline.map((item) => (
                      <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                        <td className="py-4 px-3 font-mono font-bold text-neutral-600">{item.studentId || "std-101"}</td>
                        <td className="py-4 px-3 font-bold text-[#111111]">{item.title}</td>
                        <td className="py-4 px-3">
                          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[11px] font-mono">
                            {item.verificationStage || "completed"}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <Badge tier={item.verificationTier} />
                        </td>
                        <td className="py-4 px-3 text-neutral-600 max-w-xs truncate">{item.verificationReason}</td>
                        <td className="py-4 px-3 text-right">
                          <button
                            onClick={() => {
                              setOverrideModalItem(item);
                              setSelectedTier(item.verificationTier);
                            }}
                            className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-neutral-800 cursor-pointer"
                          >
                            Override
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="bg-white rounded-4xl p-6 shadow-md border border-black/5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    <span>Skill Taxonomy Catalog ({taxonomy.length})</span>
                  </h3>
                  <p className="text-xs text-[#494D4D]">Manage skill taxonomy records.</p>
                </div>
                <button
                  onClick={() => setIsAddSkillOpen(true)}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Add Skill</span>
                </button>
              </div>

              {taxonomy.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                  <Database className="w-8 h-8 text-neutral-300" />
                  <p className="text-sm font-bold text-neutral-700">No Skills Registered in Taxonomy</p>
                  <p className="text-xs text-[#494D4D]">Click "+ Add Skill" above to register custom skills and categories.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {taxonomy.map((skill) => (
                    <div key={skill.id} className="bg-[#F8F9FA] p-4 rounded-2xl border border-black/5 flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#111111]">{skill.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{skill.category}</div>
                      </div>
                      <button onClick={() => handleDeleteSkill(skill.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {overrideModalItem && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-4xl p-6 max-w-md w-full border border-black/5 shadow-2xl flex flex-col gap-5">
              <div>
                <h3 className="text-xl font-extrabold text-[#111111]">Manual Tier Override</h3>
                <p className="text-xs text-[#494D4D] mt-1">{overrideModalItem.title}</p>
              </div>

              <div className="flex flex-col gap-2">
                {["verified-high", "verified-medium", "flagged-low"].map((tierVal) => (
                  <button
                    type="button"
                    key={tierVal}
                    onClick={() => setSelectedTier(tierVal)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left border ${
                      selectedTier === tierVal ? "bg-neutral-900 text-white" : "bg-[#F5F5F3] text-[#494D4D]"
                    }`}
                  >
                    {tierVal}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button onClick={() => setOverrideModalItem(null)} className="px-4 py-2 bg-neutral-100 text-xs font-bold rounded-xl">
                  Cancel
                </button>
                <button onClick={handleApplyOverride} className="px-5 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl">
                  Apply Override
                </button>
              </div>
            </div>
          </div>
        )}

        {isAddSkillOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-4xl p-6 max-w-md w-full border border-black/5 shadow-2xl flex flex-col gap-4">
              <h3 className="text-xl font-extrabold text-[#111111]">Add Skill to Taxonomy</h3>
              <form onSubmit={submitSkill(handleAddSkill)} className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Skill Name"
                  {...regSkill("name", { required: true })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F3] text-xs font-medium"
                />
                <input
                  type="text"
                  placeholder="Category"
                  {...regSkill("category", { required: true })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F3] text-xs font-medium"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setIsAddSkillOpen(false)} className="px-4 py-2 bg-neutral-100 text-xs font-bold rounded-xl">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-neutral-900 text-white text-xs font-bold rounded-xl">
                    Save Skill
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

