import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";
// AppError previously imported but unused - removed

export interface RawCV {
  id: string;
  user_id: string;
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
 * Fetch list of CVs for a user from the core API.
 * If userId is omitted, call `/users/me/cvs` (server side allowed) by default.
 */
export async function getUserCvs(
  userId?: string
): Promise<ApiResponse<GetUserCvsData>> {
  const url = buildCoreUrl(`/users/${userId}/cvs`);
  const res = await callApiWithAuth<GetUserCvsData>(url, {
    method: "GET",
  });

  return res;
}

export default getUserCvs;
