import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";

export async function deleteSandbox(accessToken: string): Promise<void> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/sandboxes`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete sandbox");
  }
}
