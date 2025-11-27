"use server";

import type { RegisterData } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function registerUser(data: RegisterData): Promise<ApiResponse> {
  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;

  if (!apiUrl) {
    const msg = "Missing URL_CORE environment variable";
    console.error(msg);
    return {
      is_success: false,
      message: msg,
      details: undefined,
    } as ApiResponse;
  }

  try {
    const response = await fetch(`${apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey || "",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      const msg = `Core API returned ${response.status} ${response.statusText}: ${text}`;
      console.error(msg);
      return {
        is_success: false,
        message: msg,
        details: undefined,
      } as ApiResponse;
    }

    const result: ApiResponse = await response.json();
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("registerUser fetch error:", message);
    return {
      is_success: false,
      message: `Failed to register: ${message}`,
      details: undefined,
    } as ApiResponse;
  }
}
