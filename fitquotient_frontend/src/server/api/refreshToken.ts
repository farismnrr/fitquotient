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

  if (!apiUrl) {
    const msg = "Missing URL_CORE environment variable";
    console.error(msg);
    return {
      is_success: false,
      message: msg,
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

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      const msg = `Core API returned ${response.status} ${response.statusText}: ${text}`;
      console.error(msg);
      return {
        is_success: false,
        message: msg,
        details: undefined,
      } as ApiResponse<RefreshTokenResponse>;
    }

    const result: ApiResponse<RefreshTokenResponse> = await response.json();

    if (!result.is_success) {
      return result;
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Refresh token error:", message);
    return {
      is_success: false,
      message: `Failed to refresh access token: ${message}`,
      details: undefined,
    } as ApiResponse<RefreshTokenResponse>;
  }
}
