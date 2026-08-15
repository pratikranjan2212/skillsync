"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

/**
 * Universal useAuth hook for SkillSync.
 * Reactively checks both NextAuth session and local document auth cookies.
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const [hasCookie, setHasCookie] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkCookies = () => {
      const cookies = typeof document !== "undefined" ? document.cookie : "";
      const authenticated =
        cookies.includes("skillsync_session=") ||
        cookies.includes("next-auth.session-token=") ||
        cookies.includes("__Secure-next-auth.session-token=");
      setHasCookie(authenticated);
    };

    checkCookies();
  }, [session]);

  const isAuthenticated = Boolean(session?.user || hasCookie);
  const isLoading = status === "loading" && !isClient;

  return {
    isAuthenticated,
    isLoading,
    user: session?.user || (hasCookie ? { name: "Alex Chen", email: "alex.chen@skillsync.edu", role: "student" } : null),
  };
}
