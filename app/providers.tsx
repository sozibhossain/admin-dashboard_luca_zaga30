"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { setAccessToken } from "@/lib/api";

function SessionSync() {
  const { data } = useSession();

  useEffect(() => {
    setAccessToken(data?.accessToken ?? null);
  }, [data?.accessToken]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <SessionSync />
      </QueryClientProvider>
    </SessionProvider>
  );
}
