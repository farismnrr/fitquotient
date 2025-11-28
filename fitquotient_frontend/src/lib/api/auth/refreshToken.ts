import { refreshAccessToken as refreshAccessTokenAction } from "@/server/api/refreshToken";
import type { RefreshTokenResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function refreshAccessToken(): Promise<
  ApiResponse<RefreshTokenResponse>
> {
  try {
    const result = await refreshAccessTokenAction();
    return result;
  } catch (error) {
    // The server action might throw; try to parse a serialized
    // ApiResponse from the error message if present, otherwise
    // return a failure ApiResponse to let the callers handle it
    if (error instanceof Error) {
      try {
        const parsed = JSON.parse(
          error.message
        ) as ApiResponse<RefreshTokenResponse>;
        return parsed;
      } catch {
        return {
          is_success: false,
          message: error.message || "Failed to refresh access token",
          details: undefined,
        } as ApiResponse<RefreshTokenResponse>;
      }
    }
    return {
      is_success: false,
      message: "Failed to refresh access token",
      details: undefined,
    } as ApiResponse<RefreshTokenResponse>;
  }
}
