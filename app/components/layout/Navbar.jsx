"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Award, Briefcase, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
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
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  const handleSignOut = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <nav
        id="top-navbar"
        className={`fixed left-0 right-0 z-50 w-full max-w-7xl 2xl:max-w-[1536px] mx-auto px-3.5 sm:px-6 2xl:px-8 pointer-events-none ${
          isHomePage ? "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" : ""
        } ${isDocked ? "top-2.5 sm:top-3" : "top-4 sm:top-6"}`}
      >
        <div
          className={`flex items-stretch justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isDocked ? "gap-1.5 sm:gap-2.5" : "gap-3 sm:gap-5 md:gap-8 lg:gap-12"
          }`}
        >
          {/* Left Pill: Logo */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`pointer-events-auto bg-white rounded-full flex items-center justify-center shadow-lg border border-black/5 hover:scale-95 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled
                ? "w-11 h-11 sm:w-12 sm:h-12 p-0"
                : "px-4 sm:px-6 py-3 sm:py-4"
            }`}
          >
            <Link href="/" title="SkillSync Home" className="flex items-center justify-center gap-2 sm:gap-2.5 group whitespace-nowrap">
              <img src="/logo.svg" alt="SkillSync Logo" className="h-6 sm:h-7 w-auto object-contain shrink-0 transition-transform duration-300 group-hover:scale-105" />
              <span
                className={`text-lg sm:text-xl font-extrabold text-[#111111] tracking-tight whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[140px] opacity-100 translate-x-0"
                }`}
              >
                SkillSync
              </span>
            </Link>
          </div>

          {/* Center Pill: Navigation Links (Desktop) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className={`pointer-events-auto hidden lg:flex items-center bg-white rounded-full shadow-lg border border-black/5 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isScrolled ? "p-1.5 gap-1.5" : "px-2 py-1.5 gap-2"
            }`}
          >
            <Link
              href="/dashboard"
              title="Dashboard"
              aria-label="Dashboard"
              className={`font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full flex items-center justify-center whitespace-nowrap shrink-0 ${
                isScrolled
                  ? "w-10 h-10 p-0"
                  : "text-sm px-4 xl:px-5 py-3 gap-2"
              } ${
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
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[120px] opacity-100 translate-x-0"
                }`}
              >
                Dashboard
              </span>
            </Link>

            <Link
              href="/passport"
              title="Skill Passport"
              aria-label="Skill Passport"
              className={`font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full flex items-center justify-center whitespace-nowrap shrink-0 ${
                isScrolled
                  ? "w-10 h-10 p-0"
                  : "text-sm px-4 xl:px-5 py-3 gap-2"
              } ${
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
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[140px] opacity-100 translate-x-0"
                }`}
              >
                Skill Passport
              </span>
            </Link>

            <Link
              href="/opportunities"
              title="Opportunities"
              aria-label="Opportunities"
              className={`font-bold transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-full flex items-center justify-center whitespace-nowrap shrink-0 ${
                isScrolled
                  ? "w-10 h-10 p-0"
                  : "text-sm px-4 xl:px-5 py-3 gap-2"
              } ${
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
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[140px] opacity-100 translate-x-0"
                }`}
              >
                Opportunities
              </span>
            </Link>
          </div>

          {/* Right Pill: Auth Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`pointer-events-auto hidden sm:flex items-center bg-white rounded-full shadow-lg border border-black/5 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isScrolled ? "p-1.5 gap-1.5" : "px-2.5 sm:px-3 py-1.5 sm:py-2 gap-2"
              }`}
            >
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    title="My Profile"
                    aria-label="My Profile"
                    className={`font-bold rounded-full flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap shrink-0 ${
                      isScrolled
                        ? "w-10 h-10 p-0"
                        : "px-3.5 sm:px-4 py-2 sm:py-2.5 gap-1.5 text-xs sm:text-sm"
                    } ${
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
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[120px] opacity-100 translate-x-0"
                      }`}
                    >
                      My Profile
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleSignOut}
                    title="Sign Out"
                    aria-label="Sign Out"
                    className={`font-bold rounded-full bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center justify-center text-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap shrink-0 cursor-pointer ${
                      isScrolled
                        ? "w-10 h-10 p-0"
                        : "px-3.5 sm:px-4 py-2 sm:py-2.5 gap-1.5 text-xs sm:text-sm"
                    }`}
                  >
                    <LogOut className="w-4 h-4 shrink-0 text-neutral-600" />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[120px] opacity-100 translate-x-0"
                      }`}
                    >
                      Sign Out
                    </span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    title="Sign In"
                    aria-label="Sign In"
                    className={`font-bold rounded-full bg-[#F5F5F3] hover:bg-[#EAEAEA] flex items-center justify-center text-[#111111] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap shrink-0 ${
                      isScrolled
                        ? "w-10 h-10 p-0"
                        : "px-3.5 sm:px-4 py-2 sm:py-2.5 gap-1.5 text-xs sm:text-sm"
                    }`}
                  >
                    <LogIn className="w-4 h-4 shrink-0 text-neutral-600" />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[120px] opacity-100 translate-x-0"
                      }`}
                    >
                      Sign In
                    </span>
                  </Link>
                  <Link
                    href="/signup"
                    title="Get Started"
                    aria-label="Get Started"
                    className={`font-bold rounded-full bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-xs whitespace-nowrap shrink-0 ${
                      isScrolled
                        ? "w-10 h-10 p-0"
                        : "px-4 sm:px-5 py-2 sm:py-2.5 gap-1.5 text-xs sm:text-sm"
                    }`}
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span
                      className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isScrolled ? "max-w-0 opacity-0 -translate-x-2 pointer-events-none" : "max-w-[140px] opacity-100 translate-x-0"
                      }`}
                    >
                      Get Started
                    </span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="pointer-events-auto lg:hidden bg-white rounded-full shadow-lg border border-black/5 p-1.5 sm:p-2 transition-all duration-500 shrink-0"
            >
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 sm:p-2.5 rounded-full text-[#111111] hover:bg-[#EAEAEA] transition-colors cursor-pointer"
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
            className="pointer-events-auto lg:hidden mt-3 bg-white/95 backdrop-blur-xl border border-black/10 rounded-3xl p-4 shadow-2xl flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 max-w-md mx-auto"
          >
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-5 py-3 rounded-2xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3] flex items-center gap-3 transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 text-emerald-600" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/passport"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-5 py-3 rounded-2xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3] flex items-center gap-3 transition-colors"
            >
              <Award className="w-5 h-5 text-amber-600" />
              <span>Skill Passport</span>
            </Link>
            <Link
              href="/opportunities"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-5 py-3 rounded-2xl text-base font-bold text-[#494D4D] hover:text-[#111111] hover:bg-[#F5F5F3] flex items-center gap-3 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>Opportunities Feed</span>
            </Link>
            <div className="pt-2 mt-1 border-t border-neutral-100 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center bg-neutral-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      handleSignOut(e);
                    }}
                    className="w-full py-3 text-center bg-neutral-100 rounded-2xl text-sm font-bold text-[#111111] cursor-pointer hover:bg-neutral-200 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 text-center bg-neutral-100 rounded-2xl text-sm font-bold text-[#111111] hover:bg-neutral-200 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3.5 text-center bg-neutral-900 text-white rounded-2xl text-sm font-bold hover:bg-neutral-800 transition-colors shadow-sm"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      {pathname !== "/" && <div className="h-20 sm:h-28" />}
    </>
  );
}
