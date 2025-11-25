import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import { LLMBackendName } from "@/types/llm";
// AppError previously imported but unused - removed
import type { ApiResponse } from "@/types/api";

export interface AddLLMKeyRequest {
  name: string;
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
  const url = buildCoreUrl(`/llms`);

  const res = await callApiWithAuth<LLMKeyResponse>(url, {
    method: "POST",
    body: JSON.stringify(payload),
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
