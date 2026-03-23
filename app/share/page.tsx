"use client";

import { useState, useRef, useCallback, useEffect, DragEvent } from "react";
import { 
  Upload, 
  FileIcon, 
  Download, 
  Copy, 
  Check, 
  X,
  Link,
  Share2,
  Image,
  Film,
  Music,
  FileText,
  Loader2,
  ExternalLink,
  Zap,
  QrCode,
  Smartphone,
  MessageCircle,
  Send,
  Eye,
  FileCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatBytes } from "@/lib/utils";
import { FilePreview } from "@/components/file-preview";

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function SharePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB
  const APP_URL = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (uploadedFile && status === "success") {
      generateQrCode();
    }
  }, [uploadedFile, status]);

  const generateQrCode = async () => {
    if (!uploadedFile) return;
    
    try {
      const downloadUrl = `${APP_URL}/api/download?url=${encodeURIComponent(uploadedFile.url)}&name=${encodeURIComponent(uploadedFile.name)}`;
      
      const response = await fetch(`/api/qr?url=${encodeURIComponent(downloadUrl)}&size=400`);
      const data = await response.json();
      
      if (data.success) {
        setQrCode(data.qrCode);
      }
    } catch (err) {
      console.error("QR generation error:", err);
    }
  };

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setError(null);
    setUploadedFile(null);
    setStatus("uploading");
    setProgress(0);
    setQrCode(null);
    setShowPreview(false);

    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large. Maximum size is ${formatBytes(MAX_FILE_SIZE)}`);
      setStatus("error");
      return;
    }

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomCode", "share");

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();
      
      setProgress(100);
      setUploadedFile({
        name: data.fileName,
        size: data.fileSize,
        type: data.fileType,
        url: data.fileUrl,
      });
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus("error");
    }
  };

  const copyLink = async () => {
    if (uploadedFile) {
      await navigator.clipboard.writeText(uploadedFile.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (uploadedFile) {
      const text = encodeURIComponent(`Check out this file: ${uploadedFile.name}\n${uploadedFile.url}`);
      window.open(`https://wa.me/?text=${text}`, "_blank");
    }
  };

  const shareOnTelegram = () => {
    if (uploadedFile) {
      const text = encodeURIComponent(`Check out this file: ${uploadedFile.name}\n${uploadedFile.url}`);
      window.open(`https://t.me/share/url?url=${uploadedFile.url}&text=${text}`, "_blank");
    }
  };

  const shareFile = async () => {
    if (!uploadedFile) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: uploadedFile.name,
          text: `Check out this file: ${uploadedFile.name}`,
          url: uploadedFile.url,
        });
      } catch (err) {
        copyLink();
      }
    } else {
      copyLink();
    }
  };

  const downloadFile = () => {
    if (uploadedFile) {
      const downloadLink = `${APP_URL}/api/download?url=${encodeURIComponent(uploadedFile.url)}&name=${encodeURIComponent(uploadedFile.name)}`;
      window.location.href = downloadLink;
    }
  };

  const resetUpload = () => {
    setStatus("idle");
    setProgress(0);
    setUploadedFile(null);
    setError(null);
    setQrCode(null);
    setShowPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isPreviewable = uploadedFile && (
    uploadedFile.type.startsWith("image/") ||
    uploadedFile.type.startsWith("video/") ||
    uploadedFile.type.startsWith("audio/") ||
    uploadedFile.type.startsWith("text/") ||
    uploadedFile.type === "application/pdf" ||
    isCodeFile(uploadedFile.name)
  );

  const isImage = uploadedFile?.type.startsWith("image/");
  const isVideo = uploadedFile?.type.startsWith("video/");
  const isAudio = uploadedFile?.type.startsWith("audio/");
  const isText = uploadedFile?.type.startsWith("text/");
  const isPdf = uploadedFile?.type === "application/pdf";
  const isCode = uploadedFile && isCodeFile(uploadedFile.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Preview Modal */}
      {showPreview && uploadedFile && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-in fade-in overflow-y-auto"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="w-full max-w-3xl my-8 animate-in zoom-in-95 slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setShowPreview(false)}
                className="bg-white/90 hover:bg-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilePreview
              url={uploadedFile.url}
              name={uploadedFile.name}
              type={uploadedFile.type}
              size={uploadedFile.size}
              className="w-full"
            />
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      {showQrModal && qrCode && uploadedFile && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="bg-white rounded-3xl p-8 max-w-md w-full animate-in zoom-in-95 slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <QrCode className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Scan to Download</h3>
                  <p className="text-xs text-gray-500">Auto-downloads on scan</p>
                </div>
              </div>
              <button 
                onClick={() => setShowQrModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border-2 border-gray-100 mb-6">
              <img 
                src={qrCode} 
                alt="QR Code" 
                className="w-full aspect-square"
              />
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="font-semibold text-gray-900 truncate">{uploadedFile.name}</p>
              <p className="text-sm text-gray-500">{formatBytes(uploadedFile.size)}</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Smartphone className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-indigo-900">How it works:</p>
                  <p className="text-indigo-700 mt-1">
                    Scan the QR code with your phone&apos;s camera. The file will 
                    <span className="font-semibold"> download automatically</span> when the page opens!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = qrCode;
                  link.download = `qr-${uploadedFile.name}.png`;
                  link.click();
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Save QR
              </Button>
              <Button 
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                onClick={downloadFile}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">TempShare</h1>
              <p className="text-xs text-gray-500">Free file sharing - No login</p>
            </div>
          </div>
          <Button variant="ghost" asChild>
            <a href="/">Home</a>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Share Files Instantly
          </h2>
          <p className="text-gray-500">
            Upload any file up to 200MB. No login required. Free forever.
          </p>
        </div>

        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => status === "idle" && fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer",
            isDragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-gray-300 bg-white hover:border-indigo-400 hover:bg-gray-50",
            status !== "idle" && "pointer-events-none"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          {status === "idle" && (
            <>
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <Upload className="h-10 w-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Drop your file here
              </h3>
              <p className="text-gray-500 mb-4">
                or click to browse
              </p>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  Images
                </span>
                <span className="flex items-center gap-1">
                  <Film className="h-4 w-4" />
                  Videos
                </span>
                <span className="flex items-center gap-1">
                  <Music className="h-4 w-4" />
                  Audio
                </span>
                <span className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Docs
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Max file size: {formatBytes(MAX_FILE_SIZE)}
              </p>
            </>
          )}

          {/* Uploading State */}
          {status === "uploading" && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-indigo-100 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Uploading...
              </h3>
              <div className="max-w-xs mx-auto">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {Math.round(progress)}%
                </p>
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {status === "error" && error && (
          <Card className="mt-4 p-4 border-red-200 bg-red-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-red-800">{error}</p>
                <p className="text-sm text-red-600">Please try again</p>
              </div>
              <Button variant="outline" size="sm" onClick={resetUpload}>
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Success State - Uploaded File */}
        {status === "success" && uploadedFile && (
          <Card className="mt-4 p-6 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white animate-in slide-in-from-bottom-4">
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Complete!</h3>
                <p className="text-sm text-gray-500">{formatBytes(uploadedFile.size)}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto"
                onClick={resetUpload}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Inline Preview for Images */}
            {isImage && !showPreview && (
              <div className="mb-6 rounded-xl overflow-hidden bg-gray-100">
                <img 
                  src={uploadedFile.url} 
                  alt={uploadedFile.name}
                  className="w-full max-h-64 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setShowPreview(true)}
                />
              </div>
            )}

            {/* File Icon for Non-Images */}
            {!isImage && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl flex items-center gap-4">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center",
                  isVideo ? "bg-purple-100" : 
                  isAudio ? "bg-green-100" : "bg-indigo-100"
                )}>
                  {isVideo ? (
                    <Film className="h-8 w-8 text-purple-600" />
                  ) : isAudio ? (
                    <Music className="h-8 w-8 text-green-600" />
                  ) : isPdf ? (
                    <FileText className="h-8 w-8 text-red-600" />
                  ) : isCode ? (
                    <FileCode className="h-8 w-8 text-orange-600" />
                  ) : (
                    <FileIcon className="h-8 w-8 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-500">{uploadedFile.type}</p>
                </div>
                {isPreviewable && (
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(true)}
                    className="shrink-0"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                )}
              </div>
            )}

            {/* Preview Button for Images */}
            {isImage && (
              <Button 
                variant="outline"
                className="w-full mb-6"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Open Full Preview
              </Button>
            )}

            {/* Share Links */}
            <div className="space-y-4">
              {/* URL Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={uploadedFile.url}
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono truncate"
                  />
                </div>
              </div>

              {/* Share Buttons Row 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button 
                  onClick={copyLink}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Link
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={downloadFile}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>

                <Button 
                  variant="outline"
                  onClick={() => setShowQrModal(true)}
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 hover:bg-indigo-100"
                >
                  <QrCode className="h-4 w-4 mr-1" />
                  QR Code
                </Button>

                <Button 
                  variant="outline"
                  onClick={shareFile}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>

              {/* Social Media Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={shareOnWhatsApp}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                
                <Button 
                  onClick={shareOnTelegram}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Telegram
                </Button>
              </div>

              {/* QR Quick Preview */}
              {qrCode && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <QrCode className="h-4 w-4" />
                    Quick QR Preview
                  </p>
                  <div className="flex items-center gap-4">
                    <img 
                      src={qrCode} 
                      alt="QR Code" 
                      className="w-24 h-24 rounded-lg border border-gray-200"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 mb-1">
                        Scan to Download Instantly
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Perfect for sharing with friends who can scan with their phone
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setShowQrModal(true)}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        View Full QR
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Features */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center">
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
              <Zap className="h-6 w-6 text-indigo-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Instant</h4>
            <p className="text-xs text-gray-500 mt-1">Upload and share immediately</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">WhatsApp</h4>
            <p className="text-xs text-gray-500 mt-1">Share directly to WhatsApp</p>
          </div>
          <div className="p-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
              <QrCode className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">QR Ready</h4>
            <p className="text-xs text-gray-500 mt-1">Scan to download files</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/50 mt-12 py-6 text-center text-sm text-gray-400">
        <p>Files are hosted on Catbox.moe - Free and reliable</p>
      </footer>
    </div>
  );
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'scss',
    'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp',
    'go', 'rs', 'swift', 'kt', 'sql', 'sh', 'bash', 'zsh',
    'md', 'txt', 'yml', 'yaml', 'xml', 'env', 'gitignore'
  ];
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return codeExtensions.includes(ext);
}
