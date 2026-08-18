"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Lock, ArrowRight, ArrowLeft, KeyRound, CheckCircle2, Eye, EyeOff, Check, Key } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlToken = searchParams.get("token") || "";
  const urlEmail = searchParams.get("email") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: urlEmail,
      token: urlToken,
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (urlToken) setValue("token", urlToken);
    if (urlEmail) setValue("email", urlEmail);
  }, [urlToken, urlEmail, setValue]);

  const passwordValue = watch("password") || "";

  const passwordCriteria = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(passwordValue) },
    { label: "One number (0-9)", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character (!@#$...)", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(passwordValue) },
  ];

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          token: data.token,
          password: data.password,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setErrorMsg(json.error || "Failed to reset password. Please verify your token.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred.");
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-3 border border-emerald-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              Create New Password
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1.5">
              Enter your reset token and choose a strong, secure new password.
            </p>
          </div>

          {success ? (
            <div className="p-5 bg-emerald-50 text-emerald-900 rounded-2xl border border-emerald-200 flex flex-col gap-3">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Password Reset Complete!</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Your password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-2 border-t border-emerald-200">
                <Link
                  href="/signin"
                  className="w-full py-3 px-4 bg-neutral-900 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors"
                >
                  <span>Sign In Now</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3.5 bg-rose-50 text-rose-800 text-xs sm:text-sm font-semibold rounded-2xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                    Account Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="student@university.edu"
                    {...register("email", { required: "Email is required" })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                    Reset Token <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Key className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      placeholder="Paste 64-character reset token"
                      {...register("token", { required: "Reset token is required" })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {errors.token && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.token.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("password", {
                        required: "New password is required",
                        validate: (val) => {
                          if (!val || val.length < 8) return "Must be at least 8 characters";
                          if (!/[A-Z]/.test(val)) return "Requires uppercase letter";
                          if (!/[a-z]/.test(val)) return "Requires lowercase letter";
                          if (!/[0-9]/.test(val)) return "Requires numeric digit";
                          if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val))
                            return "Requires special character";
                          return true;
                        },
                      })}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>
                  )}

                  {isPasswordFocused && (
                    <div className="mt-2.5 p-3.5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-1.5 animate-in fade-in duration-200">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">
                        Password Requirements:
                      </span>
                      <div className="grid grid-cols-1 gap-1.5">
                        {passwordCriteria.map((item, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                              item.valid ? "text-emerald-700 font-semibold" : "text-neutral-400"
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                item.valid ? "bg-emerald-600 text-white" : "bg-neutral-200 text-neutral-400"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5" />
                            </div>
                            <span>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...register("confirmPassword", {
                        required: "Please confirm your new password",
                        validate: (val) => val === passwordValue || "Passwords do not match",
                      })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  <span>{isSubmitting ? "Updating Password..." : "Reset Password & Continue"}</span>
                  <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F3]" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
