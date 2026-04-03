import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

interface ChatSegmentResponse {
  status: string;
  room_id: string;
  segment_id: string | null;
  segment_exists: boolean;
}

/**
 * Fetches the segment associated with a chat room.
 */
export async function getChatSegment(
  roomId: string,
  accessToken: string,
): Promise<ChatSegmentResponse> {
  const url = getClientApiBaseUrl();

  const response = await fetch(`${url}/api/chats/${encodeURIComponent(roomId)}/segment`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch segment ID");
  }

  return response.json();
}
