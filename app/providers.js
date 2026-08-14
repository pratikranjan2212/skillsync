"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import ClickSpark from "@/app/components/ui/ClickSpark";

/**
 * Client App Providers Wrapper.
 * Wraps the application with Auth.js SessionProvider and TanStack React Query QueryClientProvider.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default stale time
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ClickSpark sparkColor="#111111" sparkRadius={26} sparkSize={16} className="min-h-screen w-full flex flex-col flex-1">
          {children}
        </ClickSpark>
      </QueryClientProvider>
    </SessionProvider>
  );
}
