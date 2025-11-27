import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/api/auth/refreshToken";
import type { ApiResponse } from "@/types/api";
import nextConfig from "@/next.config";
import AppError from "@/lib/errors/AppError";

/**
 * Small collection of helpers used across dashboard API utilities.
 * We keep these in withAuth for a single import surface, so callers can
 * import both callApiWithAuth and the URL/token helpers from the same file.
 */

export function getCoreApiUrl(): string {
  // Prefer server runtime `URL_CORE` if available, otherwise fall back to the value
  // embedded at build time via next.config (env.URL_CORE).
  const serverUrl = process.env.URL_CORE;
  const clientUrl = nextConfig?.env?.URL_CORE;
  const apiUrl = serverUrl ?? clientUrl ?? "";
  if (!apiUrl)
    throw new AppError("Missing API URL (process.env.URL_CORE)", {
      code: "MISSING_ENV",
      details: { env: "URL_CORE" },
    });
  return apiUrl;
}

export function buildCoreUrl(path: string): string {
  const base = getCoreApiUrl();
  // Ensure there is exactly one slash between base and path
  const normalizedBase = base.replace(/\/+$/u, "");
  const normalizedPath = path.replace(/^\/+/, "");
  return `${normalizedBase}/${normalizedPath}`;
}

export function getAccessToken(): string | null {
  return useAuthStore.getState().getAccessToken();
}

export function getAuthHeader(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/**
 * Generic fetch wrapper that automatically attaches Bearer access token
 * and handles automatic refresh when the backend returns 401 with
 * { "is_success": false, "message": "Invalid or expired token" }
 */
export async function callApiWithAuth<T = unknown>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const getToken = () => useAuthStore.getState().getAccessToken();
  const setToken = (t: string) => useAuthStore.getState().setAccessToken(t);

  // Build a fetch with the current token
  async function doFetch(
    token?: string | null
  ): Promise<{ status: number; body: ApiResponse<T> }> {
    const headers = new Headers(init.headers || {});

    // ensure content-type for JSON
    // DO NOT override content-type for FormData/Blob (browser will set multipart boundary)
    const body = init.body as unknown;
    if (
      !headers.has("Content-Type") &&
      body &&
      !(body instanceof FormData) &&
      !(body instanceof Blob)
    ) {
      headers.set("Content-Type", "application/json");
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const res = await fetch(input, { ...init, headers });
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      // if no json body, return a standardized error
      return {
        status: res.status,
        body: {
          is_success: false,
          message: res.statusText || "Unknown error",
        } as ApiResponse<T>,
      };
    }
    return { status: res.status, body: json as ApiResponse<T> };
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
    } catch {
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
