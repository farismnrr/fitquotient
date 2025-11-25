"use server";

// AppError is not used because we return ApiResponse on errors instead

import { cookies } from "next/headers";
import type { RefreshTokenResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function refreshAccessToken(): Promise<
  ApiResponse<RefreshTokenResponse>
> {
  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken");

  if (!refreshToken) {
    return {
      is_success: false,
      message: "No refresh token found",
      details: undefined,
    } as ApiResponse<RefreshTokenResponse>;
  }

  try {
    const response = await fetch(`${apiUrl}/users/refresh`, {
      method: "GET",
      headers: {
        "X-API-KEY": apiKey || "",
        Cookie: `refreshToken=${refreshToken.value}`,
      },
      credentials: "include",
    });

    const result: ApiResponse<RefreshTokenResponse> = await response.json();

    if (!result.is_success) {
      return result;
    }

    return result;
  } catch {
    return {
      is_success: false,
      message: "Failed to refresh access token",
      details: undefined,
    } as ApiResponse<RefreshTokenResponse>;
  }
}
