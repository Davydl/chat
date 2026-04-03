import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import { Tables } from "@/types/database.types";

export type ApiKey = Tables<"account_api_keys">;

/**
 * Fetch API keys for the authenticated account
 * @param accessToken - The access token for authentication
 * @returns Promise with the list of API keys
 */
export async function fetchApiKeys(accessToken: string): Promise<ApiKey[]> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/keys`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.message || "Failed to fetch API keys");
  }

  return data.keys || [];
}
