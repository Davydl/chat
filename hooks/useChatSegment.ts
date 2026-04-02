import { useQuery } from "@tanstack/react-query";
import { usePrivy } from "@privy-io/react-auth";
import { getChatSegment } from "@/lib/chats/getChatSegment";

interface RoomSegmentResponse {
  segmentId: string | null;
}

export const useChatSegment = (roomId?: string) => {
  const { getAccessToken } = usePrivy();

  return useQuery({
    queryKey: ["roomSegment", roomId],
    queryFn: async (): Promise<RoomSegmentResponse> => {
      if (!roomId) return { segmentId: null };

      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("No access token");

      const data = await getChatSegment(roomId, accessToken);
      return { segmentId: data.segment_id ?? null };
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};
