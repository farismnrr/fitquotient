import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";
// AppError previously imported but unused - removed

export interface RawJobDetails {
  about_you?: string[];
  benefits?: Record<string, unknown> | null;
  work_setup?: string | null;
  responsibilities?: string[];
}

export interface RawJob {
  id: string;
  title: string;
  description?: string | null;
  requirements?: string | null;
  details?: RawJobDetails | null;
  is_active?: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export interface GetJobsData {
  jobs: RawJob[];
}

/**
 * Fetch list of jobs from the core API.
 */
export async function getAllJobs(): Promise<ApiResponse<GetJobsData>> {
  const url = buildCoreUrl(`/jobs`);
  const res = await callApiWithAuth<GetJobsData>(url, { method: "GET" });
  return res;
}

export default getAllJobs;
