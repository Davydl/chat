import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

interface AuthorizeConnectorParams {
  connector: string;
  accountId?: string;
  callbackUrl?: string;
}

/**
 * Request an OAuth authorization URL for a connector.
 *
 * @param accessToken - Bearer token for authentication
 * @param params - Connector slug, optional account ID, optional callback URL
 * @returns The OAuth redirect URL, or null on failure
 */
export async function authorizeConnectorApi(
  accessToken: string,
  params: AuthorizeConnectorParams,
): Promise<string | null> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/connectors`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      connector: params.connector,
      ...(params.accountId && { account_id: params.accountId }),
      ...(params.callbackUrl && { callback_url: params.callbackUrl }),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to authorize connector");
  }

  const data = await response.json();
  return data.data?.redirectUrl ?? null;
}
