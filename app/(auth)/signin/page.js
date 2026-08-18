"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";
import Navbar from "@/app/components/layout/Navbar";
import { GitHubIcon } from "@/app/components/icons";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        if (res.error.includes("Too many failed")) {
          setErrorMsg("Too many failed login attempts. Please wait 15 minutes.");
        } else {
          setErrorMsg("Invalid email or password. Please verify your credentials.");
        }
      } else if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMsg("Sign in error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-8 pt-4 sm:pt-6 w-full">
        <div className="bg-white rounded-3xl sm:rounded-4xl px-5 sm:px-10 py-6 sm:py-8 shadow-xl border border-black/5 flex flex-col gap-5 sm:gap-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-xs sm:text-sm font-bold rounded-full border border-emerald-200">
              <Sparkles className="w-4 h-4" />
              SkillSync Student Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-2.5">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1.5">
              Sign in to manage your evidence records and access your verified Skill Passport.
            </p>
          </div>

          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl: "/dashboard", redirectTo: "/dashboard" })}
            className="w-full py-3 px-4 bg-[#24292F] hover:bg-[#1B1F23] text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
          >
            <GitHubIcon className="w-4 h-4 fill-current" />
            <span>Continue with GitHub</span>
          </button>

          <div className="relative flex items-center justify-center my-0.5">
            <div className="border-t border-black/10 w-full"></div>
            <span className="bg-white px-3 text-xs uppercase font-bold text-[#666666] tracking-wider shrink-0">
              or with email
            </span>
            <div className="border-t border-black/10 w-full"></div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 text-rose-800 text-xs sm:text-sm font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  {...register("email", {
                    required: "Email Address is required",
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

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[#111111]">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.password && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
            </button>
          </form>

          <div className="text-center text-xs sm:text-sm text-[#494D4D]">
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

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F3]" />}>
      <SignInContent />
    </Suspense>
  );
}
