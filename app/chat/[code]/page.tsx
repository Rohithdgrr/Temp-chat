"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, X, Loader2, Check, Image, Video, Music, FileIcon, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBytes, cn } from "@/lib/utils";
import type { Message, FileMetadata, MessageType } from "@/types/message";
import { MAX_FILE_SIZE } from "@/lib/constants";
import { useTimer } from "@/hooks/use-timer";
import {
  ChatHeader,
  MessageBubble,
  EmptyState,
  ChatInput,
  LoadingState,
} from "@/components/chat";

interface PendingMessage {
  tempId: string;
  content: string;
  type: string;
  metadata?: any;
  status: "sending" | "sent" | "failed";
  progress: number;
}

function SendingAnimation({ message, onRetry }: { message: PendingMessage; onRetry?: () => void }) {
  const getTypeIcon = () => {
    if (!message.metadata?.type) return <MessageSquare className="h-4 w-4" />;
    const type = message.metadata.type;
    if (type.startsWith("image/")) return <Image className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Video className="h-4 w-4" />;
    if (type.startsWith("audio/")) return <Music className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
  };

  const getTypeLabel = () => {
    if (!message.metadata?.type) return "Sending message";
    const type = message.metadata.type;
    if (type.startsWith("image/")) return `Sending image (${formatBytes(message.metadata.size || 0)})`;
    if (type.startsWith("video/")) return `Sending video (${formatBytes(message.metadata.size || 0)})`;
    if (type.startsWith("audio/")) return `Sending audio (${formatBytes(message.metadata.size || 0)})`;
    return `Sending file (${formatBytes(message.metadata.size || 0)})`;
  };

  return (
    <div 
      className="flex justify-end animate-in slide-in-from-bottom fade-in"
      onClick={() => message.status === "failed" && onRetry?.()}
    >
      <div className={cn(
        "max-w-[80%] sm:max-w-[70%]",
        message.status === "failed" && "cursor-pointer"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-lg rounded-br-md transition-all",
          message.status === "failed" 
            ? "bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
            : "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-purple-500/30"
        )}>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20">
              {message.status === "failed" ? (
                <X className="h-5 w-5 text-white" />
              ) : message.status === "sent" ? (
                <Check className="h-5 w-5 text-green-300 animate-pulse" />
              ) : (
                <Loader2 className="h-5 w-5 animate-spin" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {getTypeIcon()}
                <span className="text-sm font-medium">
                  {message.status === "failed" ? "Failed to send" : getTypeLabel()}
                </span>
              </div>
              
              {message.status === "sending" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <div className="flex gap-1">
                      <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                    </div>
                    <span>Sending...</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-300"
                      style={{ width: `${message.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {message.status === "sent" && (
                <div className="flex items-center gap-1.5 text-xs text-green-200">
                  <Check className="h-3.5 w-3.5" />
                  <span>Delivered</span>
                </div>
              )}
              
              {message.status === "failed" && (
                <div className="flex items-center gap-1.5 text-xs text-white/90">
                  <span className="underline">Tap to retry</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileSendingAnimation({ file, progress }: { file: File; progress: number }) {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    if (progress < 100) {
      const interval = setInterval(() => {
        setDots(d => d >= 3 ? 1 : d + 1);
      }, 400);
      return () => clearInterval(interval);
    }
  }, [progress < 100]);

  const getFileIcon = () => {
    if (file.type.startsWith("image/")) return <Image className="h-5 w-5 text-pink-400" />;
    if (file.type.startsWith("video/")) return <Video className="h-5 w-5 text-purple-400" />;
    if (file.type.startsWith("audio/")) return <Music className="h-5 w-5 text-indigo-400" />;
    return <FileIcon className="h-5 w-5 text-blue-400" />;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-bottom-2 fade-in">
      <div className="relative">
        <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
          {getFileIcon()}
        </div>
        <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
          <Loader2 className="h-3 w-3 text-white animate-spin" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
          <span className="text-xs text-gray-500">{formatBytes(file.size)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-mono min-w-[40px] text-right">
            {Math.round(progress)}%
          </span>
        </div>
        
        <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-500">
          <span>{".".repeat(dots)}</span>
          <span className={cn(progress >= 100 && "text-green-500 font-medium")}>
            {progress >= 100 ? "Processing..." : "Uploading..."}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const [userCount, setUserCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [pendingMessages, setPendingMessages] = useState<PendingMessage[]>([]);
  const [fileUploads, setFileUploads] = useState<Map<string, { file: File; progress: number }>>(new Map());
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [roomExpiresAt, setRoomExpiresAt] = useState<Date | null>(null);

  const { timeLeft, isExpired } = useTimer(roomExpiresAt);

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", Math.random().toString(36).substring(2, 10));
    }
    loadMessages();

    // Polling for real-time updates (works on serverless)
    const pollInterval = setInterval(() => {
      loadMessages(true); // silent mode
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(pollInterval);
  }, [code]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const removeSelectedFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadSelectedFiles = useCallback(async () => {
    if (selectedFiles.length === 0) return;
    
    const oversizedFiles = selectedFiles.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`File too large. Max ${formatBytes(MAX_FILE_SIZE)} per file`);
      return;
    }

    setUploading(true);
    const filesToUpload = [...selectedFiles];
    setSelectedFiles([]);

    const uploadFile = async (file: File) => {
      const tempId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setFileUploads((prev) => new Map(prev).set(tempId, { file, progress: 0 }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomCode", code);

      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        uploadProgress = Math.min(uploadProgress + Math.random() * 10, 95);
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          if (newMap.has(tempId)) {
            newMap.set(tempId, { file, progress: uploadProgress });
          }
          return newMap;
        });
      }, 150);

      try {
        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        uploadProgress = 100;
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          newMap.set(tempId, { file, progress: 100 });
          return newMap;
        });

        if (response.ok) {
          const data = await response.json();
          
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          setFileUploads((prev) => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });

          sendMessage(`Shared: ${data.fileName}`, data.messageType, {
            name: data.fileName,
            size: data.fileSize,
            type: data.fileType,
            url: data.fileUrl,
          });
        } else {
          setFileUploads((prev) => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });
        }
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Upload failed:", error);
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          newMap.delete(tempId);
          return newMap;
        });
      }
    };

    try {
      for (const file of filesToUpload) {
        await uploadFile(file);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [selectedFiles, code]);

  const loadMessages = async (silent: boolean = false) => {
    try {
      const response = await fetch(`/api/rooms/${code}/messages`);
      if (response.ok) {
        const data = await response.json();
        
        // Only update if there are actual changes (avoid flickering)
        setMessages(prev => {
          const newMessages = data.messages || [];
          const prevIds = new Set(prev.map(m => m.id));
          const hasNewMessages = newMessages.some((m: Message) => !prevIds.has(m.id));
          
          if (hasNewMessages || prev.length !== newMessages.length) {
            return newMessages;
          }
          return prev;
        });
        
        setUserCount(data.userCount || 1);
        
        if (data.room?.expiresAt) {
          setRoomExpiresAt(new Date(data.room.expiresAt));
        }
      }
    } catch (error) {
      if (!silent) console.error("Failed to load messages:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, type: string = "text", metadata?: any) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setPendingMessages((prev) => [...prev, {
      tempId,
      content,
      type,
      metadata,
      status: "sending",
      progress: 0,
    }]);

    const progressInterval = setInterval(() => {
      setPendingMessages((prev) => prev.map((m) => 
        m.tempId === tempId && m.status === "sending"
          ? { ...m, progress: Math.min(m.progress + Math.random() * 15, 90) }
          : m
      ));
    }, 200);

    try {
      const response = await fetch(`/api/rooms/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: localStorage.getItem("userId") || "anonymous",
          type,
          metadata,
          replyToId: replyingTo?.id || null,
        }),
      });

      clearInterval(progressInterval);

      if (response.ok) {
        const newMessage = await response.json();
        setPendingMessages((prev) => prev.map((m) => 
          m.tempId === tempId ? { ...m, status: "sent", progress: 100 } : m
        ));
        
        setTimeout(() => {
          setMessages((prev) => [...prev, newMessage]);
          setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        }, 500);
        
        setReplyingTo(null);
      } else {
        setPendingMessages((prev) => prev.map((m) => 
          m.tempId === tempId ? { ...m, status: "failed" } : m
        ));
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Failed to send message:", error);
      setPendingMessages((prev) => prev.map((m) => 
        m.tempId === tempId ? { ...m, status: "failed" } : m
      ));
    }
  };

  const handleRetryMessage = (pending: PendingMessage) => {
    setPendingMessages((prev) => prev.filter((m) => m.tempId !== pending.tempId));
    sendMessage(pending.content, pending.type, pending.metadata);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const messageToSend = currentMood ? `${currentMood} ${inputValue}` : inputValue;
    sendMessage(messageToSend);
    setInputValue("");
    setCurrentMood(null);
  };

  const insertEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const oversizedFiles = fileArray.filter(f => f.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`File too large. Max ${formatBytes(MAX_FILE_SIZE)} per file`);
      return;
    }

    setUploading(true);
    
    const uploadFile = async (file: File) => {
      const tempId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      setFileUploads((prev) => new Map(prev).set(tempId, { file, progress: 0 }));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomCode", code);

      let uploadProgress = 0;
      const progressInterval = setInterval(() => {
        uploadProgress = Math.min(uploadProgress + Math.random() * 10, 95);
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          if (newMap.has(tempId)) {
            newMap.set(tempId, { file, progress: uploadProgress });
          }
          return newMap;
        });
      }, 150);

      try {
        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        uploadProgress = 100;
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          newMap.set(tempId, { file, progress: 100 });
          return newMap;
        });

        if (response.ok) {
          const data = await response.json();
          
          await new Promise((resolve) => setTimeout(resolve, 300));
          
          setFileUploads((prev) => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });

          sendMessage(`Shared: ${data.fileName}`, data.messageType, {
            name: data.fileName,
            size: data.fileSize,
            type: data.fileType,
            url: data.fileUrl,
          });
        } else {
          setFileUploads((prev) => {
            const newMap = new Map(prev);
            newMap.delete(tempId);
            return newMap;
          });
        }
      } catch (error) {
        clearInterval(progressInterval);
        console.error("Upload failed:", error);
        setFileUploads((prev) => {
          const newMap = new Map(prev);
          newMap.delete(tempId);
          return newMap;
        });
      }
    };

    try {
      for (const file of fileArray) {
        await uploadFile(file);
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownload = (file: FileMetadata) => {
    window.open(file.url, "_blank");
  };

  const handleOpenImage = (url: string, name: string) => {
    setSelectedImage({ url, name });
  };

  const handleReact = async (messageId: string, emoji: string) => {
    try {
      await fetch(`/api/rooms/${code}/messages/${messageId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji }),
      });
      setReactions((prev) => ({
        ...prev,
        [messageId]: [...(prev[messageId] || []), emoji],
      }));
    } catch (error) {
      console.error("Failed to react:", error);
    }
  };

  const handleQuoteReply = (message: Message) => {
    setReplyingTo(message);
  };

  const handleDelete = async (messageId: string) => {
    try {
      await fetch(`/api/rooms/${code}/messages/${messageId}`, {
        method: "DELETE",
      });
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  const handlePin = async (messageId: string) => {
    setPinnedMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const handleLeave = () => {
    router.push("/");
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isExpired) {
    router.push(`/ended?code=${code}`);
    return null;
  }

  return (
    <div 
      className="flex flex-col h-screen bg-gray-100"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ChatHeader
        code={code}
        copied={copied}
        timeLeft={timeLeft}
        userCount={userCount}
        pinnedMessages={pinnedMessages}
        currentMood={currentMood}
        selectedTimer={0}
        isAnonymous={false}
        onCopyCode={copyCode}
        onLeave={handleLeave}
        onToggleSettings={() => setShowSettings(!showSettings)}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
        theme="light"
      />

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar-light">
        <div className="max-w-2xl mx-auto space-y-1">
          {messages.length === 0 && (
            <EmptyState code={code} copied={copied} onCopyCode={copyCode} />
          )}
          
          {messages.map((message, index) => {
            const isFirst = index === 0 || messages[index - 1].userId !== message.userId;
            const isLast = index === messages.length - 1 || messages[index + 1].userId !== message.userId;
            return (
              <MessageBubble
                key={message.id}
                message={message}
                isFirst={isFirst}
                isLast={isLast}
                onDownload={handleDownload}
                onOpenImage={handleOpenImage}
                onReact={handleReact}
                onQuoteReply={handleQuoteReply}
                onBurn={() => {}}
                onDelete={handleDelete}
                onPin={handlePin}
                onVote={() => {}}
                isBurned={false}
                isPinned={pinnedMessages.has(message.id)}
                blurredMessages={new Set()}
                onRevealBlur={() => {}}
                reactions={reactions}
                replyMessage={message.replyToId ? messages.find(m => m.id === message.replyToId) : null}
              />
            );
          })}
          
          {pendingMessages.map((pending) => (
            <MessageBubble
              key={pending.tempId}
              message={{
                id: pending.tempId,
                content: pending.content,
                userId: localStorage.getItem("userId") || "anonymous",
                senderName: "",
                roomId: code,
                type: pending.type as MessageType,
                metadata: pending.metadata,
                createdAt: new Date(),
                replyToId: null,
                isAnonymous: 0,
                burnAfterReading: 0,
              }}
              isFirst={true}
              isLast={true}
              onDownload={handleDownload}
              onOpenImage={handleOpenImage}
              onReact={handleReact}
              onQuoteReply={handleQuoteReply}
              onBurn={() => {}}
              onDelete={() => setPendingMessages(prev => prev.filter(m => m.tempId !== pending.tempId))}
              onPin={handlePin}
              onVote={() => {}}
              isBurned={false}
              isPinned={false}
              blurredMessages={new Set()}
              onRevealBlur={() => {}}
              reactions={{}}
              replyMessage={null}
            />
          ))}
          
          {Array.from(fileUploads.entries()).map(([tempId, upload]) => (
            <FileSendingAnimation 
              key={tempId} 
              file={upload.file} 
              progress={upload.progress}
            />
          ))}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Replying to</p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{(replyingTo.userId || "Anonymous").slice(0, 8)}</span>
                <span className="text-gray-500 ml-2">{(replyingTo.content || "file").slice(0, 30)}</span>
              </p>
            </div>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <ChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSend={handleSend}
        onKeyDown={handleKeyDown}
        showMoodPicker={showMoodPicker}
        onToggleMoodPicker={() => setShowMoodPicker(!showMoodPicker)}
        currentMood={currentMood}
        onEmojiSelect={setCurrentMood}
        onFileUpload={handleFileUpload}
        insertEmoji={insertEmoji}
      />

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white hover:bg-white/10" onClick={() => setSelectedImage(null)}>
            <X className="h-6 w-6" />
          </Button>
          <img src={selectedImage.url} alt={selectedImage.name} className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      {/* Drag and Drop Overlay */}
      {isDragging && (
        <div className="fixed inset-0 bg-indigo-500/20 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-dashed border-indigo-400">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <Paperclip className="h-8 w-8 text-indigo-500" />
              </div>
              <p className="text-xl font-semibold text-gray-700">Drop files here</p>
              <p className="text-sm text-gray-500">Release to add files to upload queue</p>
            </div>
          </div>
        </div>
      )}

      {/* File Queue */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-30 overflow-hidden">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paperclip className="h-4 w-4" />
              <span className="font-medium">{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected</span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-white hover:bg-white/20 h-8 px-3"
                onClick={() => setSelectedFiles([])}
              >
                Clear
              </Button>
              <Button 
                size="sm" 
                variant="default" 
                className="bg-white text-indigo-600 hover:bg-gray-100 h-8 px-3"
                onClick={uploadSelectedFiles}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload All'}
              </Button>
            </div>
          </div>
          <div className="max-h-48 overflow-y-auto p-2 space-y-1">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  {file.type.startsWith('image/') ? <Image className="h-4 w-4 text-indigo-500" /> :
                   file.type.startsWith('video/') ? <Video className="h-4 w-4 text-indigo-500" /> :
                   file.type.startsWith('audio/') ? <Music className="h-4 w-4 text-indigo-500" /> :
                   <FileIcon className="h-4 w-4 text-indigo-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatBytes(file.size)}</p>
                </div>
                <button 
                  onClick={() => removeSelectedFile(index)}
                  className="p-1 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
