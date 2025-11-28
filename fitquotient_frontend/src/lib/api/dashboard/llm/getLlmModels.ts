import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface GetLlmModelsData {
  models: string[];
}

/**
 * Fetch list of LLM models supported by a given API Key
 * @param apiKeyId - id of the LLM API key
 */
export async function getLlmModels(
  apiKeyId: string
): Promise<ApiResponse<GetLlmModelsData>> {
  const url = buildCoreUrl(`/llms/${apiKeyId}/models`);
  const res = await callApiWithAuth<GetLlmModelsData>(url, { method: "GET" });
  return res;
}

export default getLlmModels;
