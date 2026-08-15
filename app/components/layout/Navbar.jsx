"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Award, Briefcase, LogIn, UserPlus, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

/**
 * Universal Unified Navbar for SkillSync across all pages.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);

  const isHomePage = pathname === "/";

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect scrolling up vs scrolling down anywhere on the landing page
      if (currentScrollY < lastScrollY && currentScrollY > 50) {
        setIsScrollingUp(true);
      } else {
        setIsScrollingUp(false);
      }

      lastScrollY = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On individual pages, components are permanently stuck together with no scroll-driven expansion/animation
  const isDocked = !isHomePage || (isScrolled && !isScrollingUp);

  const [hasAuthCookie, setHasAuthCookie] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = typeof document !== "undefined" ? document.cookie : "";
      const hasCookie =
        cookies.includes("skillsync_session=") ||
        cookies.includes("next-auth.session-token=");
      setHasAuthCookie(hasCookie);
    };

    checkAuth();
  }, [pathname]);

  const isAuthenticated = Boolean(session?.user || hasAuthCookie);

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      // Clear all authentication cookies client-side
      document.cookie = "skillsync_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "skillsync_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      // Clear server-side session cookies
      await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});

      // Trigger NextAuth signOut
      try {
        await signOut({ redirect: false });
      } catch {
        // continue
      }

      // Force full reload and redirect to landing page
      window.location.href = "/";
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <>
      <nav
        id="top-navbar"
        className={`fixed left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 pointer-events-none ${
          isHomePage ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
        } ${isDocked ? "top-3" : "top-6"}`}
      >
        <div
          className={`flex items-stretch justify-center ${
            isHomePage ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
          } ${isDocked ? "gap-2 sm:gap-3" : "gap-5 md:gap-8 lg:gap-12"}`}
        >
          {/* Left Pill: Logo */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`pointer-events-auto bg-white rounded-2xl flex items-center shadow-lg border border-black/5 px-5 py-[18px] shrink-0 ${
              isHomePage ? "transition-all duration-500" : ""
            }`}
          >
            <Link href="/" className="flex items-center gap-2.5 group whitespace-nowrap">
              <img src="/logo.svg" alt="SkillSync Logo" className="h-7 w-auto object-contain shrink-0" />
              <span className="text-xl font-extrabold text-[#111111] tracking-tight whitespace-nowrap">SkillSync</span>
            </Link>
          </div>

          {/* Center Pill: Navigation Links (Desktop) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`pointer-events-auto hidden lg:flex items-center bg-white rounded-2xl shadow-lg border border-black/5 px-1.5 py-1 shrink-0 ${
              isHomePage ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
            } ${isDocked ? "gap-1" : "gap-2"}`}
          >
            <Link
              href="/dashboard"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-[18px] rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname === "/dashboard"
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 transition-colors duration-500 ${pathname === "/dashboard" ? "text-emerald-600" : "text-neutral-500"}`} />
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>

            <Link
              href="/passport"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-[18px] rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname.startsWith("/passport")
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <Award className={`w-4 h-4 shrink-0 transition-colors duration-500 ${pathname.startsWith("/passport") ? "text-amber-600" : "text-neutral-500"}`} />
              <span className="whitespace-nowrap">Skill Passport</span>
            </Link>

            <Link
              href="/opportunities"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-[18px] rounded-xl flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname.startsWith("/opportunities")
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <Briefcase className={`w-4 h-4 shrink-0 transition-colors duration-500 ${pathname.startsWith("/opportunities") ? "text-emerald-600" : "text-neutral-500"}`} />
              <span className="whitespace-nowrap">Opportunities</span>
            </Link>
          </div>

          {/* Right Pill: Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white rounded-2xl shadow-lg border border-black/5 px-3.5 py-[18px] transition-all duration-500 shrink-0"
            >
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-4 py-2.5 rounded-xl bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center gap-1.5 text-sm font-bold text-[#111111] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0 text-neutral-600" />
                  <span className="whitespace-nowrap">Sign Out</span>
                </button>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-4 py-2.5 rounded-xl bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center gap-1.5 text-sm font-bold text-[#111111] transition-colors whitespace-nowrap shrink-0"
                  >
                    <LogIn className="w-4 h-4 shrink-0 text-neutral-600" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-1.5 text-sm font-bold transition-colors shadow-xs whitespace-nowrap shrink-0"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="whitespace-nowrap">Get Started</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto lg:hidden bg-white rounded-2xl shadow-lg border border-black/5 p-1.5 transition-all duration-500 shrink-0"
            >
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl text-[#111111] hover:bg-[#EAEAEA] transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {isMobileMenuOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="pointer-events-auto lg:hidden mt-2 bg-white border border-black/5 rounded-2xl p-4 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Link
              href="/dashboard"
              className="px-4 py-2.5 rounded-xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Dashboard
            </Link>
            <Link
              href="/passport"
              className="px-4 py-2.5 rounded-xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Skill Passport
            </Link>
            <Link
              href="/opportunities"
              className="px-4 py-2.5 rounded-xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Opportunities Feed
            </Link>
            <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full py-2.5 text-center bg-neutral-100 rounded-xl text-sm font-bold text-[#111111] cursor-pointer"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/signin" className="w-full py-2.5 text-center bg-neutral-100 rounded-xl text-sm font-bold text-[#111111]">
                    Sign In
                  </Link>
                  <Link href="/signup" className="w-full py-2.5 text-center bg-neutral-900 text-white rounded-xl text-sm font-bold">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {/* Spacer for non-landing pages so top navbar doesn't obscure headers */}
      {pathname !== "/" && <div className="h-24 sm:h-28" />}
    </>
  );
}
