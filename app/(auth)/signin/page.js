// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
// import Navbar from "@/app/components/layout/Navbar";

// /**
//  * Sign In Screen.
//  * Supports Student and Admin sign in with one-click demo login presets.
//  */
// export default function SignInPage() {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "alex.chen@skillsync.edu",
//       password: "password123",
//       role: "student",
//     },
//   });

//   const handleDemoSignIn = async (roleType) => {
//     setIsSubmitting(true);
//     setErrorMsg("");

//     const email = roleType === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu";
//     setValue("email", email);
//     setValue("role", roleType);

//     try {
//       const res = await fetch("/api/auth/callback/credentials", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password: "demo", role: roleType }),
//       });

//       if (res.ok) {
//         document.cookie = `skillsync_session=active-token; path=/;`;
//         document.cookie = `skillsync_role=${roleType}; path=/;`;

//         router.push("/dashboard");
//       } else {
//         setErrorMsg("Demo sign in failed.");
//       }
//     } catch (err) {
//       setErrorMsg("An error occurred during demo sign in.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     setErrorMsg("");
//     try {
//       const assignedRole = data.email.includes("admin") ? "admin" : "student";
//       const res = await fetch("/api/auth/callback/credentials", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, role: assignedRole }),
//       });

//       if (res.ok) {
//         document.cookie = `skillsync_session=active-token; path=/;`;
//         document.cookie = `skillsync_role=${assignedRole}; path=/;`;

//         router.push("/dashboard");
//       } else {
//         setErrorMsg("Invalid credentials.");
//       }
//     } catch (err) {
//       setErrorMsg("Sign in error.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-12">
//       <Navbar />

//       <main className="max-w-md mx-auto px-4 pt-4">
//         <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col gap-6">
//           <div className="text-center">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
//               <LogIn className="w-3.5 h-3.5 text-emerald-600" />
//               SkillSync Authentication
//             </span>
//             <h1 className="text-2xl font-extrabold text-[#111111] mt-3">Welcome Back</h1>
//             <p className="text-xs text-[#494D4D] mt-1">
//               Sign in to manage your evidence, view your Skill Passport, or open Admin Console.
//             </p>
//           </div>

//           {/* One-Click Quick Demo Sign In Presets */}
//           <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/5 flex flex-col gap-2.5">
//             <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
//               ⚡ Quick Demo One-Click Sign In
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => handleDemoSignIn("student")}
//                 className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
//               >
//                 <UserCheck className="w-4 h-4" />
//                 <span>Demo Student</span>
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleDemoSignIn("admin")}
//                 className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
//               >
//                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
//                 <span>Demo Admin</span>
//               </button>
//             </div>
//           </div>

//           {errorMsg && (
//             <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
//               {errorMsg}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//             {/* Email */}
//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Email Address</label>
//               <div className="relative">
//                 <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//               {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="password"
//                   {...register("password", { required: "Password is required" })}
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//               {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-1 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
//             >
//               <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
//               <ArrowRight className="w-4 h-4 text-emerald-400" />
//             </button>
//           </form>

//           <div className="text-center text-xs text-[#494D4D]">
//             Don't have an account yet?{" "}
//             <Link href="/signup" className="font-bold text-[#111111] hover:underline">
//               Register as Student
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { useForm } from "react-hook-form";
// import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
// import Navbar from "@/app/components/layout/Navbar";

// export default function SignInPage() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       email: "alex.chen@skillsync.edu",
//       password: "password123",
//       role: "student",
//     },
//   });

//   const handleDemoSignIn = async (roleType) => {
//     setIsSubmitting(true);
//     setErrorMsg("");

//     const email = roleType === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu";
//     setValue("email", email);
//     setValue("role", roleType);

//     try {
//       await fetch("/api/auth/callback/credentials", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password: "demo", role: roleType }),
//       });

//       document.cookie = `skillsync_session=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `next-auth.session-token=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `skillsync_role=${roleType}; path=/; max-age=86400; SameSite=Lax;`;

//       window.location.href = roleType === "admin" ? "/admin/fairness" : "/dashboard";
//     } catch (err) {
//       document.cookie = `skillsync_session=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `next-auth.session-token=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `skillsync_role=${roleType}; path=/; max-age=86400; SameSite=Lax;`;
//       window.location.href = roleType === "admin" ? "/admin/fairness" : "/dashboard";
//     }
//   };

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     setErrorMsg("");

//     try {
//       const assignedRole = data.email.toLowerCase().includes("admin") ? "admin" : "student";

