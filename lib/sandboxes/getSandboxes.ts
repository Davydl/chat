import { getClientApiBaseUrl } from "@/lib/api/getClientApiBaseUrl";
import type { Sandbox } from "./createSandbox";
import type { FileTreeEntry } from "./convertFileTreeEntries";

interface GetSandboxesResponse {
  status: "success" | "error";
  sandboxes?: Sandbox[];
  filetree?: FileTreeEntry[];
  error?: string;
}

export interface GetSandboxesResult {
  sandboxes: Sandbox[];
  filetree: FileTreeEntry[];
}

export async function getSandboxes(
  accessToken: string
): Promise<GetSandboxesResult> {
  const response = await fetch(`${getClientApiBaseUrl()}/api/sandboxes`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: GetSandboxesResponse = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.error || "Failed to fetch sandboxes");
  }

  return {
    sandboxes: data.sandboxes || [],
    filetree: data.filetree || [],
  };
}
