"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload, Image, Video, Music, FileIcon, Loader2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface FilePanelProps {
  open: boolean;
  uploading: boolean;
  onClose: () => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadClick: () => void;
}

export function FilePanel({ open, uploading, onClose, onFileSelect, onUploadClick }: FilePanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-5 border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white">Upload Files</h3>
          <Button variant="ghost" size="icon" onClick={onClose} disabled={uploading} className="hover:bg-white/10 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={onFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
        />
        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center mb-4 hover:border-indigo-500/50 transition-all cursor-pointer bg-white/5" onClick={() => !uploading && fileInputRef.current?.click()}>
          <Upload className="h-12 w-12 text-indigo-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-white/80">Click to select files</p>
          <p className="text-xs text-white/40 mt-1">or drag and drop</p>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-white/50 mb-4">
          <div className="flex items-center gap-1.5">
            <Image className="h-4 w-4 text-pink-400" /> Images
          </div>
          <div className="flex items-center gap-1.5">
            <Video className="h-4 w-4 text-purple-400" /> Videos
          </div>
          <div className="flex items-center gap-1.5">
            <Music className="h-4 w-4 text-indigo-400" /> Audio
          </div>
          <div className="flex items-center gap-1.5">
            <FileIcon className="h-4 w-4 text-blue-400" /> Docs
          </div>
        </div>
        <Button
          onClick={() => !uploading && fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading files...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" /> Select Multiple Files
            </>
          )}
        </Button>
        <p className="text-xs text-white/40 mt-3 text-center">
          Max {formatBytes(MAX_FILE_SIZE)} per file
        </p>
      </div>
    </div>
  );
}
