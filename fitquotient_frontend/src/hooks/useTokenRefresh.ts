import { useEffect, useCallback, useState } from "react";
import { refreshAccessToken } from "@/lib/api/auth/refreshToken";
import { useAuthStore } from "@/store/authStore";

/**
 * Custom hook to automatically refresh access token
 * Uses HTTP-only cookie to fetch new access token from the backend
 *
 * @returns Object containing loading state, error, and manual refresh function
 *
 * @example
 * ```typescript
 * const { isRefreshing, error, refresh } = useTokenRefresh();
 * ```
 */
export function useTokenRefresh() {
  const { setAccessToken } = useAuthStore();
  const currentToken = useAuthStore.getState().getAccessToken();
  // Start refreshing if there is no access token in the store. This avoids
  // rendering the dashboard children briefly before the shared refresh
  // completes and prevents double/multiple initial requests while refresh
  // is in progress (React Strict Mode may mount/unmount components twice in dev).
  const [isRefreshing, setIsRefreshing] = useState(!currentToken);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await refreshAccessToken();

      if (response.is_success && response.data) {
        setAccessToken(response.data.access_token);
        return true;
      } else {
        const errorMessage = response.message || "Failed to refresh token";
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      console.error("Error refreshing token:", err);
      const errorMessage = "Failed to refresh access token";
      setError(errorMessage);
      return false;
    } finally {
      setIsRefreshing(false);
    }
  }, [setAccessToken]);

  // Automatically refresh token on mount
  useEffect(() => {
    // If token already exists, skip the refresh step and show children
    if (currentToken) {
      setIsRefreshing(false);
      return;
    }
    refresh();
  }, [refresh, currentToken]);

  return {
    isRefreshing,
    error,
    refresh,
  };
}