//       await fetch("/api/auth/callback/credentials", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ ...data, role: assignedRole }),
//       });

//       document.cookie = `skillsync_session=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `next-auth.session-token=session-active-token; path=/; max-age=86400; SameSite=Lax;`;
//       document.cookie = `skillsync_role=${assignedRole}; path=/; max-age=86400; SameSite=Lax;`;

//       window.location.href = assignedRole === "admin" ? "/admin/fairness" : "/dashboard";
//     } catch (err) {
//       setErrorMsg("Sign in error. Please try again.");
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-12">
//       <Navbar />

//       <main className="max-w-md mx-auto px-4 pt-28 sm:pt-32">
//         <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col gap-6">
//           <div className="text-center">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
//               <LogIn className="w-3.5 h-3.5 text-emerald-600" />
//               SkillSync Authentication
//             </span>
//             <h1 className="text-2xl font-extrabold text-[#111111] mt-3">Welcome Back</h1>
//             <p className="text-xs text-[#494D4D] mt-1">
//               Sign in to manage your evidence, view your Skill Passport, or open Admin Console.
//             </p>
//           </div>

//           {/* One-Click Quick Demo Sign In Presets */}
//           <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/5 flex flex-col gap-2.5">
//             <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
//               ⚡ Quick Demo One-Click Sign In
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={() => handleDemoSignIn("student")}
//                 className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
//               >
//                 <UserCheck className="w-4 h-4" />
//                 <span>Demo Student</span>
//               </button>
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={() => handleDemoSignIn("admin")}
//                 className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
//               >
//                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
//                 <span>Demo Admin</span>
//               </button>
//             </div>
//           </div>

//           {errorMsg && (
//             <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
//               {errorMsg}
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Email Address</label>
//               <div className="relative">
//                 <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="email"
//                   {...register("email", { required: "Email is required" })}
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//               {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email.message}</p>}
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="password"
//                   {...register("password", { required: "Password is required" })}
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//               {errors.password && <p className="text-[11px] text-rose-600 mt-1">{errors.password.message}</p>}
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-1 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
//                   <span>Authenticating...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Sign In to Dashboard</span>
//                   <ArrowRight className="w-4 h-4 text-emerald-400" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="text-center text-xs text-[#494D4D]">
//             Don't have an account yet?{" "}
//             <Link href="/signup" className="font-bold text-[#111111] hover:underline">
//               Register as Student
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";
// import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, UserCheck, Loader2 } from "lucide-react";
// import Navbar from "@/app/components/layout/Navbar";

// export default function SignInPage() {
//   const [email, setEmail] = useState("alex.chen@skillsync.edu");
//   const [password, setPassword] = useState("password123");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const authenticateAndRedirect = (roleType, userEmail) => {
//     setIsSubmitting(true);
//     setErrorMsg("");

//     const targetEmail = userEmail || (roleType === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu");
//     const role = roleType || (targetEmail.toLowerCase().includes("admin") ? "admin" : "student");
//     const destination = role === "admin" ? "/admin/fairness" : "/dashboard";

//     const expires = new Date(Date.now() + 86400000).toUTCString();
//     document.cookie = `skillsync_session=session-active-token; expires=${expires}; path=/; SameSite=Lax;`;
//     document.cookie = `next-auth.session-token=session-active-token; expires=${expires}; path=/; SameSite=Lax;`;
//     document.cookie = `skillsync_role=${role}; expires=${expires}; path=/; SameSite=Lax;`;

//     fetch("/api/auth/callback/credentials", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email: targetEmail, password: "demo", role }),
//     }).catch((err) => console.log("Session API call:", err));

//     setTimeout(() => {
//       window.location.href = destination;
//     }, 150);
//   };

//   const handleDemoSignIn = (roleType) => {
//     const demoEmail = roleType === "admin" ? "admin@skillsync.edu" : "alex.chen@skillsync.edu";
//     setEmail(demoEmail);
//     setPassword("password123");
//     authenticateAndRedirect(roleType, demoEmail);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const finalEmail = email.trim() || "alex.chen@skillsync.edu";
//     const role = finalEmail.toLowerCase().includes("admin") ? "admin" : "student";
//     authenticateAndRedirect(role, finalEmail);
//   };

//   return (
//     <div className="min-h-screen bg-[#F5F5F3] text-[#111111] pb-12">
//       <Navbar />

