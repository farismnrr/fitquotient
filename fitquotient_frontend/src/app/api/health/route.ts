import { NextResponse } from "next/server";

/**
 * Health check endpoint for the frontend app.
 * - Returns 200 OK for the frontend itself.
 * - Optionally probes the core API health endpoint at ${URL_CORE}/health
 *   using URL_API_KEY if provided, and returns aggregated backend status.
 * - Accessible without auth so Docker / orchestration healthchecks can hit it.
 */
export async function GET() {
  // Basic OK status for frontend
  const result: { status: string; backend?: { status: string } } = {
    status: "ok",
  };

  const apiUrl = process.env.URL_CORE;
  const apiKey = process.env.URL_API_KEY;

  if (apiUrl) {
    try {
      const url = `${apiUrl.replace(/\/+$/u, "")}/health`;
      const headers: Record<string, string> = {};
      if (apiKey) headers["X-API-KEY"] = apiKey;
      
      // Add timeout to prevent hanging if backend is slow
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
      
      const res = await fetch(url, { 
        method: "GET", 
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        result.backend = { status: "ok" };
      } else {
        result.backend = { status: `unhealthy (${res.status})` };
      }
    } catch {
      result.backend = { status: "unreachable" };
    }
  }

  return NextResponse.json(result, { status: 200 });
}
