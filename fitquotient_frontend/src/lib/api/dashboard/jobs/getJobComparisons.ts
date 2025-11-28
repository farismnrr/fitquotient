import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";

export interface RawJobComparisonResult {
  summary?: string | null;
  match_score?: number | null;
  skill_match?: string[] | null;
  missing_skills?: string[] | null;
  recommendation?: string | null;
  skill_match_score?: number | null;
  vector_similarity?: number | null;
  experience_relevance?: number | null;
  missing_skills_penalty?: number | null;
}

export interface RawJobComparison {
  comparison_id: string;
  status?: string | null;
  cv_name?: string | null;
  job_title?: string | null;
  result?: RawJobComparisonResult | null;
}

export type GetJobComparisonsData = RawJobComparison[];

/**
 * Fetch job comparisons for the current user. This endpoint returns an array
 * of job comparison metadata including a `result` object with summary, scores,
 * and matched/missing skills.
 */
export async function getJobComparisons(): Promise<
  ApiResponse<GetJobComparisonsData>
> {
  const url = buildCoreUrl(`/jobs/comparisons`);
  const res = await callApiWithAuth<GetJobComparisonsData>(url, {
    method: "GET",
  });
  return res;
}

export default getJobComparisons;
