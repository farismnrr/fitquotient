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
      let message = text;
      let details = undefined;
      try {
        const json = JSON.parse(text);
        if (json.message) {
          message = json.message;
        }
        if (json.details) {
          details = json.details;
        }
      } catch {
        // ignore json parse error
      }

      return {
        is_success: false,
        message: message,
        details: details,
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
