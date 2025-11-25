import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface RawJobDetails {
  // Company name may be included in details on some endpoints
  company?: string | null;
  // Requirements / JD may be included in details as well
  requirements?: string | null;
  // benefits are stored as a list of strings (for badges in UI)
  benefits?: string[] | null;
  // Salary is an optional string (e.g., "IDR 5-10M / month")
  salary?: string | null;
}

export interface RawJob {
  id: string;
  title: string;
  description?: string | null;
  details?: RawJobDetails | null;
  // Top-level salary and requirements removed - use details.salary and details.requirements
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
