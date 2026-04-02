import { useMemo, useCallback } from "react";
import { DefaultChatTransport } from "ai";
import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import { usePrivy } from "@privy-io/react-auth";
import { useSearchParams } from "next/navigation";

export function useChatTransport() {
  const { getAccessToken } = usePrivy();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const getHeaders = useCallback(async () => {
    const accessToken = await getAccessToken();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
  }, [getAccessToken]);

  const transport = useMemo(() => {
    // Recreate transport when query params change so ?api= override is reflected.
    void searchParamsKey;
    const baseUrl = getClientApiBaseUrl();
    return new DefaultChatTransport({
      api: `${baseUrl}/api/chat`,
    });
  }, [searchParamsKey]);

  return { transport, getHeaders };
}
