import { NEW_API_BASE_URL } from "@/lib/consts";

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
        return apiParam;
      } catch {
        // Ignore invalid override URL and fall back to default.
      }
    }
  }

  return NEW_API_BASE_URL;
}
