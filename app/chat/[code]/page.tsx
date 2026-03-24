"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, X, Loader2, Check, Image, Video, Music, FileIcon, Paperclip, Download, Play, ExternalLink } from "lucide-react";
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
  ParticipantsPanel,
  SettingsPanel,
} from "@/components/chat";

interface PendingMessage {
  tempId: string;
  content: string;
  type: string;
  metadata?: any;
  status: "sending" | "sent" | "failed";
  progress: number;
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
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm animate-in slide-in-from-bottom-2 fade-in mx-4 mb-2">
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
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<{ id: string; nickname: string; joinedAt: Date }[]>([]);
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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [roomExpiresAt, setRoomExpiresAt] = useState<Date | null>(null);
  const { timeLeft, isExpired } = useTimer(roomExpiresAt);

  const copyCode = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const loadMessages = async (silent: boolean = false) => {
    try {
      const response = await fetch(`/api/rooms/${code}/messages`);
      if (response.ok) {
        const data = await response.json();
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
        if (data.participants) setParticipants(data.participants);
        if (data.room?.expiresAt) setRoomExpiresAt(new Date(data.room.expiresAt));
      }
    } catch (error) {
      if (!silent) console.error("Failed to load messages:", error);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem("userId")) {
      localStorage.setItem("userId", Math.random().toString(36).substring(2, 10));
    }
    loadMessages();
    const pollInterval = setInterval(() => loadMessages(true), 3000);
    return () => clearInterval(pollInterval);
  }, [code]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingMessages, fileUploads]);

  const sendMessage = async (content: string, type: string = "text", metadata?: any) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setPendingMessages((prev) => [...prev, { tempId, content, type, metadata, status: "sending", progress: 0 }]);

    try {
      const response = await fetch(`/api/rooms/${code}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          userId: typeof window !== 'undefined' ? localStorage.getItem("userId") : "anonymous",
          type,
          metadata,
          replyToId: replyingTo?.id || null,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setPendingMessages((prev) => prev.filter((m) => m.tempId !== tempId));
        setReplyingTo(null);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
    setCurrentMood(null);
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
    for (const file of fileArray) {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is too large. Max ${formatBytes(MAX_FILE_SIZE)}`);
        continue;
      }
      const tempId = `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setFileUploads((prev) => new Map(prev).set(tempId, { file, progress: 0 }));
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomCode", code);
      try {
        const response = await fetch("/api/files/upload", { method: "POST", body: formData });
        if (response.ok) {
          const data = await response.json();
          sendMessage(`Shared: ${data.fileName}`, data.messageType, {
            name: data.fileName, size: data.fileSize, type: data.fileType, url: data.fileUrl,
          });
        }
      } catch (err) { console.error(err); }
      setFileUploads((prev) => { const n = new Map(prev); n.delete(tempId); return n; });
    }
  };

  const handleReact = (id: string, emoji: string) => {};
  const handleQuoteReply = (m: Message) => setReplyingTo(m);
  const handleBurn = (id: string) => {};
  const handleDelete = (id: string) => {};
  const handlePin = (id: string) => {};
  const handleVote = (id: string, opt: string) => {};
  const handleDownload = (f: FileMetadata) => window.open(f.url, "_blank");
  const handleLeave = () => router.push("/");

  if (isLoading) return <LoadingState />;
  if (isExpired) { router.push(`/ended?code=${code}`); return null; }

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden">
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
        onToggleParticipants={() => setShowParticipants(true)}
        onToggleMenu={() => setMenuOpen(!menuOpen)}
        menuOpen={menuOpen}
        theme="light"
      />

      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar scroll-smooth">
        <div className="max-w-2xl mx-auto w-full py-4 sm:py-6">
          {messages.length === 0 && <EmptyState code={code} copied={copied} onCopyCode={copyCode} />}
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isFirst={index === 0 || messages[index - 1].userId !== message.userId}
              isLast={index === messages.length - 1 || messages[index + 1].userId !== message.userId}
              onDownload={handleDownload}
              onOpenImage={(url, name) => setSelectedImage({ url, name })}
              onReact={handleReact}
              onQuoteReply={handleQuoteReply}
              onBurn={handleBurn}
              onDelete={handleDelete}
              onPin={handlePin}
              onVote={handleVote}
              isBurned={false}
              isPinned={pinnedMessages.has(message.id)}
              blurredMessages={new Set()}
              onRevealBlur={() => {}}
              reactions={reactions}
              replyMessage={message.replyToId ? messages.find(m => m.id === message.replyToId) : null}
            />
          ))}
          {Array.from(fileUploads.entries()).map(([id, u]) => <FileSendingAnimation key={id} file={u.file} progress={u.progress} />)}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-white border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><MessageSquare className="h-4 w-4 text-indigo-500" /></div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Replying to</p>
              <p className="text-sm text-gray-700 truncate max-w-[200px]">{replyingTo.content}</p>
            </div>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-2 text-gray-400"><X className="h-4 w-4" /></button>
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
        insertEmoji={(e) => setInputValue(prev => prev + e)}
      />

      <ParticipantsPanel
        participants={participants}
        userCount={userCount}
        isOpen={showParticipants}
        onClose={() => setShowParticipants(false)}
        currentUserId={typeof window !== 'undefined' ? localStorage.getItem("userId") || undefined : undefined}
      />

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={false}
        onToggleSound={() => {}}
        compactMode={false}
        onToggleCompact={() => {}}
        fontSize="md"
        onFontSizeChange={() => {}}
        roomCode={code}
        onLeave={handleLeave}
        theme="light"
        onThemeChange={() => {}}
        fontFamily="sans"
        onFontFamilyChange={() => {}}
        bubbleStyle="rounded"
        onBubbleStyleChange={() => {}}
      />

      {/* File Preview Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = selectedImage.url;
                link.download = selectedImage.name;
                link.click();
              }}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={() => window.open(selectedImage.url, '_blank')}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ExternalLink className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelectedImage(null)}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {selectedImage.url.match(/\.(mp4|webm|ogg|mov|avi)(\?|$)/i) ? (
              <video
                src={selectedImage.url}
                controls
                autoPlay
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
              />
            ) : selectedImage.url.match(/\.(pdf)(\?|$)/i) ? (
              <iframe
                src={selectedImage.url}
                className="w-[90vw] h-[85vh] rounded-lg bg-white"
                title={selectedImage.name}
              />
            ) : selectedImage.url.match(/\.(txt|md|js|ts|tsx|jsx|py|java|c|cpp|html|css|json)(\?|$)/i) ? (
              <div className="bg-slate-900 rounded-xl p-6 max-w-4xl max-h-[85vh] overflow-auto">
                <pre className="text-slate-100 text-sm font-mono whitespace-pre-wrap">
                  <code>Loading...</code>
                </pre>
              </div>
            ) : (
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain"
              />
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
            {selectedImage.name}
          </div>
        </div>
      )}
    </div>
  );
}
