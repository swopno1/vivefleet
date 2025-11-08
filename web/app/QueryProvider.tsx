"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // By default, React Query will refetch on every mount.
        // Adjust this based on your needs, especially for PWA offline capabilities.
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });
}

function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Optionally add React Query Devtools here for development */}
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default QueryProvider;
