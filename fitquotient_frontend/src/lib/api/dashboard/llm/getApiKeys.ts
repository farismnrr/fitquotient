import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface LLMKey {
  id: string;
  name?: string;
  provider?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export interface GetApiKeysData {
  api_keys: LLMKey[];
}

/**
 * Fetch list of LLM API keys from the core API
 */
export async function getApiKeys(): Promise<ApiResponse<GetApiKeysData>> {
  const url = buildCoreUrl(`/llms`);
  const res = await callApiWithAuth<GetApiKeysData>(url, { method: "GET" });
  return res;
}

export default getApiKeys;
