"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  Headphones,
  Mail,
  HelpCircle,
  BookOpen,
  Send,
  CheckCircle2,
  FileCheck,
  Award,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  MessageSquare
} from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import RollingText from "@/app/components/ui/RollingText";

export default function SupportPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsSubmitted(true);
      reset();
    }, 1200);
  };

  const supportCategories = [
    {
      icon: FileCheck,
      title: "Evidence & OCR Verification",
      desc: "Troubleshooting QR code detection, OCR transcript scanning, or file upload formats (PNG, JPG, PDF).",
      link: "/docs#verification",
    },
    {
      icon: Award,
      title: "Skill Passport & PDF Export",
      desc: "Resolving public share link tokens, category grouping, and PDF signature rendering issues.",
      link: "/docs#passport-export",
    },
    {
      icon: Sparkles,
      title: "Match Engine & Ranking",
      desc: "Questions about match score calculations, missing skill analysis, and demographic exclusion.",
      link: "/docs#match-engine",
    },
    {
      icon: ShieldCheck,
      title: "Privacy & Data Rights",
      desc: "FERPA compliance, account deletion, or algorithmic fairness audit inquiries.",
      link: "/privacy",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl 2xl:max-w-384 mx-auto px-3.5 sm:px-6 2xl:px-8 py-6 sm:py-8 w-full flex-1">
        <div className="bg-white rounded-3xl sm:rounded-4xl p-5 sm:p-10 shadow-md border border-black/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 inline-flex items-center gap-1.5">
                <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                <span>SkillSync Help & Support Hub</span>
              </span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Systems Operational
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111111] mt-3 tracking-tight">
              How Can We Help You?
            </h1>
            <p className="text-sm sm:text-base text-[#494D4D] mt-2 max-w-2xl leading-relaxed">
              Find answers in our developer documentation, browse frequently asked questions, or submit a support ticket to our technical team.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#F5F5F3] text-[#111111] hover:bg-[#EAEAEA] rounded-2xl font-bold text-xs border border-black/5 transition-all shadow-xs"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Read Documentation</span>
            </Link>
            <Link
              href="/#faq"
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-neutral-900 text-white hover:bg-neutral-800 rounded-2xl font-bold text-xs shadow-md transition-all"
            >
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Browse FAQs</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {supportCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-[28px] p-6 shadow-xs border border-black/5 flex flex-col justify-between gap-4 hover:shadow-md transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#111111]">{cat.title}</h3>
                  <p className="text-xs text-[#494D4D] mt-2 leading-relaxed">{cat.desc}</p>
                </div>

                <Link
                  href={cat.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 pt-2 border-t border-neutral-100"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5 flex flex-col justify-between gap-6">
            <div>
              <span className="px-3 py-1 bg-[#F5F5F3] text-[#494D4D] text-[11px] font-bold uppercase tracking-wider rounded-xl border border-black/5">
                Direct Channels
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3">Get in Touch Directly</h2>
              <p className="text-xs sm:text-sm text-[#494D4D] mt-2 leading-relaxed">
                Our support team is available Monday through Friday to assist students, university partners, and recruiters.
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-start gap-3">
                  <Mail className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#111111]">Student & User Support</div>
                    <a href="mailto:skillsyncauto@gmail.com" className="text-xs text-emerald-700 font-mono hover:underline">
                      skillsyncauto@gmail.com
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#111111]">Institutional & University Registrar</div>
                    <a href="mailto:registrar@skillsync.edu" className="text-xs text-emerald-700 font-mono hover:underline">
                      registrar@skillsync.edu
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-black/5 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#111111]">Response SLA</div>
                    <p className="text-xs text-[#494D4D]">We aim to reply to all tickets within 24 business hours.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All communications are protected under our non-disclosure policy.</span>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-4xl p-6 sm:p-8 shadow-sm border border-black/5">
            <div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold uppercase tracking-wider rounded-xl border border-emerald-200">
                Support Ticket
              </span>
              <h2 className="text-2xl font-black text-[#111111] mt-3">Send Us a Message</h2>
              <p className="text-xs sm:text-sm text-[#494D4D] mt-1">
                Fill out the details below and a specialist will inspect your issue.
              </p>
            </div>

            {isSubmitted ? (
              <div className="mt-6 p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center flex flex-col items-center gap-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-emerald-950">Support Ticket Created!</h3>
                <p className="text-xs text-emerald-800 max-w-sm">
                  We've received your request. A confirmation email has been dispatched with reference ticket #{Math.floor(100000 + Math.random() * 900000)}.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Alex Chen"
                      {...register("name", { required: "Name is required" })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111111] mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="alex.chen@university.edu"
                      {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+\.\S+$/i, message: "Valid email required" },
                      })}
                      className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">Issue Category</label>
                  <select
                    {...register("category")}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="evidence">Evidence Upload & OCR Scanning</option>
                    <option value="passport">Skill Passport Export / Sharing</option>
                    <option value="matching">Job Match Score & Citations</option>
                    <option value="account">Account & Authentication</option>
                    <option value="general">Other Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of the problem..."
                    {...register("subject", { required: "Subject is required" })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.subject && <p className="text-[11px] text-rose-600 mt-1">{errors.subject.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111111] mb-1.5">
                    Message Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Provide specific details, including any error messages or token IDs..."
                    {...register("message", { required: "Message is required" })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  onMouseEnter={() => setHoveredBtn(true)}
                  onMouseLeave={() => setHoveredBtn(false)}
                  className="mt-2 w-full py-4 px-6 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <RollingText
                    text={isSending ? "Submitting Ticket..." : "Submit Support Request"}
                    autoPlay={hoveredBtn}
                    animationTrigger="onAppear"
                    rollDuration={0.4}
                    staggerDelay={0.015}
                    textColor="#FFFFFF"
                    font={{ fontSize: "12px", fontWeight: "700", lineHeight: "1.2em" }}
                  />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

