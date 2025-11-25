import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";
// AppError previously imported but unused - removed

export interface RawCV {
  id: string;
  user_id: string;
  name?: string | null;
  url: string;
  filename?: string | null;
  mime_type?: string | null;
  size?: string | number | null;
  storage_provider?: string | null;
  is_active?: boolean;
  created_at?: unknown;
  updated_at?: unknown;
}

export interface GetUserCvsData {
  cvs: RawCV[];
}

/**
 * Fetch list of CVs for the currently-authenticated user from the core API.
 * This function always uses `/users/cvs` and does not accept a userId parameter.
 */
export async function getUserCvs(): Promise<ApiResponse<GetUserCvsData>> {
  const url = buildCoreUrl(`/users/cvs`);
  const res = await callApiWithAuth<GetUserCvsData>(url, {
    method: "GET",
  });

  return res;
}

export default getUserCvs;
