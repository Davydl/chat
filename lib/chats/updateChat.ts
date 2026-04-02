import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

export type UpdateChatParams = {
  accessToken: string;
  chatId: string;
  topic: string;
};

export type UpdateChatResponse = {
  status: "success" | "error";
  chat?: {
    id: string;
    account_id: string;
    topic: string;
    updated_at: string;
    artist_id: string | null;
  };
  error?: string;
};

export async function updateChat({
  accessToken,
  chatId,
  topic,
}: UpdateChatParams): Promise<UpdateChatResponse> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/chats`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      chatId,
      topic,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update chat");
  }

  return response.json();
}
