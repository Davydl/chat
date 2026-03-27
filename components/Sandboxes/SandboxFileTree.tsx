"use client";

import { useState } from "react";
import { FileTree } from "@/components/ai-elements/file-tree";
import FileNodeComponent from "./FileNodeComponent";
import SandboxFilePreview from "./SandboxFilePreview";
import useSandboxes from "@/hooks/useSandboxes";
import useSandboxFileContent from "@/hooks/useSandboxFileContent";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { usePrivy } from "@privy-io/react-auth";
import { uploadSandboxFiles } from "@/lib/sandboxes/uploadSandboxFiles";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";

export default function SandboxFileTree() {
  const { filetree, isLoading, error, refetch } = useSandboxes();
  const fileContent = useSandboxFileContent();
  const { getAccessToken } = usePrivy();
  const [uploading, setUploading] = useState(false);

  const handleFilesDropped = async (files: File[]) => {
    setUploading(true);
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        toast.error("Please sign in to upload files");
        return;
      }

      // Determine target path from selected file's directory
      let targetPath: string | undefined;
      if (fileContent.selectedPath) {
        const parts = fileContent.selectedPath.split("/");
        // If selected path looks like a file (has extension), use parent dir
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) {
          targetPath = parts.slice(0, -1).join("/");
        } else {
          targetPath = fileContent.selectedPath;
        }
      }

      const result = await uploadSandboxFiles({
        accessToken,
        files,
        path: targetPath,
      });

      if (result.errors?.length) {
        toast.warning(`Uploaded ${result.uploaded.length} files, ${result.errors.length} failed`);
      } else {
        toast.success(`Uploaded ${result.uploaded.length} file${result.uploaded.length === 1 ? "" : "s"}`);
      }

      refetch();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragging } = useDragAndDrop({
    onDrop: handleFilesDropped,
    maxFiles: 100,
    maxSizeMB: 100,
    disabled: uploading,
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader className="h-4 w-4 animate-spin" />
        <span>Loading files...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive">
        <p>Failed to load files</p>
        <button
          onClick={() => refetch()}
          className="text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (filetree.length === 0) {
    return (
      <div
        {...getRootProps()}
        className={`w-full max-w-md rounded-lg p-8 border-2 border-dashed transition-all ${
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Upload className="h-8 w-8" />
          <p className="text-sm">No files yet. Drag and drop files here to upload.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`flex w-full flex-col gap-4 lg:flex-row rounded-lg transition-all relative ${
        isDragging ? "ring-2 ring-primary ring-offset-2 bg-primary/5" : ""
      }`}
    >
      <input {...getInputProps()} />

      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 backdrop-blur-sm rounded-lg z-10 pointer-events-none">
          <div className="flex flex-col items-center gap-3 text-primary">
            <Upload className="h-12 w-12 animate-bounce" />
            <p className="text-lg font-medium">Drop files to upload to repository</p>
          </div>
        </div>
      )}

      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg z-10">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader className="h-4 w-4 animate-spin" />
            <span>Uploading...</span>
          </div>
        </div>
      )}

      <div className="w-full lg:max-w-md lg:shrink-0">
        <h2 className="mb-2 text-lg font-medium">Repository Files</h2>
        <FileTree selectedPath={fileContent.selectedPath} onSelect={fileContent.select}>
          {filetree.map((node) => (
            <FileNodeComponent key={node.path} node={node} />
          ))}
        </FileTree>
      </div>
      {fileContent.selectedPath && (
        <SandboxFilePreview
          selectedPath={fileContent.selectedPath}
          content={fileContent.content}
          loading={fileContent.loading}
          error={fileContent.error}
        />
      )}
    </div>
  );
}
