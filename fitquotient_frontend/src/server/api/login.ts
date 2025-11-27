"use server";

import { cookies } from "next/headers";
import type { LoginData, LoginResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/api";

export async function loginUser(
  data: LoginData
): Promise<ApiResponse<LoginResponse>> {
  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;

  if (!apiUrl) {
    const msg = "Missing URL_CORE environment variable";
    console.error(msg);
    return {
      is_success: false,
      message: msg,
      details: undefined,
    } as ApiResponse<LoginResponse>;
  }

  try {
    const response = await fetch(`${apiUrl}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey || "",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });
    // Extract cookies from the backend response
    const setCookieHeader = response.headers.get("set-cookie");

    if (setCookieHeader) {
      // Parse and set the cookie in Next.js
      const cookieStore = await cookies();

      // Parse the Set-Cookie header to extract cookie details
      // Format: refreshToken=value; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=...
      const cookieParts = setCookieHeader.split(";").map((part) => part.trim());
      const [nameValue] = cookieParts;
      const [name, value] = nameValue.split("=");

      // Extract cookie options
      const options: {
        httpOnly: boolean;
        secure: boolean;
        sameSite: "strict";
        path: string;
        maxAge?: number;
      } = {
        httpOnly: cookieParts.some((part) => part.toLowerCase() === "httponly"),
        secure: cookieParts.some((part) => part.toLowerCase() === "secure"),
        sameSite: "strict" as const,
        path: "/",
      };

      // Extract Max-Age if present
      const maxAgePart = cookieParts.find((part) =>
        part.toLowerCase().startsWith("max-age=")
      );
      if (maxAgePart) {
        const maxAge = parseInt(maxAgePart.split("=")[1]);
        options.maxAge = maxAge;
      }

      // Set the cookie
      cookieStore.set(name, value, options);
    }

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      const msg = `Core API returned ${response.status} ${response.statusText}: ${text}`;
      console.error(msg);
      return {
        is_success: false,
        message: msg,
        details: undefined,
      } as ApiResponse<LoginResponse>;
    }

    const result: ApiResponse<LoginResponse> = await response.json();
    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("loginUser fetch error:", message);
    return {
      is_success: false,
      message: `Failed to call core login: ${message}`,
      details: undefined,
    } as ApiResponse<LoginResponse>;
  }
}
