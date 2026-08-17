"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ListFilter, ShieldAlert, RefreshCw, CheckCircle2, Edit3, SlidersHorizontal } from "lucide-react";
import Badge from "@/app/components/ui/Badge";

async function fetchPipelineData() {
  const res = await fetch("/api/admin/pipeline");
  if (!res.ok) throw new Error("Failed to fetch evidence pipeline log");
  const data = await res.json();
  return data.pipeline || [];
}

export default function AdminPipelinePage() {
  const [overrideModalItem, setOverrideModalItem] = useState(null);
  const [selectedTier, setSelectedTier] = useState("verified-high");

  const {
    data: pipeline = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-pipeline"],
    queryFn: fetchPipelineData,
  });

  const handleApplyOverride = async () => {
    if (!overrideModalItem) return;
    try {
      await fetch("/api/admin/pipeline", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: overrideModalItem.id,
          newTier: selectedTier,
        }),
      });
      setOverrideModalItem(null);
      refetch();
    } catch (err) {
      console.error("Override failed:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-3xl sm:rounded-[32px] p-5 sm:p-8 shadow-md border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 bg-[#F5F5F3] text-[#494D4D] text-xs font-bold rounded-full border border-black/5 inline-flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit & Verification Pipeline Log</span>
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-[#111111] mt-2">Evidence Pipeline Records</h1>
          <p className="text-xs text-[#494D4D] mt-1">
            Review automated verification stages, confidence reasons, and trigger manual tier overrides when required.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-[#111111] hover:bg-neutral-50 rounded-2xl text-xs font-bold border border-black/10 transition-all shadow-xs w-full sm:w-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl sm:rounded-[32px] p-4 sm:p-6 shadow-md border border-black/5 overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-xs font-bold text-neutral-400">Loading Pipeline Log...</div>
        ) : isError ? (
          <div className="p-8 text-center text-xs font-bold text-rose-600">Failed to load pipeline records.</div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
                <th className="pb-3 px-3">Student ID</th>
                <th className="pb-3 px-3">Title & Category</th>
                <th className="pb-3 px-3">Stage</th>
                <th className="pb-3 px-3">Assigned Tier</th>
                <th className="pb-3 px-3">Verification Reason</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs">
              {pipeline.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-4 px-3 font-mono text-neutral-500 font-bold">{item.studentId}</td>
                  <td className="py-4 px-3">
                    <div className="font-bold text-[#111111]">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 uppercase font-semibold">{item.type}</div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded-lg text-[11px] font-mono">
                      {item.verificationStage}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <Badge tier={item.verificationTier} />
                  </td>
                  <td className="py-4 px-3 text-neutral-600 max-w-xs truncate" title={item.verificationReason}>
                    {item.verificationReason}
                  </td>
                  <td className="py-4 px-3 text-right">
                    <button
                      onClick={() => {
                        setOverrideModalItem(item);
                        setSelectedTier(item.verificationTier);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-emerald-400" />
                      <span>Override</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {overrideModalItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full border border-black/5 shadow-2xl flex flex-col gap-5 animate-in zoom-in-95">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-rose-600 font-bold">
                Admin Manual Control
              </span>
              <h3 className="text-xl font-extrabold text-[#111111] mt-1">Manual Tier Override</h3>
              <p className="text-xs text-[#494D4D] mt-1">
                Item: <strong>{overrideModalItem.title}</strong> ({overrideModalItem.id})
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-2">Select New Verification Tier</label>
              <div className="flex flex-col gap-2">
                {[
                  { value: "verified-high", label: "verified-high" },
                  { value: "verified-medium", label: "verified-medium" },
                  { value: "flagged-low", label: "flagged-low" },
                ].map((tierOpt) => (
                  <button
                    type="button"
                    key={tierOpt.value}
                    onClick={() => setSelectedTier(tierOpt.value)}
                    className={`p-3 rounded-2xl text-xs font-bold text-left border transition-all ${
                      selectedTier === tierOpt.value
                        ? "bg-neutral-900 text-white border-neutral-900"
                        : "bg-[#F5F5F3] text-[#494D4D] border-black/5 hover:bg-neutral-200"
                    }`}
                  >
                    {tierOpt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setOverrideModalItem(null)}
                className="px-4 py-2.5 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold hover:bg-neutral-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-md"
              >
                Apply Override
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

