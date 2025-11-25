"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export default function TokenPage() {
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const { isRefreshing, error, refresh } = useTokenRefresh();

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground">FitQuotient</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Talent Intelligence Engine
          </p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-card-foreground mb-2">
              Access Token
            </h1>
            <p className="text-sm text-muted-foreground">
              Your current access token for API authentication
            </p>
          </div>

          {isRefreshing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mb-4"></div>
              <p className="text-sm text-muted-foreground">
                Fetching access token...
              </p>
            </div>
          ) : error ? (
            <div className="space-y-4">
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={refresh}
                  variant="outline"
                  className="flex-1"
                >
                  Retry
                </Button>
                <Button
                  onClick={() => router.push("/login")}
                  className="flex-1"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Token Display */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Token
                </label>
                <div className="bg-muted rounded-lg p-4 border border-border">
                  <code className="text-xs text-muted-foreground break-all font-mono">
                    {accessToken || "No token available"}
                  </code>
                </div>
              </div>

              {/* Token Info */}
              {accessToken && (
                <div className="bg-muted/50 rounded-lg p-4 border border-border">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center mt-0.5">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-card-foreground">
                        Token Active
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your access token has been successfully refreshed and is
                        ready to use.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={refresh}
                  variant="outline"
                  className="flex-1"
                  disabled={isRefreshing}
                >
                  Refresh Token
                </Button>
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            This token will be automatically refreshed when you reload this page
          </p>
        </div>
      </div>
    </main>
  );
}
