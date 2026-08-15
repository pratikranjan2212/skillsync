// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email) {
//       setIsSubscribed(true);
//       setTimeout(() => {
//         setIsSubscribed(false);
//         setEmail("");
//       }, 4000);
//     }
//   };

//   const quickLinks = [
//     { name: "Features", href: "#features" },
//     { name: "Use Cases", href: "#use-cases" },
//     { name: "Social proof", href: "#social-proof" },
//     { name: "Numbers", href: "#numbers" },
//     { name: "AI Suggestions", href: "#ai-suggestions" },
//   ];

//   const pagesLinks = [
//     { name: "About", href: "#about" },
//     { name: "Waitlist", href: "#waitlist" },
//     { name: "Changelog", href: "#changelog" },
//     { name: "Error 404", href: "/404" },
//   ];

//   const supportLinks = [
//     { name: "FAQs", href: "#faqs" },
//     { name: "Contact", href: "#contact" },
//     { name: "Privacy Policy", href: "#privacy" },
//     { name: "Terms & Conditions", href: "#terms" },
//   ];

//   return (
//     <footer className="w-full bg-white text-neutral-900 antialiased border-t border-neutral-100">
//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-10 sm:pb-12">
//         {/* Main Footer Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
//           {/* Left Column: Brand, Headline, & Subscription Form */}
//           <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-8">
//             {/* Habitline Logo & Wordmark */}
//             <Link 
//               href="/" 
//               className="flex items-center gap-3 group transition-transform duration-200 hover:opacity-90"
//               aria-label="Habitline Home"
//             >
//               <div className="w-9 h-9 relative flex items-center justify-center flex-shrink-0">
//                 <svg 
//                   viewBox="0 0 36 36" 
//                   fill="none" 
//                   xmlns="http://www.w3.org/2000/svg" 
//                   className="w-full h-full drop-shadow-sm"
//                 >
//                   <defs>
//                     <linearGradient id="habitline-grad" x1="0%" y1="0%" x2="100%" y2="100%">
//                       <stop offset="0%" stopColor="#FFA654" />
//                       <stop offset="100%" stopColor="#FF665A" />
//                     </linearGradient>
//                   </defs>
//                   <circle cx="18" cy="18" r="18" fill="url(#habitline-grad)" />
//                   <path 
//                     d="M6.5 18C9.5 18 10.5 11.5 13.5 11.5C16.5 11.5 17.5 24.5 20.5 24.5C23.5 24.5 24.5 18 29.5 18" 
//                     stroke="#111111" 
//                     strokeWidth="2.8" 
//                     strokeLinecap="round" 
//                     strokeLinejoin="round" 
//                   />
//                 </svg>
//               </div>
//               <span className="font-bold text-2xl tracking-tight text-[#111111]">
//                 Habitline
//               </span>
//             </Link>

//             {/* Main Headline */}
//             <h2 className="text-2xl sm:text-[27px] font-bold text-[#111111] tracking-tight mt-7 leading-snug">
//               Stay on top of your habits
//             </h2>

//             {/* Sub-headline */}
//             <p className="text-neutral-500 text-[14.5px] sm:text-[15px] font-normal mt-2.5 leading-normal">
//               No spam. Just simple advice for staying consistent.
//             </p>

//             {/* Email Subscription Form with Floating Shadowed Button */}
//             <form onSubmit={handleSubmit} className="w-full max-w-[420px] mt-6">
//               <div className="relative flex items-center">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter email address"
//                   required
//                   disabled={isSubscribed}
//                   className="w-full bg-[#ECEEF0] text-neutral-900 placeholder:text-neutral-500 placeholder:text-[14px] text-[14.5px] rounded-full py-3.5 pl-6 pr-32 sm:pr-36 border border-transparent focus:bg-[#E7EAEF] focus:outline-none focus:border-neutral-300 transition-all"
//                 />
//                 <button
//                   type="submit"
//                   disabled={isSubscribed}
//                   className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 bg-[#111111] hover:bg-neutral-800 active:scale-[0.98] text-white font-medium text-[13.5px] sm:text-[14px] px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_28px_-4px_rgba(0,0,0,0.6)] cursor-pointer"
//                 >
//                   {isSubscribed ? "Subscribed!" : "Subscribe"}
//                 </button>
//               </div>
//               {isSubscribed && (
//                 <p className="text-xs text-emerald-600 font-medium mt-2 pl-4">
//                   Thank you for subscribing to Habitline updates!
//                 </p>
//               )}
//             </form>
//           </div>

