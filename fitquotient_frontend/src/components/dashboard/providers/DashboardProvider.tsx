"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Client component wrapper for dashboard that handles automatic token refresh
 * This component will automatically fetch a new access token when the dashboard is accessed
 */
export default function DashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isRefreshing, error } = useTokenRefresh();

  useEffect(() => {
    if (error && !isRefreshing) {
      router.push("/login");
    }
  }, [error, isRefreshing, router]);
  if (isRefreshing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground"></div>
          <p className="text-sm text-muted-foreground">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
