"use client";

import { useState, useCallback } from "react";
import { 
  FileIcon, 
  Image as ImageIcon, 
  Download, 
  Upload, 
  X, 
  Loader2,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatBytes, cn } from "@/lib/utils";
import type { FileMetadata } from "@/types/message";
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from "@/lib/constants";

interface FilePanelProps {
  files: FileMetadata[];
  roomCode: string;
  onFileUploaded: (file: FileMetadata) => void;
}

export function FilePanel({ files, roomCode, onFileUploaded }: FilePanelProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      alert(`File too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}`);
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert("File type not allowed");
      return;
    }

    setUploading(true);

    try {
      const presignResponse = await fetch("/api/files/presign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          roomCode,
        }),
      });

      if (!presignResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const { uploadUrl, fileUrl, key } = await presignResponse.json();

      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      const newFile: FileMetadata = {
        name: file.name,
        size: file.size,
        type: file.type,
        url: fileUrl,
        key,
      };

      onFileUploaded(newFile);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (file: FileMetadata) => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold flex items-center gap-2">
          <FolderOpen className="h-5 w-5" />
          Shared Files
          <Badge variant="secondary" className="ml-auto">{files.length}</Badge>
        </h2>
      </div>

      <div 
        className={cn(
          "m-4 p-6 border-2 border-dashed rounded-lg text-center transition-colors",
          dragOver 
            ? "border-indigo-500 bg-indigo-50" 
            : "border-gray-300 hover:border-gray-400"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-sm text-gray-600">Uploading...</p>
          </div>
        ) : (
          <>
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag & drop files here
            </p>
            <label className="cursor-pointer">
              <span className="text-sm text-indigo-600 hover:underline">
                or browse
              </span>
              <input
                type="file"
                className="hidden"
                accept={ALLOWED_FILE_TYPES.join(",")}
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </label>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-3">
        {files.length === 0 ? (
          <div className="text-center py-8">
            <FileIcon className="h-10 w-10 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No files shared yet</p>
          </div>
        ) : (
          files.map((file, index) => (
            <FileCard key={file.key || index} file={file} onDownload={downloadFile} />
          ))
        )}
      </div>
    </div>
  );
}

interface FileCardProps {
  file: FileMetadata;
  onDownload: (file: FileMetadata) => void;
}

function FileCard({ file, onDownload }: FileCardProps) {
  const isImage = file.type.startsWith("image/");

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {isImage ? (
        <div className="relative">
          <img
            src={file.url}
            alt={file.name}
            className="w-full h-32 object-cover"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white shadow"
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="p-3 flex items-center gap-3">
          <div className="h-10 w-10 bg-gray-100 rounded flex items-center justify-center shrink-0">
            <FileIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => onDownload(file)}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="px-3 pb-2">
        <p className="text-xs text-gray-500 truncate">{file.name}</p>
      </div>
    </Card>
  );
}
