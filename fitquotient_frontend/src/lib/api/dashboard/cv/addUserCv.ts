import { buildCoreUrl, callApiWithAuth } from "@/lib/api/withAuth";
import type { ApiResponse } from "@/types/api";
import type { RawCV } from "./getUserCvs";

export interface AddUserCvData {
  cv: RawCV;
}

/**
 * Upload a new CV file for the currently-authenticated user.
 * This utility always uses `/users/cvs` and does not accept a user id parameter.
 * - `file` should be the File object from a file input
 */
export async function addUserCv(
  file: File,
  name?: string
): Promise<ApiResponse<AddUserCvData>> {
  if (!file) {
    return {
      is_success: false,
      message: "Missing file",
    } as ApiResponse<AddUserCvData>;
  }

  const url = buildCoreUrl(`/users/cvs`);
  const formData = new FormData();
  formData.append("file", file);
  if (typeof name === "string") formData.append("name", name);

  const res = await callApiWithAuth<Record<string, unknown>>(url, {
    method: "POST",
    body: formData,
    // DO NOT set Content-Type header manually for FormData
    headers: {},
  });

  // If the server already returns a nested `data.cv`, simply cast and return
  if (res && res.data && typeof res.data === "object" && "cv" in res.data) {
    return res as unknown as ApiResponse<AddUserCvData>;
  }

  // Otherwise, attempt to map `{ cv_id, url }` -> `{ cv: RawCV }`
  if (res && res.data && typeof res.data === "object") {
    const payload = res.data as Record<string, unknown>;
    const cvId =
      typeof payload["cv_id"] === "string"
        ? (payload["cv_id"] as string)
        : undefined;
    const urlFromPayload =
      typeof payload["url"] === "string"
        ? (payload["url"] as string)
        : undefined;
    if (cvId) {
      const mapped: RawCV = {
        id: cvId,
        user_id:
          typeof payload["user_id"] === "string"
            ? (payload["user_id"] as string)
            : "",
        url: urlFromPayload || "",
        name:
          typeof payload["name"] === "string"
            ? (payload["name"] as string)
            : undefined,
        filename:
          typeof payload["filename"] === "string"
            ? (payload["filename"] as string)
            : undefined,
        mime_type: undefined,
        size: undefined,
        storage_provider: undefined,
        is_active: true,
        created_at: undefined,
        updated_at: undefined,
      };

      return {
        is_success: res.is_success,
        message: res.message,
        data: {
          cv: mapped,
        },
      } as ApiResponse<AddUserCvData>;
    }
  }

  // fallback: return as-is (may cause UI to handle errors)
  return res as unknown as ApiResponse<AddUserCvData>;
}

export default addUserCv;
