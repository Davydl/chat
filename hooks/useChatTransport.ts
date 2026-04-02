import { useMemo, useCallback } from "react";
import { DefaultChatTransport } from "ai";
import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import { usePrivy } from "@privy-io/react-auth";
import { useApiOverride } from "./useApiOverride";

export function useChatTransport() {
  const { getAccessToken } = usePrivy();
  const apiOverride = useApiOverride();

  const getHeaders = useCallback(async () => {
    const accessToken = await getAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
  }, [getAccessToken]);

  const transport = useMemo(() => {
    // Keep transport URL in sync when override state changes.
    void apiOverride;
    const baseUrl = getClientApiBaseUrl();
    return new DefaultChatTransport({
      api: `${baseUrl}/api/chat`,
    });
  }, [apiOverride]);

  return { transport, getHeaders };
}
