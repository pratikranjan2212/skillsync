"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Mail, Lock, ArrowRight, ShieldCheck, GraduationCap } from "lucide-react";
import { signIn } from "next-auth/react";
import Navbar from "@/app/components/layout/Navbar";
import { GitHubIcon } from "@/app/components/icons";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "admin" ? "admin" : "student";
  
  const [authRole, setAuthRole] = useState(initialRole);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "admin") {
      setAuthRole("admin");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    setValue,
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
      const assignedRole = authRole === "admin" ? "admin" : "student";
      const targetDestination = assignedRole === "admin" ? "/admin" : "/dashboard";

      const res = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, role: assignedRole }),
      });

      if (res.ok) {
        document.cookie = `skillsync_session=active-token; path=/;`;
        document.cookie = `authjs.session-token=active-token; path=/;`;
        document.cookie = `next-auth.session-token=active-token; path=/;`;
        document.cookie = `skillsync_role=${assignedRole}; path=/;`;

        try {
          await signIn("credentials", {
            email: data.email.toLowerCase().trim(),
            password: data.password,
            callbackUrl: targetDestination,
            redirect: false,
          });
        } catch {
        }

        window.location.href = targetDestination;
      } else {
        setErrorMsg("Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setErrorMsg("Sign in error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-6 sm:px-8 pt-4 sm:pt-6 w-full">
        <div className="bg-white rounded-4xl px-8 sm:px-10 py-8 shadow-xl border border-black/5 flex flex-col gap-6">
          {/* Role Switcher Tabs */}
          <div className="flex bg-[#F5F5F3] p-1.5 rounded-2xl border border-black/5">
            <button
              type="button"
              onClick={() => {
                setAuthRole("student");
                setErrorMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                authRole === "student"
                  ? "bg-white text-neutral-950 shadow-sm"
                  : "text-[#494D4D] hover:text-[#111111]"
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${authRole === "student" ? "text-emerald-600" : "text-neutral-500"}`} />
              <span>Student Portal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthRole("admin");
                setErrorMsg("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                authRole === "admin"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-[#494D4D] hover:text-[#111111]"
              }`}
            >
              <ShieldCheck className={`w-4 h-4 ${authRole === "admin" ? "text-emerald-400" : "text-neutral-500"}`} />
              <span>Administrator</span>
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {authRole === "admin" ? "Administrator Sign In" : "Welcome Back"}
            </h1>
            <p className="text-xs sm:text-sm text-[#494D4D] mt-1.5">
              {authRole === "admin"
                ? "Sign in with administrator credentials to manage verification pipelines, taxonomy, and audit logs."
                : "Sign in to manage your evidence records and access your verified Skill Passport."}
            </p>
          </div>

          {authRole === "student" && (
            <>
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
            </>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-rose-50 text-rose-800 text-xs sm:text-sm font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                {authRole === "admin" ? "Administrator Email" : "Student Email Address"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  placeholder={authRole === "admin" ? "admin@skillsync.edu" : "student@university.edu"}
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
              <label className="block text-xs sm:text-sm font-bold text-[#111111] mb-1.5">
                Password <span className="text-red-500">*</span>
              </label>
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
              className={`mt-2 w-full py-3.5 px-4 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer ${
                authRole === "admin"
                  ? "bg-slate-900 hover:bg-black"
                  : "bg-neutral-900 hover:bg-neutral-800"
              }`}
            >
              <span>
                {isSubmitting
                  ? "Authenticating..."
                  : authRole === "admin"
                  ? "Sign In as Administrator"
                  : "Sign In to Dashboard"}
              </span>
              <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
            </button>
          </form>

          {authRole === "student" ? (
            <div className="text-center text-xs sm:text-sm text-[#494D4D]">
              Don't have an account yet?{" "}
              <Link href="/signup" className="font-bold text-[#111111] hover:underline">
                Register as Student
              </Link>
            </div>
          ) : (
            <div className="text-center text-xs text-[#494D4D]">
              Authorized administrator access only. All actions are logged and audited.
            </div>
          )}
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


