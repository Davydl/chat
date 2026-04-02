import { useMemo, useCallback } from "react";
import { DefaultChatTransport } from "ai";
import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import { usePrivy } from "@privy-io/react-auth";

export function useChatTransport() {
  const { getAccessToken } = usePrivy();
  const baseUrl = getClientApiBaseUrl();

  const getHeaders = useCallback(async () => {
    const accessToken = await getAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
  }, [getAccessToken]);

  const transport = useMemo(() => {
    return new DefaultChatTransport({
      api: `${baseUrl}/api/chat`,
    });
  }, [baseUrl]);

  return { transport, getHeaders };
}
