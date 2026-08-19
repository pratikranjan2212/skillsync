"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Check,
} from "lucide-react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function parseDateValue(val) {
  if (!val || typeof val !== "string") return null;
  const trimmed = val.trim();
  if (!trimmed) return null;

  // Format: "21 January 2004" or "21 Jan 2004"
  const spaceParts = trimmed.split(/\s+/);
  if (spaceParts.length === 3) {
    const day = parseInt(spaceParts[0], 10);
    const monthName = spaceParts[1].toLowerCase();
    const year = parseInt(spaceParts[2], 10);

    const monthIndex = MONTH_NAMES.findIndex(
      (m) => m.toLowerCase().startsWith(monthName)
    );
    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year) && year > 1900 && year < 2100) {
      return new Date(year, monthIndex, day);
    }
  }

  // Format: "YYYY-MM-DD"
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split("-").map((n) => parseInt(n, 10));
    return new Date(y, m - 1, d);
  }

  // Fallback to standard Date parser
  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    return parsed;
  }

  return null;
}

function formatDateDisplay(dateObj) {
  if (!dateObj || isNaN(dateObj.getTime())) return "";
  const day = dateObj.getDate();
  const month = MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function DatePickerFlyout({
  value = "",
  onChange,
  placeholder = "e.g. 21 January 2004",
  className = "",
  disabled = false,
  maxDate = new Date(),
  minYear = 1940,
  maxYear = new Date().getFullYear(),
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Active view state for the calendar (Month & Year)
  const initialDate = parseDateValue(value) || new Date(2004, 0, 1);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);

  // Sync view when value changes from outside
  useEffect(() => {
    const parsed = parseDateValue(value);
    if (parsed) {
      setViewYear(parsed.getFullYear());
      setViewMonth(parsed.getMonth());
    }
  }, [value]);

  // Handle click outside to close flyout
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearDropdown(false);
        setShowMonthDropdown(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedDate = parseDateValue(value);
  const today = new Date();
  const maxDateObj = maxDate ? (maxDate instanceof Date ? maxDate : new Date(maxDate)) : null;

  // Calendar calculations
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day) => {
    const chosen = new Date(viewYear, viewMonth, day);
    if (maxDateObj && chosen > maxDateObj) return;

    const formatted = formatDateDisplay(chosen);
    onChange?.(formatted);
    setIsOpen(false);
    setShowYearDropdown(false);
    setShowMonthDropdown(false);
  };

  const handleSelectToday = () => {
    const formatted = formatDateDisplay(today);
    onChange?.(formatted);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange?.("");
    setIsOpen(false);
  };

  // Year options list for fast jumping
  const yearOptions = [];
  for (let y = maxYear; y >= minYear; y--) {
    yearOptions.push(y);
  }

  // Days grid generation
  const calendarDays = [];

  // Trailing days from previous month
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({
      day: d,
      monthOffset: -1,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      monthOffset: 0,
      isCurrentMonth: true,
    });
  }

  // Leading days for next month to complete 6 rows (42 cells) or 5 rows
  const remainingCells = 42 - calendarDays.length;
  for (let d = 1; d <= (remainingCells >= 7 ? remainingCells % 7 + 7 : remainingCells); d++) {
    calendarDays.push({
      day: d,
      monthOffset: 1,
      isCurrentMonth: false,
    });
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Trigger Field */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onClick={() => {
            if (!disabled) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={`w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs font-medium text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${className}`}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          className={`absolute right-2.5 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isOpen
              ? "text-emerald-600 bg-emerald-50"
              : "text-neutral-400 hover:text-emerald-600 hover:bg-black/5"
          }`}
          title="Open calendar flyout"
          aria-label="Toggle calendar"
        >
          <CalendarIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Modern Themed Calendar Flyout Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto top-full mt-2 w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-black/10 p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-[#111111]">
          {/* Header: Month & Year selection with Previous / Next navigation */}
          <div className="flex items-center justify-between gap-1 mb-3 pb-2.5 border-b border-neutral-100">
            <div className="flex items-center gap-1">
              {/* Month Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthDropdown((prev) => !prev);
                    setShowYearDropdown(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#111111] transition-colors cursor-pointer"
                >
                  <span>{MONTH_NAMES[viewMonth]}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {showMonthDropdown && (
                  <div className="absolute left-0 top-full mt-1.5 w-36 max-h-48 overflow-y-auto bg-white rounded-2xl shadow-xl border border-black/10 p-1.5 z-50 grid grid-cols-1 gap-0.5">
                    {MONTH_NAMES.map((m, idx) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setViewMonth(idx);
                          setShowMonthDropdown(false);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          viewMonth === idx
                            ? "bg-emerald-600 text-white font-bold"
                            : "hover:bg-emerald-50 text-neutral-700"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Year Selector Pill */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearDropdown((prev) => !prev);
                    setShowMonthDropdown(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-bold text-[#111111] transition-colors cursor-pointer"
                >
                  <span>{viewYear}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-500" />
                </button>

                {showYearDropdown && (
                  <div className="absolute left-0 top-full mt-1.5 w-28 max-h-48 overflow-y-auto bg-white rounded-2xl shadow-xl border border-black/10 p-1.5 z-50 flex flex-col gap-0.5">
                    {yearOptions.map((y) => (
                      <button
                        key={y}
                        type="button"
                        onClick={() => {
                          setViewYear(y);
                          setShowYearDropdown(false);
                        }}
                        className={`text-left px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                          viewYear === y
                            ? "bg-emerald-600 text-white font-bold"
                            : "hover:bg-emerald-50 text-neutral-700"
                        }`}
                      >
                        {y}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-xl hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 py-1"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {calendarDays.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={index}
                    className="h-8 flex items-center justify-center text-xs font-medium text-neutral-300 select-none"
                  >
                    {item.day}
                  </div>
                );
              }

              const itemDate = new Date(viewYear, viewMonth, item.day);
              const isSelected =
                selectedDate &&
                selectedDate.getFullYear() === viewYear &&
                selectedDate.getMonth() === viewMonth &&
                selectedDate.getDate() === item.day;

              const isToday =
                today.getFullYear() === viewYear &&
                today.getMonth() === viewMonth &&
                today.getDate() === item.day;

              const isFuture = maxDateObj && itemDate > maxDateObj;

              return (
                <button
                  key={index}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleSelectDay(item.day)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : isToday
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-extrabold hover:bg-emerald-100"
                      : isFuture
                      ? "text-neutral-300 cursor-not-allowed"
                      : "text-neutral-800 hover:bg-neutral-100 hover:text-emerald-700"
                  }`}
                >
                  {item.day}
                </button>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleClear}
              className="text-[11px] font-bold text-neutral-500 hover:text-rose-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={handleSelectToday}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
