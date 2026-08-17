"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Award, Briefcase, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

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

  const isDocked = !isHomePage || (isScrolled && !isScrollingUp);

  const [hasAuthCookie, setHasAuthCookie] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const cookies = typeof document !== "undefined" ? document.cookie : "";
      const hasCookie =
        cookies.includes("skillsync_session=") ||
        cookies.includes("authjs.session-token=") ||
        cookies.includes("__Secure-authjs.session-token=") ||
        cookies.includes("next-auth.session-token=");
      setHasAuthCookie(hasCookie);

      const roleMatch = cookies.match(/skillsync_role=([^;]+)/);
      if (roleMatch && roleMatch[1]) {
        setUserRole(roleMatch[1]);
      } else if (session?.user?.role) {
        setUserRole(session.user.role);
      } else {
        setUserRole(null);
      }
    };

    checkAuth();
  }, [pathname, session]);

  const isAuthenticated = Boolean(session?.user || hasAuthCookie);

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      document.cookie = "skillsync_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-authjs.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "skillsync_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "__Secure-next-auth.session-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";

      await fetch("/api/auth/signout", { method: "POST" }).catch(() => {});

      try {
        await signOut({ redirect: false });
      } catch {
      }

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
            className={`pointer-events-auto bg-white rounded-full flex items-center shadow-lg border border-black/5 px-6 py-4 hover:scale-95 shrink-0 ${
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
            className={`pointer-events-auto hidden lg:flex items-center bg-white rounded-full shadow-lg border border-black/5 px-2 py-1.5 shrink-0 ${
              isHomePage ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
            } ${isDocked ? "gap-1" : "gap-2"}`}
          >
            <Link
              href="/dashboard"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-3 rounded-full flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname === "/dashboard"
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <LayoutDashboard
                className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                  pathname === "/dashboard"
                    ? "text-emerald-600 fill-emerald-600"
                    : "text-neutral-500"
                }`}
              />
              <span className="whitespace-nowrap">Dashboard</span>
            </Link>

            <Link
              href="/passport"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-3 rounded-full flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname.startsWith("/passport")
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <Award
                className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                  pathname.startsWith("/passport")
                    ? "text-amber-600 fill-amber-600"
                    : "text-neutral-500"
                }`}
              />
              <span className="whitespace-nowrap">Skill Passport</span>
            </Link>

            <Link
              href="/opportunities"
              className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-3 rounded-full flex items-center gap-2 whitespace-nowrap shrink-0 ${
                pathname.startsWith("/opportunities")
                  ? "bg-[#D5D5D2] text-[#111111]"
                  : "text-[#494D4D] hover:text-[#111111] hover:bg-[#E2E2E0]"
              }`}
            >
              <Briefcase
                className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                  pathname.startsWith("/opportunities")
                    ? "text-emerald-600 fill-emerald-600"
                    : "text-neutral-500"
                }`}
              />
              <span className="whitespace-nowrap">Opportunities</span>
            </Link>

            {userRole === "admin" && (
              <Link
                href="/admin"
                className={`text-sm font-bold transition-all duration-500 ease-out px-5 py-3 rounded-full flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  pathname.startsWith("/admin")
                    ? "bg-slate-900 text-white"
                    : "text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="whitespace-nowrap">Admin Console</span>
              </Link>
            )}
          </div>

          {/* Right Pill: Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white rounded-full shadow-lg border border-black/5 px-3 py-2 transition-all duration-500 shrink-0"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className={`px-4 py-2.5 rounded-full flex items-center gap-1.5 text-sm font-bold transition-all whitespace-nowrap shrink-0 ${
                      pathname === "/profile"
                        ? "bg-[#D5D5D2] text-[#111111]"
                        : "bg-[#F5F5F3] hover:bg-[#EAEAEA] text-[#111111]"
                    }`}
                  >
                    <User
                      className={`w-4 h-4 shrink-0 transition-all duration-300 ${
                        pathname === "/profile"
                          ? "text-emerald-600 fill-emerald-600"
                          : "text-neutral-600"
                      }`}
                    />
                    <span className="whitespace-nowrap">My Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="px-4 py-2.5 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center gap-1.5 text-sm font-bold text-[#111111] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 shrink-0 text-neutral-600" />
                    <span className="whitespace-nowrap">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    className="px-4 py-2.5 rounded-full bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center gap-1.5 text-sm font-bold text-[#111111] transition-colors whitespace-nowrap shrink-0"
                  >
                    <LogIn className="w-4 h-4 shrink-0 text-neutral-600" />
                    <span className="whitespace-nowrap">Sign In</span>
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2.5 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 flex items-center gap-1.5 text-sm font-bold transition-colors shadow-xs whitespace-nowrap shrink-0"
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
              className="pointer-events-auto lg:hidden bg-white rounded-full shadow-lg border border-black/5 p-2 transition-all duration-500 shrink-0"
            >
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-full text-[#111111] hover:bg-[#EAEAEA] transition-colors"
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
            className="pointer-events-auto lg:hidden mt-3 bg-white border border-black/5 rounded-3xl p-4 shadow-xl flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-full text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Dashboard
            </Link>
            <Link
              href="/passport"
              className="px-5 py-3 rounded-full text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Skill Passport
            </Link>
            <Link
              href="/opportunities"
              className="px-5 py-3 rounded-full text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3]"
            >
              Opportunities Feed
            </Link>
            {userRole === "admin" && (
              <Link
                href="/admin"
                className="px-5 py-3 rounded-full text-base font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Admin Console</span>
              </Link>
            )}
            <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    className="w-full py-3 text-center bg-neutral-900 text-white rounded-full text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full py-3 text-center bg-neutral-100 rounded-full text-sm font-bold text-[#111111] cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signin" className="w-full py-3 text-center bg-neutral-100 rounded-full text-sm font-bold text-[#111111] hover:bg-neutral-200 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/signup" className="w-full py-3 text-center bg-neutral-900 text-white rounded-full text-sm font-bold hover:bg-neutral-800 transition-colors">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {pathname !== "/" && <div className="h-24 sm:h-28" />}
    </>
  );
}

