"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Check, X, Building, GraduationCap } from "lucide-react";

export default function SearchableDropdown({
  options = [],
  value = "",
  onChange,
  placeholder = "Select or search...",
  iconType = "building", // "building" | "degree"
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on query
  const filteredOptions = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return options.slice(0, 30);

    return options
      .filter((opt) => {
        if (typeof opt === "string") {
          return opt.toLowerCase().includes(q);
        }
        const text = `${opt.name || ""} ${opt.city || ""} ${opt.state || ""} ${opt.type || ""}`.toLowerCase();
        return text.includes(q);
      })
      .slice(0, 40);
  }, [options, searchQuery]);

  const handleSelect = (item) => {
    const selectedVal = typeof item === "string" ? item : item.name;
    onChange(selectedVal);
    setSearchQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % (filteredOptions.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % (filteredOptions.length || 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      } else if (searchQuery.trim()) {
        onChange(searchQuery.trim());
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 hover:border-black/15 text-xs font-semibold text-[#111111] flex items-center justify-between gap-2 cursor-pointer transition-all focus-within:ring-2 focus-within:ring-emerald-500"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {iconType === "degree" ? (
            <GraduationCap className="w-4 h-4 text-purple-600 shrink-0" />
          ) : (
            <Building className="w-4 h-4 text-blue-600 shrink-0" />
          )}
          <span className={`truncate ${value ? "text-[#111111] font-bold" : "text-neutral-400 font-normal"}`}>
            {value || placeholder}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0 text-neutral-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="p-0.5 hover:text-neutral-700 rounded-full cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180 text-emerald-600" : ""}`} />
        </div>
      </div>

      {/* Dropdown Flyout Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-black/10 z-50 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Search Bar inside Flyout */}
          <div className="relative mb-2 px-1">
            <Search className="w-3.5 h-3.5 absolute left-3.5 top-3 text-neutral-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder={`Search ${iconType === "degree" ? "degrees..." : "colleges or universities..."}`}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-semibold text-[#111111] focus:outline-none focus:ring-1.5 focus:ring-emerald-500 placeholder:font-normal"
            />
          </div>

          {/* Options List */}
          <div ref={listRef} className="max-h-56 overflow-y-auto flex flex-col gap-0.5 pr-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => {
                const optName = typeof opt === "string" ? opt : opt.name;
                const isSelected = value === optName;
                const isHighlighted = highlightedIndex === idx;

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-emerald-50 text-emerald-950 font-bold"
                        : isHighlighted
                        ? "bg-neutral-100 text-[#111111] font-semibold"
                        : "text-[#111111] hover:bg-neutral-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{optName}</div>
                      {typeof opt !== "string" && (opt.city || opt.state || opt.nirf) && (
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 mt-0.5">
                          {opt.city && <span>{opt.city}</span>}
                          {opt.state && <span>• {opt.state}</span>}
                          {opt.nirf && (
                            <span className="bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded">
                              NIRF #{opt.nirf}
                            </span>
                          )}
                          {opt.type && (
                            <span className="bg-neutral-100 text-neutral-600 font-bold px-1.5 py-0.2 rounded">
                              {opt.type}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })
            ) : searchQuery.trim() ? (
              <div className="p-3 text-center">
                <p className="text-xs text-neutral-500 mb-2">No matching standard option found.</p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(searchQuery.trim());
                    setIsOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Use &quot;{searchQuery.trim()}&quot; as custom
                </button>
              </div>
            ) : (
              <div className="p-4 text-center text-xs text-neutral-400">No options available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
