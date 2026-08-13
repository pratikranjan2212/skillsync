"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

/**
 * Sign In Screen.
 * Supports Student and Admin sign in with one-click demo login presets.
 */
export default function SignInPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "alex.chen@skillsync.edu",
      password: "password123",
      role: "student",
    },
  });

  const handleDemoSignIn = async (roleType) => {
    setIsSubmitting(true);
    setErrorMsg("");

    const email = roleType === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu";
    setValue("email", email);
    setValue("role", roleType);

    try {
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: "demo", role: roleType }),
      });

      if (res.ok) {
        document.cookie = `skillsync_session=active-token; path=/;`;
        document.cookie = `skillsync_role=${roleType}; path=/;`;

        router.push("/dashboard");
      } else {
        setErrorMsg("Demo sign in failed.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during demo sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const assignedRole = data.email.includes("admin") ? "admin" : "student";
      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: assignedRole }),
      });

      if (res.ok) {
        document.cookie = `skillsync_session=active-token; path=/;`;
        document.cookie = `skillsync_role=${assignedRole}; path=/;`;

        router.push("/dashboard");
      } else {
        setErrorMsg("Invalid credentials.");
      }
    } catch (err) {
      setErrorMsg("Sign in error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-12">
      <Navbar />

      <main className="max-w-md mx-auto px-4 pt-4">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col gap-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <LogIn className="w-3.5 h-3.5 text-emerald-600" />
              SkillSync Authentication
            </span>
            <h1 className="text-2xl font-extrabold text-[#111111] mt-3">Welcome Back</h1>
            <p className="text-xs text-[#494D4D] mt-1">
              Sign in to manage your evidence, view your Skill Passport, or open Admin Console.
            </p>
          </div>

          {/* One-Click Quick Demo Sign In Presets */}
          <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/5 flex flex-col gap-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
              ⚡ Quick Demo One-Click Sign In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("student")}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <UserCheck className="w-4 h-4" />
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("admin")}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Demo Admin</span>
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#111111] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
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
                  {...register("password", { required: "Password is required" })}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </form>

          <div className="text-center text-xs text-[#494D4D]">
            Don't have an account yet?{" "}
            <Link href="/signup" className="font-bold text-[#111111] hover:underline">
              Register as Student
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
