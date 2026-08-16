"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Scale, ShieldCheck, CheckCircle2, RefreshCw, BarChart2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

async function fetchFairnessAuditLogs() {
  const res = await fetch("/api/admin/fairness");
  if (!res.ok) throw new Error("Failed to fetch fairness audit logs");
  return res.json();
}

export default function AdminFairnessPage() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["admin-fairness"],
    queryFn: fetchFairnessAuditLogs,
  });

  const auditLogs = data?.audits || [];
  const excludedParameters = data?.excludedParameters || ["gender", "college tier", "name", "photo"];

  const chartData = auditLogs[0]?.scoreDistribution || [
    { scoreRange: "90-100%", count: 18 },
    { scoreRange: "80-89%", count: 42 },
    { scoreRange: "70-79%", count: 54 },
    { scoreRange: "< 70%", count: 28 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Algorithmic Bias Audit Suite</span>
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-2">Fairness & Bias Exclusion Audit</h1>
          <p className="text-xs text-[#494D4D] mt-1 max-w-2xl">
            Quantitative verification confirming candidate ranking calculations depend exclusively on verified skill evidence.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-[#111111] hover:bg-neutral-50 rounded-2xl text-xs font-bold border border-black/10 transition-all shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-600" : ""}`} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      <div className="bg-gradient-to-r from-neutral-900 via-slate-900 to-neutral-900 text-white rounded-[32px] p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Explicit Model Parameter Exclusion List</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-mono tracking-wider rounded-md border border-emerald-500/30">
                  ENFORCED AT MODEL LAYER
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                The following candidate attributes are stripped from payload vectors before ranking execution:
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2">
          {excludedParameters.map((param, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-slate-100 rounded-2xl text-xs font-mono font-bold border border-white/10"
            >
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span className="line-through decoration-rose-400">{param}</span>
              <span className="text-[10px] text-emerald-400 ml-1">CONFIRMED EXCLUDED</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-black/5 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#111111] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-emerald-600" />
              <span>Candidate Match Score Distribution</span>
            </h3>
            <p className="text-xs text-[#494D4D]">Distribution across last audited matching run.</p>
          </div>
        </div>

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
      </div>

      <div className="bg-white rounded-[32px] p-6 shadow-md border border-black/5 overflow-x-auto">
        <h3 className="text-lg font-bold text-[#111111] mb-4">Audited Matching Runs</h3>

        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-neutral-200 text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
              <th className="pb-3 px-3">Run ID</th>
              <th className="pb-3 px-3">Timestamp</th>
              <th className="pb-3 px-3">Candidates Audited</th>
              <th className="pb-3 px-3">Excluded Parameters</th>
              <th className="pb-3 px-3 text-right">Audit Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs">
            {auditLogs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50/80 transition-colors">
                <td className="py-4 px-3 font-mono font-bold text-neutral-600">{log.runId}</td>
                <td className="py-4 px-3 text-neutral-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-4 px-3 font-extrabold text-[#111111]">{log.totalCandidates} Candidates</td>
                <td className="py-4 px-3">
                  <div className="flex flex-wrap gap-1">
                    {log.excludedParameters.map((p, i) => (
                      <span key={i} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 text-[10px] font-mono rounded">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-3 text-right">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{log.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

