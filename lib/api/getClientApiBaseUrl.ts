import { NEW_API_BASE_URL } from "@/lib/consts";

/**
 * Resolves the API base URL for client-side API calls.
 */
export function getClientApiBaseUrl(): string {
  return NEW_API_BASE_URL;
}
