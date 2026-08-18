"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, ArrowRight, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const json = await res.json();
      if (res.ok) {
        setSubmittedEmail(data.email);
      } else {
        setErrorMsg(json.error || "Failed to submit request. Please try again.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-8 pt-4 sm:pt-6 w-full">
        <div className="bg-white rounded-3xl sm:rounded-4xl px-5 sm:px-10 py-6 sm:py-8 shadow-xl border border-black/5 flex flex-col gap-5 sm:gap-6">
          <div className="flex items-center justify-start">
            <Link
              href="/signin"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#494D4D] hover:text-[#111111] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-3 border border-amber-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1.5">
              Enter your registered email address and we'll send you secure instructions to reset your password.
            </p>
          </div>

          {submittedEmail ? (
            <div className="p-5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Reset Instructions Sent</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                If an account with <strong>{submittedEmail}</strong> exists, password reset instructions have been generated.
                The reset token expires in <strong>1 hour</strong>.
              </p>
              <div className="pt-2 border-t border-emerald-200 flex flex-col gap-2">
                <Link
                  href={`/reset-password?email=${encodeURIComponent(submittedEmail)}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  Have a reset token? Click here to set your new password &rarr;
                </Link>
                <button
                  type="button"
                  onClick={() => setSubmittedEmail(null)}
                  className="text-xs text-[#494D4D] hover:underline text-left cursor-pointer"
                >
                  Try another email address
                </button>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 text-rose-800 text-xs sm:text-sm font-semibold rounded-2xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                    Account Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      placeholder="student@university.edu"
                      {...register("email", {
                        required: "Email address is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/i,
                          message: "Please enter a valid email address",
                        },
                      })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-1 w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? "Generating Request..." : "Send Reset Instructions"}</span>
                  <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
                </button>
              </form>
            </>
          )}

          <div className="text-center text-xs sm:text-sm text-[#494D4D]">
            Remember your password?{" "}
            <Link href="/signin" className="font-bold text-[#111111] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
