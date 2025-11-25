import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/api/auth/refreshToken";
import type { ApiResponse } from "@/types/api";

/**
 * Generic fetch wrapper that automatically attaches Bearer access token
 * and handles automatic refresh when the backend returns 401 with
 * { "is_success": false, "message": "Invalid or expired token" }
 */
export async function callApiWithAuth<T = unknown>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const apiUrl = typeof input === "string" ? input : (input as Request).url;

  const getToken = () => useAuthStore.getState().getAccessToken();
  const setToken = (t: string) => useAuthStore.getState().setAccessToken(t);

  // Build a fetch with the current token
  async function doFetch(
    token?: string | null
  ): Promise<{ status: number; body: ApiResponse<T> }> {
    const headers = new Headers(init.headers || {});

    // ensure content-type for JSON
    if (!headers.has("Content-Type") && init.body) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(input, { ...init, headers });
    let json: any;
    try {
      json = await res.json();
    } catch (e) {
      // if no json body, return a standardized error
      return {
        status: res.status,
        body: {
          is_success: false,
          message: res.statusText || "Unknown error",
        } as ApiResponse<T>,
      };
    }
    return { status: res.status, body: json };
  }

  // 1) initial call with current token
  const currentToken = getToken();
  let result = await doFetch(currentToken);

  // 2) if unauthorized with invalid/expired token message, try refresh
  if (
    result.status === 401 ||
    (result.body &&
      result.body.is_success === false &&
      /invalid|expired token/i.test(String(result.body.message)))
  ) {
    try {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.is_success && refreshResult.data?.access_token) {
        // update store and retry
        setToken(refreshResult.data.access_token);
        result = await doFetch(refreshResult.data.access_token);
        return result.body;
      }
      // refresh failed: return original 401 body if available
      return result.body;
    } catch (err) {
      // if refresh throws, return a normalized failure
      return {
        is_success: false,
        message: "Failed to refresh access token",
      } as ApiResponse<T>;
    }
  }

  return result.body;
}

export default callApiWithAuth;