//           {/* Right Columns: Quick links, Pages, and Support */}
//           <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">
//             {/* Column 1: Quick links */}
//             <div>
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Quick links
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {quickLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Column 2: Pages */}
//             <div>
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Pages
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {pagesLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Column 3: Support */}
//             <div className="col-span-2 sm:col-span-1">
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Support
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {supportLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//         </div>

//         {/* Fine Horizontal Separator Line */}
//         <div className="border-t border-neutral-200/80 my-10 sm:my-12" />

//         {/* Bottom Bar: Attribution & Social Media Icons */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Designed by Webestica, Powered by Framer */}
//           <p className="text-xs sm:text-[13.5px] text-neutral-700 font-normal tracking-tight">
//             Designed by <span className="font-semibold text-[#111111]">Webestica</span>, Powered by <span className="font-semibold text-[#111111]">Framer.</span>
//           </p>

//           {/* Social Media Circular Icon Buttons */}
//           <div className="flex items-center gap-2.5">
//             {/* Instagram */}
//             <a
//               href="https://instagram.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Instagram"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//                 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//               </svg>
//             </a>

//             {/* LinkedIn */}
//             <a
//               href="https://linkedin.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="LinkedIn"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//               </svg>
//             </a>

//             {/* Facebook */}
//             <a
//               href="https://facebook.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Facebook"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
//               </svg>
//             </a>

//             {/* X (Twitter) */}
//             <a
//               href="https://x.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="X (formerly Twitter)"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
// "use client";

// import React, { useState } from "react";
// import Link from "next/link";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [isSubscribed, setIsSubscribed] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (email) {
//       setIsSubscribed(true);
//       setTimeout(() => {
//         setIsSubscribed(false);
//         setEmail("");
//       }, 4000);
//     }
//   };

//   const quickLinks = [
//     { name: "Features", href: "/#features" },
//     { name: "Skill Passport", href: "/passport" },
//     { name: "Opportunity Feed", href: "/opportunities" },
//     { name: "Fair Match Engine", href: "/#fair-match" },
//     { name: "AI Verification", href: "/#smart-assist" },
//   ];

//   const pagesLinks = [
//     { name: "Dashboard", href: "/dashboard" },
//     { name: "Skill Passport", href: "/passport" },
//     { name: "Opportunity Feed", href: "/opportunities" },
//     { name: "Admin Console", href: "/admin" },
//     { name: "Verification Vault", href: "/passport#evidence" },
//   ];

//   const supportLinks = [
//     { name: "Documentation", href: "/docs" },
//     { name: "FAQs", href: "/#faq" },
//     { name: "Privacy Policy", href: "/privacy" },
//     { name: "Terms & Conditions", href: "/terms" },
//   ];

//   return (
//     <footer className="w-full bg-white text-neutral-900 antialiased border-t border-neutral-100">
//       <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-10 sm:pb-12">
//         {/* Main Footer Content Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
//           {/* Left Column: Brand, Headline, & Subscription Form */}
//           <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-8">
//             {/* SkillSync Logo & Wordmark */}
//             <Link 
//               href="/" 
//               className="flex items-center gap-3 group transition-transform duration-200 hover:opacity-90"
//               aria-label="SkillSync Home"
//             >
//               <img 
//                 src="/logo.svg" 
//                 alt="SkillSync Logo" 
//                 className="h-9 w-auto object-contain shrink-0" 
//               />
//               <span className="font-extrabold text-2xl tracking-tight text-[#111111]">
//                 SkillSync
//               </span>
//             </Link>

//             {/* Main Headline */}
//             <h2 className="text-2xl sm:text-[27px] font-bold text-[#111111] tracking-tight mt-7 leading-snug">
//               Stay on top of your skills
//             </h2>

//             {/* Sub-headline */}
//             <p className="text-neutral-500 text-[14.5px] sm:text-[15px] font-normal mt-2.5 leading-normal">
//               No spam. Just simple advice for staying consistent.
//             </p>

//             {/* Email Subscription Form with Floating Shadowed Button */}
//             <form onSubmit={handleSubmit} className="w-full max-w-[420px] mt-6">
//               <div className="relative flex items-center">
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Enter email address"
//                   required
//                   disabled={isSubscribed}
//                   className="w-full bg-[#ECEEF0] text-neutral-900 placeholder:text-neutral-500 placeholder:text-[14px] text-[14.5px] rounded-full py-3.5 pl-6 pr-32 sm:pr-36 border border-transparent focus:bg-[#E7EAEF] focus:outline-none focus:border-neutral-300 transition-all"
//                 />
//                 <button
//                   type="submit"
//                   disabled={isSubscribed}
//                   className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 bg-[#111111] hover:bg-neutral-800 active:scale-[0.98] text-white font-medium text-[13.5px] sm:text-[14px] px-6 sm:px-7 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-[0_12px_24px_-4px_rgba(0,0,0,0.5)] hover:shadow-[0_16px_28px_-4px_rgba(0,0,0,0.6)] cursor-pointer"
//                 >
//                   {isSubscribed ? "Subscribed!" : "Subscribe"}
//                 </button>
//               </div>
//               {isSubscribed && (
//                 <p className="text-xs text-emerald-600 font-medium mt-2 pl-4">
//                   Thank you for subscribing to SkillSync updates!
//                 </p>
//               )}
//             </form>
//           </div>

//           {/* Right Columns: Quick links, Pages, and Support */}
//           <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">
//             {/* Column 1: Quick links */}
//             <div>
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Quick links
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {quickLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Column 2: Pages */}
//             <div>
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Pages
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {pagesLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>

//             {/* Column 3: Support */}
//             <div className="col-span-2 sm:col-span-1">
//               <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
//                 Support
//               </h3>
//               <ul className="space-y-2.5 list-none p-0 m-0">
//                 {supportLinks.map((link) => (
//                   <li key={link.name}>
//                     <Link
//                       href={link.href}
//                       className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
//                     >
//                       {link.name}
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>

//         </div>

//         {/* Fine Horizontal Separator Line */}
//         <div className="border-t border-neutral-200/80 my-10 sm:my-12" />

//         {/* Bottom Bar: Attribution & Social Media Icons */}
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//           {/* Designed for SkillSync */}
//           <p className="text-xs sm:text-[13.5px] text-neutral-700 font-normal tracking-tight">
//             Designed for <span className="font-semibold text-[#111111]">SkillSync</span>, Guaranteed <span className="font-semibold text-[#111111]">Fairness & Transparency.</span>
//           </p>

//           {/* Social Media Circular Icon Buttons */}
//           <div className="flex items-center gap-2.5">
//             {/* Instagram */}
//             <a
//               href="https://instagram.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Instagram"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                 <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
//                 <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//                 <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
//               </svg>
//             </a>

//             {/* LinkedIn */}
//             <a
//               href="https://linkedin.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="LinkedIn"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
//               </svg>
//             </a>

//             {/* Facebook */}
//             <a
//               href="https://facebook.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="Facebook"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z" />
//               </svg>
//             </a>

//             {/* X (Twitter) */}
//             <a
//               href="https://x.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               aria-label="X (formerly Twitter)"
//               className="w-9 h-9 rounded-full bg-[#ECEEF0] flex items-center justify-center text-neutral-800 hover:bg-neutral-200 hover:text-black hover:scale-105 transition-all"
//             >
//               <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//               </svg>
//             </a>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }
"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  const quickLinks = [
    { name: "Features", href: "/#features" },
    { name: "Fair Match Engine", href: "/#fair-match" },
    { name: "AI Verification", href: "/#features" },
    { name: "Evidence Vault", href: "/passport#evidence" },
    { name: "Metrics & Numbers", href: "/#metrics" },
  ];

  const pagesLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Skill Passport", href: "/passport" },
    { name: "Opportunity Feed", href: "/opportunities" },
    { name: "Admin Console", href: "/admin" },
  ];

  const supportLinks = [
    { name: "Documentation", href: "/docs" },
    { name: "FAQs", href: "/#faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <footer className="w-full bg-white text-neutral-900 antialiased border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-16 sm:pt-20 pb-10 sm:pb-12">
        {/* Main Grid: Left Brand Info & Right 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Logo & Description */}
          <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-8">
            <Link 
              href="/" 
              className="flex items-center gap-3 group transition-transform duration-200 hover:opacity-90"
              aria-label="SkillSync Home"
            >
              <img 
                src="/logo.svg" 
                alt="SkillSync Logo" 
                className="h-9 w-auto object-contain shrink-0" 
              />
              <span className="font-extrabold text-2xl tracking-tight text-[#111111]">
                SkillSync
              </span>
            </Link>

            {/* Description Text */}
            <p className="text-neutral-600 text-[14.5px] sm:text-[15px] font-normal mt-4 max-w-sm leading-relaxed">
              Automated skill verification and explainable job matching platform with guaranteed demographic non-discrimination.
            </p>
          </div>

          {/* Right Columns: Quick links, Pages, Support */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-10 pt-2 lg:pt-0">
            {/* Column 1: Quick links */}
            <div>
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Quick links
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Pages */}
            <div>
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Pages
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {pagesLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="font-bold text-[#111111] text-[15px] tracking-tight mb-4">
                Support
              </h3>
              <ul className="space-y-2.5 list-none p-0 m-0">
                {supportLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14.5px] font-medium text-neutral-800 hover:text-black transition-colors duration-150 block text-left"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Fine Horizontal Separator Line */}
        <div className="border-t border-neutral-200/80 my-10 sm:my-12" />

        {/* Bottom Bar: Copyright only */}
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-[13.5px] text-neutral-500 font-normal tracking-tight">
            © 2026 SkillSync Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}