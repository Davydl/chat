import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "@/hooks/useAccessToken";
import { useApiOverride } from "@/hooks/useApiOverride";
import { NEW_API_BASE_URL } from "@/lib/consts";

interface RoomSegmentResponse {
  segmentId: string | null;
  error?: string;
}

export const useChatSegment = (roomId?: string) => {
  const accessToken = useAccessToken();
  const apiOverride = useApiOverride();
  const baseUrl = apiOverride || NEW_API_BASE_URL;

  return useQuery({
    queryKey: ["roomSegment", roomId],
    queryFn: async (): Promise<RoomSegmentResponse> => {
      if (!roomId || !accessToken) {
        return { segmentId: null };
      }

      const response = await fetch(`${baseUrl}/api/chats/${encodeURIComponent(roomId)}/segment`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        const error = await response.json();
        console.error("[useChatSegment] API error:", {
          status: response.status,
          error,
        });
        throw new Error(error.error || "Failed to fetch segment ID");
      }

      const data = await response.json();
      return { segmentId: data.segment_id ?? null };
    },
    enabled: !!roomId && !!accessToken,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });
};
