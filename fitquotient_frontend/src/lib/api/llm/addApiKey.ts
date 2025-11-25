import { useAuthStore } from "@/store/authStore";
import { LLMBackendName } from "@/lib/api/llm/types";
// Import next.config so the client can read the configured nextConfig.env
// This allows reading the NEXT_PUBLIC_URL_CORE value without relying on runtime process.env
import nextConfig from "../../../../next.config";
import { callApiWithAuth } from "@/lib/api/withAuth";
import AppError from "@/lib/errors/AppError";
import type { ApiResponse } from "@/types/api";

export interface AddLLMKeyRequest {
  name: string;
  // provider is optional on the client side; when provided it is one of the
  // backend-supported provider names (OPENAI, ANTHROPIC, GOOGLE). If omitted
  // a backend validation error will be returned.
  provider?: LLMBackendName;
  secret: string;
}

export interface LLMKeyResponse {
  id?: string;
  name?: string;
  provider?: string;
  secret?: string;
}

/**
 * Add a new LLM API key to the core backend
 * - Uses access token from client state (Zustand store)
 * - If request fails with 401, tries to refresh token using refresh token flow
 */
export async function addApiKey(
  payload: AddLLMKeyRequest
): Promise<ApiResponse<LLMKeyResponse>> {
  const apiUrl = nextConfig?.env?.NEXT_PUBLIC_URL_CORE;
  if (!apiUrl)
    throw new AppError("Missing API URL (process.env.NEXT_PUBLIC_URL_CORE)", {
      code: "MISSING_ENV",
      details: { env: "NEXT_PUBLIC_URL_CORE" },
    });

  const url = `${apiUrl}/llms`;
  const token = useAuthStore.getState().getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await callApiWithAuth<LLMKeyResponse>(url, {
    method: "POST",
    body: JSON.stringify(payload),
    credentials: "include",
    headers,
  });

  if (!res.is_success && Array.isArray(res.details) && res.details.length) {
    const detailMessages = res.details
      .map((d) => (d?.message ? String(d.message) : ""))
      .filter(Boolean);
    if (detailMessages.length) {
      res.message = detailMessages.join(" | ");
    }
  }

  return res;
}

export default addApiKey;
