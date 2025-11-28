import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Decode JWT payload safely (returns undefined if not a JWT or failure).
 */
export function parseJwtPayload(
  token?: string | null
): Record<string, unknown> | undefined {
  if (!token) return undefined;
  const parts = token.split(".");
  if (parts.length < 2) return undefined;
  try {
    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    try {
      return JSON.parse(decoded);
    } catch {
      // fallback: return object with raw payload string
      return { raw: decoded } as unknown as Record<string, unknown>;
    }
  } catch {
    return undefined;
  }
}

/**
 * Extract the user id from a JWT token. We try common claim names `user_id` and `sub`.
 */
export function getUserIdFromAccessToken(
  token?: string | null
): string | undefined {
  const payload = parseJwtPayload(token);
  if (!payload) return undefined;

  // ignore tokens that are explicitly refresh tokens
  const maybeType = payload["type"] ?? payload["typ"] ?? payload["token_type"];
  if (typeof maybeType === "string" && maybeType.toLowerCase() === "refresh")
    return undefined;

  const maybeId = payload["user_id"] ?? payload["sub"] ?? payload["uid"];
  return typeof maybeId === "string" ? maybeId : undefined;
}

/**
 * Truncate a string to a maximum length and append an ellipsis when truncated.
 */
export function truncate(text?: string | null, maxLength = 120): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
