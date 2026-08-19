"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const emailParam = searchParams.get("email");
  const registered = searchParams.get("registered") === "true";

  const [status, setStatus] = useState("idle"); // "idle" | "verifying" | "success" | "error"
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState(emailParam || "");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (tokenParam && emailParam) {
      const verifyToken = async () => {
        setStatus("verifying");
        try {
          const res = await fetch(
            `/api/auth/verify-email?token=${encodeURIComponent(tokenParam)}&email=${encodeURIComponent(emailParam)}`
          );
          const data = await res.json();
          if (res.ok) {
            setStatus("success");
            setMessage("Your email address has been successfully verified!");
          } else {
            setStatus("error");
            setMessage(data.error || "Verification failed. The token may be expired or invalid.");
          }
        } catch {
          setStatus("error");
          setMessage("An unexpected error occurred during verification.");
        }
      };

      verifyToken();
    }
  }, [tokenParam, emailParam]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendSuccess(true);
      } else {
        setMessage(data.error || "Failed to resend verification link.");
      }
    } catch {
      setMessage("Failed to send verification request.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-8 pt-4 sm:pt-6 w-full">
        <div className="bg-white rounded-3xl sm:rounded-4xl px-5 sm:px-10 py-6 sm:py-8 shadow-xl border border-black/5 flex flex-col gap-5 sm:gap-6 text-center">
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4 py-8">
              <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
              <h2 className="text-xl font-bold text-[#111111]">Verifying Your Email Address...</h2>
              <p className="text-xs text-[#494D4D]">Please wait while we confirm your cryptographic verification token.</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">Email Verified!</h1>
              <p className="text-sm text-[#494D4D]">{message}</p>
              <Link
                href="/signin"
                className="mt-4 w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-[#111111]">Verification Failed</h1>
              <p className="text-sm text-rose-700 font-medium">{message}</p>
            </div>
          )}

          {status === "idle" && (
            <div className="flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <MailCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111]">
                {registered ? "Verify Your Account" : "Email Verification"}
              </h1>
              <p className="text-xs sm:text-sm text-[#494D4D] leading-relaxed">
                {registered
                  ? `We've generated a verification link for ${emailParam ? emailParam : "your email"}. Please check your inbox to activate your account.`
                  : "Enter your registered email address below to receive a new email verification link."}
              </p>
            </div>
          )}

          {status !== "success" && (
            <div className="pt-4 border-t border-black/5 text-left">
              <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                Resend Verification Link
              </h3>

              {resendSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200">
                  Verification email sent! Please check your inbox and click the link within 24 hours.
                </div>
              ) : (
                <form onSubmit={handleResend} className="flex flex-col gap-2.5">
                  <input
                    type="email"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="student@university.edu"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F5F5F3] border border-black/5 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{resending ? "Sending..." : "Send Verification Email"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="pt-2 text-center text-xs text-[#494D4D]">
            Already verified?{" "}
            <Link href="/signin" className="font-bold text-[#111111] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F5F3]" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
