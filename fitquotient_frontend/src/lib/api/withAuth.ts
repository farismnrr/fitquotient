import { useAuthStore } from "@/store/authStore";
import { refreshAccessToken } from "@/lib/api/auth/refreshToken";
import type { ApiResponse } from "@/types/api";
import AppError from "@/lib/errors/AppError";

/**
 * Returns the Core API base URL.
 * Client-side: constructs from window.location if NEXT_PUBLIC_URL_CORE is placeholder
 * Server-side: uses URL_CORE environment variable
 */
export function getCoreApiUrl(): string {
  const serverUrl = process.env.URL_CORE;
  const publicUrl = process.env.NEXT_PUBLIC_URL_CORE;
  
  if (typeof window !== 'undefined') {
    if (!publicUrl || publicUrl.includes('placeholder')) {
      const protocol = window.location.protocol;
      const hostname = window.location.hostname;
      return `${protocol}//${hostname}:5400`;
    }
    return publicUrl;
  }
  
  const apiUrl = serverUrl ?? publicUrl ?? "";
  
  if (!apiUrl) {
    throw new AppError("Missing API URL (process.env.URL_CORE or NEXT_PUBLIC_URL_CORE)", {
      code: "MISSING_ENV",
      details: { env: "URL_CORE / NEXT_PUBLIC_URL_CORE" },
    });
  }
  
  return apiUrl;
}

export function buildCoreUrl(path: string): string {
  const base = getCoreApiUrl();
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
 * Fetch wrapper with automatic Bearer token attachment and token refresh on 401.
 */
export async function callApiWithAuth<T = unknown>(
  input: RequestInfo,
  init: RequestInit = {}
): Promise<ApiResponse<T>> {
  const getToken = () => useAuthStore.getState().getAccessToken();
  const setToken = (t: string) => useAuthStore.getState().setAccessToken(t);

  async function doFetch(
    token?: string | null
  ): Promise<{ status: number; body: ApiResponse<T> }> {
    const headers = new Headers(init.headers || {});

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

  const currentToken = getToken();
  let result = await doFetch(currentToken);

  if (
    result.status === 401 ||
    (result.body &&
      result.body.is_success === false &&
      /invalid|expired token/i.test(String(result.body.message)))
  ) {
    try {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.is_success && refreshResult.data?.access_token) {
        setToken(refreshResult.data.access_token);
        result = await doFetch(refreshResult.data.access_token);
        return result.body;
      }
      return result.body;
    } catch {
      return {
        is_success: false,
        message: "Failed to refresh access token",
      } as ApiResponse<T>;
    }
  }

  return result.body;
}

export default callApiWithAuth;
