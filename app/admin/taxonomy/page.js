"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Database, Plus, Trash2, Search, RefreshCw, Layers } from "lucide-react";
import { useForm } from "react-hook-form";

async function fetchTaxonomyData() {
  const res = await fetch("/api/admin/taxonomy");
  if (!res.ok) throw new Error("Failed to fetch taxonomy");
  const data = await res.json();
  return data.taxonomy || [];
}

export default function AdminTaxonomyPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    data: taxonomy = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-taxonomy"],
    queryFn: fetchTaxonomyData,
  });

  const { register, handleSubmit, reset } = useForm();

  const handleAddSkill = async (formData) => {
    try {
      await fetch("/api/admin/taxonomy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      reset();
      setIsAddModalOpen(false);
      refetch();
    } catch (err) {
      console.error("Add skill error:", err);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!confirm("Are you sure you want to delete this skill from the taxonomy?")) return;
    try {
      await fetch(`/api/admin/taxonomy?id=${id}`, { method: "DELETE" });
      refetch();
    } catch (err) {
      console.error("Delete skill error:", err);
    }
  };

  const filteredTaxonomy = taxonomy.filter(
    (sk) =>
      sk.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sk.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-md border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="px-3.5 py-1 bg-[#F5F5F3] text-[#494D4D] text-xs font-bold rounded-full border border-black/5 inline-flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Skill Taxonomy Catalog</span>
          </span>
          <h1 className="text-2xl font-black text-[#111111] mt-2">Skill Taxonomy Manager</h1>
          <p className="text-xs text-[#494D4D] mt-1">
            Maintain authorized skills, categories, and matching taxonomy definitions across student passports and opportunities.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add Skill Record</span>
        </button>
      </div>

      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-black/5 flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search skill name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={() => refetch()}
          className="p-2.5 bg-[#F5F5F3] text-[#494D4D] hover:text-[#111111] rounded-2xl border border-black/5 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4">
        {filteredTaxonomy.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-2xl sm:rounded-[24px] p-4 sm:p-5 border border-black/5 shadow-xs flex flex-col justify-between gap-3 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 bg-[#F5F5F3] text-[#494D4D] text-[10px] font-bold uppercase tracking-wider rounded-md">
                  {skill.category}
                </span>
                <span className="text-[10px] font-mono text-neutral-400">{skill.id}</span>
              </div>
              <h3 className="text-lg font-bold text-[#111111] mt-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                {skill.name}
              </h3>
              <p className="text-xs text-[#494D4D] mt-1 line-clamp-2 leading-relaxed">{skill.description}</p>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex justify-end">
              <button
                onClick={() => handleDeleteSkill(skill.id)}
                className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete skill"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-6 max-w-md w-full border border-black/5 shadow-2xl flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-[#111111]">Add New Skill to Taxonomy</h3>
              <p className="text-xs text-[#494D4D] mt-0.5">Define new skill record for matching taxonomy.</p>
            </div>

            <form onSubmit={handleSubmit(handleAddSkill)} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. PyTorch / Next.js"
                  {...register("name", { required: true })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Machine Learning / Frontend Web"
                  {...register("category", { required: true })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111111] mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Skill scope description..."
                  {...register("description")}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold shadow-md hover:bg-neutral-800"
                >
                  Save Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

