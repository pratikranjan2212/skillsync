"use client";

import { useSession } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && Boolean(session?.user);

  return {
    isAuthenticated,
    isLoading,
    user: session?.user || null,
  };
}
