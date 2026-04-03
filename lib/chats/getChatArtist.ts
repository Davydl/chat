import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

interface ChatArtistResponse {
  status: string;
  room_id: string;
  artist_id: string | null;
  artist_exists: boolean;
}

/**
 * Fetches the artist associated with a chat room.
 */
export async function getChatArtist(
  roomId: string,
  accessToken: string,
): Promise<ChatArtistResponse> {
  const url = getClientApiBaseUrl();

  const response = await fetch(`${url}/api/chats/${encodeURIComponent(roomId)}/artist`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat artist");
  }

  return response.json();
}
