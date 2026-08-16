"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ClickSpark from "@/app/components/ui/ClickSpark";

export default function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ClickSpark sparkColor="#111111" sparkRadius={28} sparkSize={13} extraScale={1.2} className="min-h-screen w-full flex flex-col flex-1">
          {children}
        </ClickSpark>
      </QueryClientProvider>
    </SessionProvider>
  );
}

