import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface EvaluateJobRequest {
  job_id: string;
  api_key_id: string;
  user_cv_id: string;
  model: string;
  provider: string;
}

export interface EvaluateJobResponse {
  id: string;
  status: string;
}

/**
 * Trigger evaluation of a job with a candidate CV using a given API key / model
 */
export async function evaluateJob(
  payload: EvaluateJobRequest
): Promise<ApiResponse<EvaluateJobResponse>> {
  const url = buildCoreUrl(`/jobs/evaluate`);
  const res = await callApiWithAuth<EvaluateJobResponse>(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res;
}

export default evaluateJob;
