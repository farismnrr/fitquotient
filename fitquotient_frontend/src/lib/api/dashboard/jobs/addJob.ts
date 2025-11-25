import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface AddJobRequest {
  title: string;
  description?: string;
  details: {
    company?: string;
    requirements: string;
    benefits?: string[];
    salary?: string | null;
  };
}

export interface AddJobResponse {
  job_id?: string;
}

/**
 * Create a new Job in the core backend
 */
export async function addJob(
  payload: AddJobRequest
): Promise<ApiResponse<AddJobResponse>> {
  const url = buildCoreUrl(`/jobs`);

  const res = await callApiWithAuth<AddJobResponse>(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  // map validation details to a single message if present (same pattern as addApiKey)
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

export default addJob;
