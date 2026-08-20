"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Send, ShieldCheck } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

// ─── 6-Box OTP Input ────────────────────────────────────────────────────────

function OtpInput({ otp, setOtp, disabled }) {
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Accept only a single digit
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance to next box after entering a digit
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous box
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const newOtp = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    // Focus the box after the last pasted digit (or the last box)
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-xl sm:text-2xl font-black rounded-2xl border-2 transition-all focus:outline-none bg-[#F5F5F3]
            ${digit
              ? "border-emerald-500 bg-emerald-50 text-emerald-900"
              : "border-black/10 text-[#111111]"
            }
            focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200
            disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Main Content ────────────────────────────────────────────────────────────

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");
  const registered = searchParams.get("registered") === "true";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [status, setStatus] = useState("idle"); // "idle" | "submitting" | "success" | "error"
  const [errorMsg, setErrorMsg] = useState("");

  // Resend section state
  const [resendEmail, setResendEmail] = useState(emailParam || "");
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState("");

  const isOtpComplete = otp.every((d) => d !== "");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!isOtpComplete) return;

    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: resendEmail || emailParam,
          otp: otp.join(""),
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error || "Verification failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("An unexpected error occurred. Please try again.");
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    setResendError("");
    setResendSuccess(false);

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });
      const data = await res.json();

      if (res.ok) {
        setResendSuccess(true);
        // Reset the OTP boxes so user can enter the new code
        setOtp(["", "", "", "", "", ""]);
        setStatus("idle");
        setErrorMsg("");
      } else {
        setResendError(data.error || "Failed to resend OTP.");
      }
    } catch {
      setResendError("Failed to send request. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#111111] flex flex-col justify-start pb-12">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 sm:px-8 pt-4 sm:pt-6 w-full">
        <div className="bg-white rounded-3xl sm:rounded-4xl px-5 sm:px-10 py-6 sm:py-8 shadow-xl border border-black/5 flex flex-col gap-6 text-center">

          {/* ── Success State ── */}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                Email Verified!
              </h1>
              <p className="text-sm text-[#494D4D] leading-relaxed">
                Your email has been successfully verified. You can now sign in to your SkillSync account.
              </p>
              <Link
                href="/signin"
                className="mt-2 w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <span>Proceed to Sign In</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          )}

          {/* ── Idle / Error / Submitting State ── */}
          {status !== "success" && (
            <>
              {/* Header */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  {status === "submitting"
                    ? <RefreshCw className="w-8 h-8 animate-spin" />
                    : <MailCheck className="w-8 h-8" />}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
                  {registered ? "Check Your Email" : "Email Verification"}
                </h1>
                <p className="text-xs sm:text-sm text-[#494D4D] leading-relaxed max-w-xs">
                  {registered
                    ? <>We sent a <strong>6-digit code</strong> to <strong className="text-[#111111]">{emailParam || "your email"}</strong>. Enter it below to verify your account.</>
                    : "Enter your registered email and the 6-digit code sent to your inbox."}
                </p>
              </div>

              {/* OTP form */}
              <form onSubmit={handleVerify} className="flex flex-col gap-5">
                <OtpInput otp={otp} setOtp={setOtp} disabled={status === "submitting"} />

                {/* Error message */}
                {status === "error" && errorMsg && (
                  <div className="flex items-start gap-2.5 p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!isOtpComplete || status === "submitting"}
                  className="w-full py-3.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {status === "submitting" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Verify Email</span>
                    </>
                  )}
                </button>
              </form>

              {/* Resend section */}
              <div className="pt-4 border-t border-black/5 text-left">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-2">
                  Didn&apos;t receive the code?
                </h3>

                {resendSuccess ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl font-medium border border-emerald-200">
                    A new 6-digit code has been sent! Please check your inbox and enter it above.
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
                    {resendError && (
                      <p className="text-xs text-rose-600 font-medium">{resendError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={resending}
                      className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{resending ? "Sending..." : "Resend Code"}</span>
                    </button>
                  </form>
                )}
              </div>
            </>
          )}

          <div className="pt-1 text-center text-xs text-[#494D4D]">
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
