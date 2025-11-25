import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";
import type { RawJob } from "./getAllJobs";

export interface GetJobData {
  job?: RawJob | null;
}

/**
 * Fetch a job by ID from the core API.
 */
export async function getJobById(id: string): Promise<ApiResponse<GetJobData>> {
  const url = buildCoreUrl(`/jobs/${id}`);
  const res = await callApiWithAuth<GetJobData>(url, { method: "GET" });
  return res;
}

export default getJobById;
