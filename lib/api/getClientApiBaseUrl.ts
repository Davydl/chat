import { NEW_API_BASE_URL } from "@/lib/consts";

function normalizeApiBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Resolves the API base URL for client-side API calls.
 * Query param override: ?api=https://example.com
 */
export function getClientApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const apiParam = new URLSearchParams(window.location.search).get("api");
    if (apiParam && apiParam !== "clear") {
      try {
        new URL(apiParam);
        return normalizeApiBaseUrl(apiParam);
      } catch {
        // Ignore invalid override URL and fall back to default.
      }
    }
  }

  return normalizeApiBaseUrl(NEW_API_BASE_URL);
}
