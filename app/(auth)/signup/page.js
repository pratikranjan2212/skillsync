"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sparkles, User, Mail, Lock, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

function setSignupCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "skillsync_session=active-token; path=/;";
  document.cookie = "next-auth.session-token=active-token; path=/;";
  document.cookie = "skillsync_role=student; path=/;";
}

/**
 * Student Registration Screen.
 * Single-role sign-up (Student only; Admin is seeded manually).
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const passwordValue = watch("password") || "";

  const passwordCriteria = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(passwordValue) },
    { label: "One number (0-9)", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character (!@#$...)", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(passwordValue) },
  ];

  const isPasswordValid = passwordCriteria.every((c) => c.valid);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");

    if (!isPasswordValid) {
      setErrorMsg("Please satisfy all password complexity requirements.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "student" }),
      });

      if (res.ok) {
        setSignupCookies();
        router.push("/dashboard");
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-16 flex flex-col justify-start">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-4 w-full">
        <div className="bg-white rounded-4xl p-6 sm:p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              Join SkillSync Ecosystem
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-2">
              Create Student Account
            </h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Start building your verified Skill Passport with automated evidence parsing.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Alex Chen"
                  {...register("fullName", { required: "Full Name is required" })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.fullName && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="alex.chen@skillsync.edu"
                  {...register("email", {
                    required: "Email Address is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  {...register("password", { required: "Password is required" })}
                  onFocus={() => setIsPasswordFocused(true)}
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 mt-1 font-medium">{errors.password.message}</p>
              )}

              {(isPasswordFocused || passwordValue.length > 0) && (
                <div className="mt-3 p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 space-y-1.5 animate-in fade-in duration-150">
                  <div className="text-[11px] font-bold text-[#494D4D] mb-1">Password Requirements:</div>
                  {passwordCriteria.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px]">
                      {c.valid ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 font-extrabold" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-neutral-300 flex items-center justify-center text-[9px] text-neutral-400">
                          •
                        </div>
                      )}
                      <span className={c.valid ? "text-emerald-950 font-bold" : "text-neutral-500 font-medium"}>
                        {c.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? "Creating Student Account..." : "Create Account"}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          <div className="text-center text-xs text-[#494D4D]">
            Already have an account?{" "}
            <Link href="/signin" className="font-bold text-[#111111] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
