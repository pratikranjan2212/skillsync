"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sparkles, User, Mail, Lock, ArrowRight, Check, Eye, EyeOff } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

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

  const passwordValue = watch("password") || "";

  // Password constraints evaluations
  const passwordCriteria = [
    { label: "At least 8 characters", valid: passwordValue.length >= 8 },
    { label: "One uppercase letter (A-Z)", valid: /[A-Z]/.test(passwordValue) },
    { label: "One lowercase letter (a-z)", valid: /[a-z]/.test(passwordValue) },
    { label: "One number (0-9)", valid: /[0-9]/.test(passwordValue) },
    { label: "One special character (!@#$...)", valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(passwordValue) },
  ];

  const passwordRegister = register("password", {
    required: "Password is required",
    validate: (val) => {
      if (!val || val.length < 8) return "Password must be at least 8 characters long";
      if (!/[A-Z]/.test(val)) return "Password must contain at least one uppercase letter (A-Z)";
      if (!/[a-z]/.test(val)) return "Password must contain at least one lowercase letter (a-z)";
      if (!/[0-9]/.test(val)) return "Password must contain at least one number (0-9)";
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(val))
        return "Password must contain at least one special character";
      return true;
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: "student" }),
      });

      if (res.ok) {
        // Set client fallback session cookies
        document.cookie = "skillsync_session=active-token; path=/;";
        document.cookie = "next-auth.session-token=active-token; path=/;";
        document.cookie = "skillsync_role=student; path=/;";
        window.location.href = "/dashboard";
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
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-6 sm:px-8 pt-2 sm:pt-4 pb-12 w-full">
        <div className="bg-white rounded-4xl px-8 sm:px-10 py-8 shadow-xl border border-black/5 flex flex-col gap-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-full border border-emerald-200">
              <Sparkles className="w-4 h-4" />
              Student Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-2.5">Create Student Account</h1>
            <p className="text-sm text-[#494D4D] mt-1">
              Build your automated Skill Passport and match with top internship listings.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-sm font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Alex Chen"
                  {...register("fullName", {
                    required: "Full name is required",
                    minLength: { value: 2, message: "Full name must be at least 2 characters" },
                  })}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.fullName && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-1.5">
                Student Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="alex.chen@university.edu"
                  {...register("email", {
                    required: "Student email is required",
                    pattern: {
                      value: /^\S+@\S+\.\S+$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...passwordRegister}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={(e) => {
                    passwordRegister.onBlur(e);
                    setIsPasswordFocused(false);
                  }}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>}

              {/* Password Requirements Checklist - Only appears when user focuses/clicks on password input */}
              {isPasswordFocused && (
                <div className="mt-2.5 p-3.5 bg-[#F8F9FA] rounded-2xl border border-black/5 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
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
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-colors ${
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-4 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? "Creating Account..." : "Create Account & Continue"}</span>
              <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
            </button>
          </form>

          <div className="text-center text-sm text-[#494D4D]">
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
