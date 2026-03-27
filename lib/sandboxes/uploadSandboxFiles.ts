import { NEW_API_BASE_URL } from "@/lib/consts";

interface UploadedFile {
  path: string;
  sha: string;
}

interface UploadSandboxFilesResponse {
  status: "success" | "error";
  uploaded?: UploadedFile[];
  errors?: string[];
  error?: string;
}

/**
 * Uploads files to the sandbox GitHub repository via POST /api/sandboxes/files.
 *
 * @param accessToken - The Privy access token for authentication
 * @param files - Array of File objects to upload
 * @param path - Target directory path within the repository (optional)
 * @param message - Commit message (optional)
 * @returns The upload result with uploaded file details
 */
export async function uploadSandboxFiles({
  accessToken,
  files,
  path,
  message,
}: {
  accessToken: string;
  files: File[];
  path?: string;
  message?: string;
}): Promise<{ uploaded: UploadedFile[]; errors?: string[] }> {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file);
  }

  if (path) {
    formData.append("path", path);
  }

  if (message) {
    formData.append("message", message);
  }

  const response = await fetch(`${NEW_API_BASE_URL}/api/sandboxes/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data: UploadSandboxFilesResponse = await response.json();

  if (!response.ok || data.status === "error") {
    throw new Error(data.error || "Failed to upload files");
  }

  return {
    uploaded: data.uploaded || [],
    errors: data.errors,
  };
}
