"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Sparkles, User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

/**
 * Student Registration Screen.
 * Single-role sign-up (Student only; Admin is seeded manually).
 */
export default function SignUpPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
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

      <main className="max-w-md mx-auto px-4 pt-6">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              Student Registration
            </span>
            <h1 className="text-2xl font-extrabold text-[#111111] mt-3">Create Student Account</h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Build your automated Skill Passport and match with top internship listings.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Alex Chen"
                  {...register("fullName", { required: "Full name is required" })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.fullName && <p className="text-[11px] text-rose-600 mt-1">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="alex.chen@university.edu"
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                  })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? "Creating Account..." : "Create Account & Continue"}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          {/* Guarantee pill */}
          <div className="p-3 bg-[#F8F9FA] rounded-2xl border border-black/5 text-[11px] text-[#494D4D] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Self-verifying infrastructure. No manual verifier approval required.</span>
          </div>

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
