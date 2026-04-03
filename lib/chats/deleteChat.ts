import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

/**
 * Deletes a chat by ID via the API service.
 */
export async function deleteChat(
  roomId: string,
  accessToken: string,
): Promise<void> {
  const url = getClientApiBaseUrl();

  const response = await fetch(`${url}/api/chats`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ id: roomId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Failed to delete chat");
  }
}