//       <main className="max-w-md mx-auto px-4 pt-28 sm:pt-32">
//         <div className="bg-white rounded-[32px] p-8 shadow-xl border border-black/5 flex flex-col gap-6">
//           <div className="text-center">
//             <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
//               <LogIn className="w-3.5 h-3.5 text-emerald-600" />
//               SkillSync Authentication
//             </span>
//             <h1 className="text-2xl font-extrabold text-[#111111] mt-3">Welcome Back</h1>
//             <p className="text-xs text-[#494D4D] mt-1">
//               Sign in to manage your evidence, view your Skill Passport, or open Admin Console.
//             </p>
//           </div>

//           {/* Quick One-Click Demo Buttons */}
//           <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-black/5 flex flex-col gap-2.5">
//             <div className="text-[11px] font-bold uppercase tracking-wider text-[#494D4D]">
//               ⚡ QUICK DEMO ONE-CLICK SIGN IN
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={() => handleDemoSignIn("student")}
//                 className="flex items-center justify-center gap-1.5 py-3 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
//               >
//                 <UserCheck className="w-4 h-4" />
//                 <span>Demo Student</span>
//               </button>
//               <button
//                 type="button"
//                 disabled={isSubmitting}
//                 onClick={() => handleDemoSignIn("admin")}
//                 className="flex items-center justify-center gap-1.5 py-3 px-3 bg-[#0F172A] hover:bg-slate-800 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-60"
//               >
//                 <ShieldCheck className="w-4 h-4 text-emerald-400" />
//                 <span>Demo Admin</span>
//               </button>
//             </div>
//           </div>

//           {errorMsg && (
//             <div className="p-3 bg-rose-50 text-rose-800 text-xs font-semibold rounded-2xl border border-rose-200">
//               {errorMsg}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Email Address</label>
//               <div className="relative">
//                 <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="alex.chen@skillsync.edu"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-xs font-bold text-[#111111] mb-1.5">Password</label>
//               <div className="relative">
//                 <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="••••••••"
//                   required
//                   className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="mt-1 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-xs hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
//                   <span>Entering Dashboard...</span>
//                 </>
//               ) : (
//                 <>
//                   <span>Sign In to Dashboard</span>
//                   <ArrowRight className="w-4 h-4 text-emerald-400" />
//                 </>
//               )}
//             </button>
//           </form>

//           <div className="text-center text-xs text-[#494D4D]">
//             Don't have an account yet?{" "}
//             <Link href="/signup" className="font-bold text-[#111111] hover:underline">
//               Register as Student
//             </Link>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import Navbar from "@/app/components/layout/Navbar";

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
      email: "",
      password: "",
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
        document.cookie = `next-auth.session-token=active-token; path=/;`;
        document.cookie = `skillsync_role=${roleType}; path=/;`;

        window.location.href = "/dashboard";
      } else {
        setErrorMsg("Demo sign in failed.");
      }
    } catch (err) {
      setErrorMsg("An error occurred during demo sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isEmp = email.toLowerCase().includes("admin");
    window.location.href = isEmp ? "/admin/fairness" : "/dashboard";
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F5F5F3] text-[#111111] flex flex-col justify-start">
      <Navbar />

      <main className="max-w-lg mx-auto px-6 sm:px-8 pt-0 sm:pt-1 w-full">
        <div className="bg-white rounded-[32px] px-8 sm:px-10 py-6 sm:py-7 shadow-xl border border-black/5 flex flex-col gap-4 sm:gap-5">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-800 text-sm font-bold rounded-full border border-emerald-200">
              <LogIn className="w-4 h-4 text-emerald-600" />
              SkillSync Authentication
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight mt-2">Welcome Back</h1>
            <p className="text-sm text-[#494D4D] mt-1">
              Sign in to manage your evidence, view your Skill Passport, or open Admin Console.
            </p>
          </div>

          {/* One-Click Quick Demo Sign In Presets */}
          <div className="bg-[#F8F9FA] rounded-2xl p-3.5 border border-black/5 flex flex-col gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#494D4D]">
              ⚡ Quick Demo One-Click Sign In
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSignIn("student")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Demo Student</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn("admin")}
                className="flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-all shadow-xs cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Demo Admin</span>
              </Link>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 text-rose-800 text-sm font-semibold rounded-2xl border border-rose-200">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#111111] mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4.5 h-4.5 text-neutral-400 absolute left-3.5 top-3.5" />
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
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F5F5F3] border border-black/5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1 font-medium">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-[#111111] mb-1.5">
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
              className="mt-1 w-full py-3.5 px-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4.5 h-4.5 text-emerald-400" />
            </button>
          </form>

          <div className="text-center text-sm text-[#494D4D]">
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