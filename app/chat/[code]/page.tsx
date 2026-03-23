"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  MessageSquare, Users, Clock, Copy, Check, CheckCheck, LogOut, 
  Paperclip, Send, Loader2, FileIcon, Download, Image, Video, Music,
  X, MoreVertical, ChevronDown, Info, Smile, ExternalLink, ZoomIn, ZoomOut,
  MessageCircle, Eye, FileCode, Share2, Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Maximize, FileText, Ghost, Link2, Settings, Mic, MicOff,
  Flame, Quote, Reply, Trash2, Timer, EyeOff, Hash, CheckCircle, XCircle,
  BarChart3, Pin, PinOff, Plus, Minus, Calculator, Eye as EyeIcon, Upload,
  CalendarClock, Vote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSSE } from "@/hooks/use-sse";
import { useTimer } from "@/hooks/use-timer";
import { formatTime, formatRelativeTime, formatBytes, cn } from "@/lib/utils";
import type { Message, FileMetadata } from "@/types/message";
import { MAX_FILE_SIZE } from "@/lib/constants";

const EMOJIS = ["😀", "😂", "❤️", "👍", "🎉", "🔥", "💯", "🙌", "😍", "🤔", "🎮", "🎯", "🚀", "💪", "🌟", "✨"];

const QUICK_REACTIONS = ["😂", "❤️", "👍", "🎉", "🔥", "💯"];

function CodeBlock({ code, language, isOwn }: { code: string; language: string; isOwn: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "rounded-lg overflow-hidden text-xs my-1",
      isOwn ? "bg-indigo-600" : "bg-gray-800"
    )}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/20">
        <span className="text-gray-400 font-mono">{language}</span>
        <button onClick={copyCode} className="text-gray-400 hover:text-white transition-colors">
          {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto">
        <code className="text-gray-100 font-mono">{code}</code>
      </pre>
    </div>
  );
}

function isCodeBlock(text: string): boolean {
  return /```[\w]*\n[\s\S]*?```/g.test(text);
}

function parseMessageContent(content: string, isOwn: boolean): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  const combinedRegex = /(https?:\/\/[^\s]+)|(\b[A-Z0-9]{6}\b)|(\d+\s*[+\-*/=]\s*\d+)/g;
  
  let lastIndex = 0;
  let match;
  const segments: { start: number; end: number; type: string; content: string }[] = [];
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      let pos = 0;
      let subMatch;
      const textRegex = /(https?:\/\/[^\s]+)|(\b[A-Z0-9]{6}\b)|(\d+\s*[+\-*/=]\s*\d+)/g;
      while ((subMatch = textRegex.exec(textBefore)) !== null) {
        if (subMatch.index > pos) {
          segments.push({ start: lastIndex + pos, end: lastIndex + subMatch.index, type: 'text', content: textBefore.slice(pos, subMatch.index) });
        }
        segments.push({ start: lastIndex + subMatch.index, end: lastIndex + subMatch.index + subMatch[0].length, type: 'link', content: subMatch[0] });
        pos = subMatch.index + subMatch[0].length;
      }
      if (pos < textBefore.length) {
        segments.push({ start: lastIndex + pos, end: lastIndex + textBefore.length, type: 'text', content: textBefore.slice(pos) });
      }
    }
    segments.push({ start: match.index, end: match.index + match[0].length, type: 'code', content: match[0] });
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < content.length) {
    const textAfter = content.slice(lastIndex);
    let pos = 0;
    let subMatch;
    const textRegex = /(https?:\/\/[^\s]+)|(\b[A-Z0-9]{6}\b)|(\d+\s*[+\-*/=]\s*\d+)/g;
    while ((subMatch = textRegex.exec(textAfter)) !== null) {
      if (subMatch.index > pos) {
        segments.push({ start: lastIndex + pos, end: lastIndex + subMatch.index, type: 'text', content: textAfter.slice(pos, subMatch.index) });
      }
      segments.push({ start: lastIndex + subMatch.index, end: lastIndex + subMatch.index + subMatch[0].length, type: 'link', content: subMatch[0] });
      pos = subMatch.index + subMatch[0].length;
    }
    if (pos < textAfter.length) {
      segments.push({ start: lastIndex + pos, end: lastIndex + textAfter.length, type: 'text', content: textAfter.slice(pos) });
    }
  }
  
  if (segments.length === 0 && lastIndex === 0) {
    parts.push(<span key="text">{content}</span>);
    return parts;
  }
  
  segments.forEach((seg, i) => {
    if (seg.type === 'code') {
      const langMatch = seg.content.match(/```(\w*)/);
      const lang = langMatch?.[1] || 'plaintext';
      const code = seg.content.replace(/```\w*\n?/, '').replace(/```$/, '');
      parts.push(<CodeBlock key={`code-${i}`} code={code} language={lang} isOwn={isOwn} />);
    } else if (seg.type === 'link') {
      if (seg.content.match(/https?:\/\//)) {
        parts.push(
          <a key={`link-${i}`} href={seg.content} target="_blank" rel="noopener noreferrer" 
             className="text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-0.5">
            {seg.content.slice(0, 30)}...
            <ExternalLink className="h-3 w-3" />
          </a>
        );
      } else if (seg.content.match(/^\d+\s*[+\-*/=]\s*\d+$/)) {
        try {
          const result = Function('"use strict"; return (' + seg.content.replace(/=/, '==') + ')')();
          parts.push(
            <span key={`calc-${i}`} className="bg-indigo-100 text-indigo-700 px-1 rounded font-mono">
              {seg.content} = {result}
            </span>
          );
        } catch {
          parts.push(<span key={`text-${i}`}>{seg.content}</span>);
        }
      } else {
        parts.push(<span key={`room-${i}`} className="bg-indigo-100 text-indigo-700 px-1 rounded font-mono">{seg.content}</span>);
      }
    } else {
      parts.push(<span key={`text-${i}`}>{seg.content}</span>);
    }
  });
  
  return parts;
}

interface MessageBubbleProps {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  onDownload: (file: FileMetadata) => void;
  onOpenImage: (url: string, name: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onQuoteReply: (message: Message) => void;
  onBurn: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
  onVote: (messageId: string, optionId: string) => void;
  isBurned: boolean;
  isBlurred: boolean;
  isPinned: boolean;
  blurredMessages: Set<string>;
  onRevealBlur: (messageId: string) => void;
  reactions: Record<string, string[]>;
  replyMessage?: Message | null;
}

function MessageBubble({ message, isFirst, isLast, onDownload, onOpenImage, onReact, onQuoteReply, onBurn, onDelete, onPin, onVote, isBurned, isBlurred, isPinned, blurredMessages, onRevealBlur, reactions, replyMessage }: MessageBubbleProps) {
  const isOwn = message.userId === localStorage.getItem("userId");
  const isSystem = message.type === "system";
  const isPoll = message.type === "poll";
  const file = message.metadata as FileMetadata | null;
  const isImage = file?.type?.startsWith("image/");
  const isVideo = file?.type?.startsWith("video/");
  const isAudio = file?.type?.startsWith("audio/");
  const isBlurredHere = blurredMessages.has(message.id);
  const [showMenu, setShowMenu] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const messageReactions = reactions[message.id] || [];

  const pollOptions = message.pollOptions || [];

  const handleBurn = () => {
    setIsBurning(true);
    setTimeout(() => onBurn(message.id), 2000);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center py-3">
        <span className="text-xs text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  if (isBurned) {
    return (
      <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-900 text-gray-400",
          isOwn ? "bg-gray-700/50" : "bg-gray-200"
        )}>
          <Flame className="h-4 w-4" />
          <span className="text-sm italic">Message burned</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex gap-2 group",
      isOwn ? "flex-row-reverse" : "flex-row",
      !isFirst && "mt-1"
    )}>
      {!isOwn && isFirst && (
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-gradient-to-br from-pink-500 to-rose-500 text-white">
            {(message.userId || "AN").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!isOwn && !isFirst && <div className="w-8" />}
      
      <div className={cn("max-w-[75%] sm:max-w-[70%]", isOwn && "flex flex-col items-end")}>
        {replyMessage && (
          <div className={cn(
            "text-xs px-2 py-1 mb-1 rounded bg-opacity-50 border-l-2",
            isOwn ? "bg-indigo-900/30 border-indigo-400 text-indigo-200" : "bg-gray-100 border-gray-400 text-gray-600"
          )}>
            <span className="font-semibold">{(replyMessage.userId || "Anonymous").slice(0, 6)}:</span> {replyMessage.content.slice(0, 50)}
          </div>
        )}
        
        {isPinned && (
          <div className="flex items-center gap-1 text-xs text-amber-600 mb-1">
            <Pin className="h-3 w-3" />
            <span>Pinned</span>
          </div>
        )}
        
        <div className={cn(
          "rounded-2xl px-3 py-2 relative group/message",
          isOwn 
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-sm" 
            : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
        )}>
          {isBlurredHere && (
            <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-pointer" onClick={() => onRevealBlur(message.id)}>
              <div className="text-center">
                <EyeOff className="h-6 w-6 text-white mx-auto mb-1" />
                <span className="text-white text-sm">Click to reveal</span>
              </div>
            </div>
          )}
          
          {message.type === "voice" && file && (
            <div className="flex items-center gap-2 mb-1">
              <button className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <Play className="h-4 w-4" />
              </button>
              <div className="flex-1 h-1 rounded-full bg-white/30">
                <div className="w-1/3 h-full rounded-full bg-white" />
              </div>
            </div>
          )}
          
          {isImage && file && (
            <div className="mb-2 -mx-1 cursor-pointer" onClick={() => onOpenImage(file.url, file.name)}>
              <img src={file.url} alt={file.name} className="rounded-lg max-w-full max-h-64 object-cover" />
              <p className="text-xs mt-1 opacity-70">{file.name}</p>
            </div>
          )}
          
          {isVideo && file && (
            <div className="mb-2">
              <video src={file.url} controls className="rounded-lg max-w-full max-h-48" />
              <p className="text-xs mt-1 opacity-70">{file.name}</p>
            </div>
          )}
          
          {isAudio && file && (
            <div className="mb-2">
              <audio src={file.url} controls className="h-8 w-full" />
              <p className="text-xs mt-1 opacity-70">{file.name}</p>
            </div>
          )}
          
          {!isImage && !isVideo && !isAudio && message.type !== "voice" && (
            <p className="text-sm whitespace-pre-wrap break-words">
              {parseMessageContent(message.content, isOwn)}
            </p>
          )}
          
          {message.burnAfterReading === 1 && (
            <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1">
              <Flame className="h-3 w-3 text-white" />
            </div>
          )}
          
          {message.isAnonymous === 1 && (
            <div className="absolute -top-2 -left-2 bg-gray-500 rounded-full p-1">
              <Ghost className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        {isPoll && pollOptions.length > 0 && (
          <div className={cn("mt-1 rounded-lg p-2", isOwn ? "bg-indigo-50" : "bg-gray-50")}>
            {pollOptions.map((option: any) => (
              <button
                key={option.id}
                onClick={() => onVote(message.id, option.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg mb-1 text-sm transition-colors",
                  isOwn ? "bg-indigo-100 hover:bg-indigo-200" : "bg-white hover:bg-gray-100"
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span className="text-xs text-gray-500">{option.votes || 0}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {messageReactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {Object.entries(messageReactions.reduce((acc: Record<string, number>, r: string) => {
              acc[r] = (acc[r] || 0) + 1;
              return acc;
            }, {})).map(([emoji, count]) => (
              <span key={emoji} className="text-sm bg-gray-100 rounded-full px-2 py-0.5">
                {emoji} {count}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover/message:opacity-100 transition-opacity">
          <button onClick={() => onReact(message.id, "😂")} className="p-1 rounded hover:bg-gray-100">
            <Smile className="h-4 w-4 text-gray-500" />
          </button>
          <button onClick={() => onQuoteReply(message)} className="p-1 rounded hover:bg-gray-100">
            <Reply className="h-4 w-4 text-gray-500" />
          </button>
          {!isOwn && (
            <button onClick={() => onPin(message.id)} className="p-1 rounded hover:bg-gray-100">
              {isPinned ? <PinOff className="h-4 w-4 text-gray-500" /> : <Pin className="h-4 w-4 text-gray-500" />}
            </button>
          )}
          {!isOwn && (
            <button onClick={handleBurn} className="p-1 rounded hover:bg-red-50">
              <Flame className="h-4 w-4 text-red-500" />
            </button>
          )}
          <button onClick={() => onDelete(message.id)} className="p-1 rounded hover:bg-red-50">
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-1 rounded hover:bg-gray-100">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border p-1 z-10 min-w-[120px]">
                <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" onClick={() => { navigator.clipboard.writeText(message.content); setShowMenu(false); }}>
                  <Copy className="h-3 w-3 inline mr-2" />Copy
                </button>
                {file && (
                  <button className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 rounded" onClick={() => { onDownload(file); setShowMenu(false); }}>
                    <Download className="h-3 w-3 inline mr-2" />Download
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {isLast && (
          <div className={cn("flex items-center gap-1 text-[10px] mt-0.5", isOwn ? "text-indigo-200" : "text-gray-400")}>
            <span>{formatRelativeTime(new Date(message.createdAt))}</span>
            {isOwn && <CheckCheck className="h-3 w-3" />}
          </div>
        )}
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
  const [showFilePanel, setShowFilePanel] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [burnedMessages, setBurnedMessages] = useState<Set<string>>(new Set());
  const [blurredMessages, setBlurredMessages] = useState<Set<string>>(new Set());
  const [pinnedMessages, setPinnedMessages] = useState<Set<string>>(new Set());
  const [reactions, setReactions] = useState<Record<string, string[]>>({});
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [showBlurPicker, setShowBlurPicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [showTimeCapsule, setShowTimeCapsule] = useState(false);
  const [capsuleDate, setCapsuleDate] = useState("");
  const [showTimerPicker, setShowTimerPicker] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(0);
  const [showViewLimit, setShowViewLimit] = useState(false);
  const [selectedViewLimit, setSelectedViewLimit] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showAnonymousToggle, setShowAnonymousToggle] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { timeLeft, isExpired } = useTimer(null);

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
  }, [code]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/rooms/${code}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        setUserCount(data.userCount || 1);
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string, type: string = "text", metadata?: any) => {
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
          burnAfterReading: selectedTimer > 0 ? 1 : 0,
          expiresAt: selectedTimer > 0 ? new Date(Date.now() + selectedTimer * 1000).toISOString() : null,
          isAnonymous: isAnonymous ? 1 : 0,
          pollOptions: type === "poll" ? pollOptions.filter(o => o.trim()).map((text, i) => ({ text, votes: 0 })) : undefined,
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prev) => [...prev, newMessage]);
        setReplyingTo(null);
        setSelectedTimer(0);
        setIsAnonymous(false);
        if (type === "poll") {
          setPollQuestion("");
          setPollOptions(["", ""]);
          setShowPollCreator(false);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(inputValue);
    setInputValue("");
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
    const uploadedCount = { current: 0 };
    const totalFiles = fileArray.length;

    const uploadFile = async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("roomCode", code);

      const response = await fetch("/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedCount.current++;
        if (uploadedCount.current === totalFiles) {
          setUploading(false);
          setShowFilePanel(false);
        }
        sendMessage(`Shared: ${data.fileName}`, data.messageType, {
          name: data.fileName,
          size: data.fileSize,
          type: data.fileType,
          url: data.fileUrl,
          maxViews: selectedViewLimit,
        });
      }
      return response.ok;
    };

    try {
      if (fileArray.length === 1) {
        await uploadFile(fileArray[0]);
      } else {
        await Promise.all(fileArray.map(f => uploadFile(f)));
        setUploading(false);
        setShowFilePanel(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploading(false);
    } finally {
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

  const handleBurn = async (messageId: string) => {
    setBurnedMessages((prev) => new Set([...prev, messageId]));
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

  const handleVote = async (messageId: string, optionId: string) => {
    try {
      await fetch(`/api/rooms/${code}/messages/${messageId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionId }),
      });
      loadMessages();
    } catch (error) {
      console.error("Failed to vote:", error);
    }
  };

  const handleRevealBlur = (messageId: string) => {
    setBlurredMessages((prev) => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  const handleLeave = () => {
    router.push("/");
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center animate-pulse">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
          </div>
          <p className="text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    router.push(`/ended?code=${code}`);
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse-subtle">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900">TempChat</span>
              {currentMood && (
                <span className="text-lg" title="Your mood">{currentMood}</span>
              )}
            </div>
            <button onClick={copyCode} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 transition-colors w-fit">
              <Hash className="h-3 w-3" />
              <span className="font-mono font-bold">{code.slice(0, 3)}-{code.slice(3)}</span>
              {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all",
            timeLeft < 300 ? "bg-red-100 text-red-600 animate-pulse ring-2 ring-red-200" :
            timeLeft < 3600 ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
          )}>
            <Clock className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{formatTime(timeLeft || 86400)}</span>
            <span className="sm:hidden">{timeLeft < 3600 ? formatTime(timeLeft || 86400) : `${Math.floor(timeLeft / 3600)}h`}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
            <Users className="h-3.5 w-3.5 text-indigo-500" />
            <span className="font-medium">{userCount}</span>
            <span className="hidden sm:inline text-gray-400">online</span>
          </div>

          {pinnedMessages.size > 0 && (
            <Button variant="ghost" size="icon" className="relative bg-amber-50 hover:bg-amber-100">
              <Pin className="h-4 w-4 text-amber-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {pinnedMessages.size}
              </span>
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} className="hover:bg-purple-50">
            <Settings className="h-4 w-4 text-purple-600" />
          </Button>

          <div className="relative lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMenuOpen(!menuOpen)} className="hover:bg-gray-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border p-3 z-50 animate-in slide-in-from-top-2">
                <div className="px-3 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-2">
                  <p className="text-xs text-gray-400 font-medium">Room Code</p>
                  <p className="font-mono font-bold text-lg text-indigo-600 tracking-wider">{code}</p>
                </div>
                <div className="py-3 space-y-2">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                    <Clock className="h-4 w-4 text-orange-500" /> 
                    <span>Expires in {formatTime(timeLeft || 86400)}</span>
                  </div>
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                    <Users className="h-4 w-4 text-indigo-500" /> 
                    <span>{userCount} participant{userCount !== 1 ? "s" : ""}</span>
                  </div>
                  {selectedTimer > 0 && (
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg">
                      <Timer className="h-4 w-4" /> 
                      <span>{selectedTimer}s self-destruct</span>
                    </div>
                  )}
                  {isAnonymous && (
                    <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                      <Ghost className="h-4 w-4" /> 
                      <span>Anonymous mode</span>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-100 pt-3 mt-2">
                  <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleLeave}>
                    <LogOut className="h-4 w-4 mr-2" /> Leave Room
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-1 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-10 w-10 text-indigo-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
            <p className="text-sm text-gray-500 max-w-xs">Be the first to send a message! Share the room code with others to chat together.</p>
          </div>
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
              onBurn={handleBurn}
              onDelete={handleDelete}
              onPin={handlePin}
              onVote={handleVote}
              isBurned={burnedMessages.has(message.id)}
              isBlurred={message.isBlurred === 1}
              isPinned={pinnedMessages.has(message.id)}
              blurredMessages={blurredMessages}
              onRevealBlur={handleRevealBlur}
              reactions={reactions}
              replyMessage={message.replyToId ? messages.find(m => m.id === message.replyToId) : null}
            />
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {replyingTo && (
        <div className="px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Reply className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs text-indigo-600 font-medium">Replying to</p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{(replyingTo.userId || "Anonymous").slice(0, 8)}</span>
                <span className="text-gray-500 ml-2">{(replyingTo.content || "file").slice(0, 30)}</span>
              </p>
            </div>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-2 rounded-full hover:bg-indigo-100 text-gray-400 hover:text-indigo-600 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="bg-white border-t border-gray-100 p-3 shadow-lg">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-2xl">
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-indigo-100 hover:text-indigo-600" onClick={() => setShowFilePanel(!showFilePanel)} title="Upload files">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-indigo-100 hover:text-indigo-600" onClick={() => setShowVoiceRecorder(!showVoiceRecorder)} title="Voice message">
              {showVoiceRecorder ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-purple-100 hover:text-purple-600 relative" onClick={() => setShowMoodPicker(!showMoodPicker)} title="Set mood">
              <Smile className="h-4 w-4" />
              {currentMood && <span className="absolute -top-1 -right-1 text-sm">{currentMood}</span>}
            </Button>
            {showMoodPicker && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl border p-3 z-50 animate-in slide-in-from-bottom-2">
                <p className="text-xs text-gray-400 font-medium mb-2">How are you feeling?</p>
                <div className="grid grid-cols-8 gap-1">
                  {EMOJIS.map((emoji) => (
                    <button key={emoji} className="p-2 hover:bg-gray-100 rounded-lg text-xl transition-transform hover:scale-125" onClick={() => { setCurrentMood(emoji); setShowMoodPicker(false); }}>
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-amber-100 hover:text-amber-600" onClick={() => setShowPollCreator(!showPollCreator)} title="Create poll">
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-red-100 hover:text-red-600" onClick={() => setShowBlurPicker(!showBlurPicker)} title="Blur media">
              <EyeOff className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-orange-100 hover:text-orange-600" onClick={() => setShowTimerPicker(!showTimerPicker)} title="Self-destruct timer">
              <Timer className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-blue-100 hover:text-blue-600" onClick={() => setShowViewLimit(!showViewLimit)} title="View limit">
              <EyeIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-gray-200 hover:text-gray-700" onClick={() => setShowAnonymousToggle(!showAnonymousToggle)} title="Anonymous mode">
              <Ghost className={cn("h-4 w-4", isAnonymous && "text-purple-500")} />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-pink-100 hover:text-pink-600" onClick={() => setShowTimeCapsule(!showTimeCapsule)} title="Time capsule">
              <CalendarClock className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
            {showPollCreator && (
              <div className="mb-2 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100">
                <Input
                  placeholder="Ask a question for your poll..."
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="mb-3 bg-white border-indigo-200 focus:border-indigo-400"
                />
                <div className="space-y-2">
                  {pollOptions.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-600">
                        {index + 1}
                      </div>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updatePollOption(index, e.target.value)}
                        className="flex-1 bg-white"
                      />
                      {pollOptions.length > 2 && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => removePollOption(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={addPollOption} className="border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                    <Plus className="h-4 w-4 mr-1" /> Add Option
                  </Button>
                  <Button size="sm" onClick={() => sendMessage(pollQuestion, "poll")} disabled={!pollQuestion.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                    <Vote className="h-4 w-4 mr-1" /> Create Poll
                  </Button>
                </div>
              </div>
            )}

            {showTimeCapsule && (
              <div className="mb-2 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700 mb-2">Schedule a time capsule message</p>
                <Input
                  type="datetime-local"
                  value={capsuleDate}
                  onChange={(e) => setCapsuleDate(e.target.value)}
                  className="mb-2"
                />
                <p className="text-xs text-purple-500">Message will be revealed at the scheduled time</p>
              </div>
            )}

            {showTimerPicker && (
              <div className="mb-2 p-3 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700 mb-2">Self-destruct timer</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 5, 30, 60, 300].map((seconds) => (
                    <Button
                      key={seconds}
                      variant={selectedTimer === seconds ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setSelectedTimer(seconds); setShowTimerPicker(false); }}
                    >
                      {seconds === 0 ? "Off" : `${seconds}s`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {showViewLimit && (
              <div className="mb-2 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-700 mb-2">View limit</p>
                <div className="flex gap-2 flex-wrap">
                  {[0, 1, 5, 10].map((views) => (
                    <Button
                      key={views}
                      variant={selectedViewLimit === views ? "default" : "outline"}
                      size="sm"
                      onClick={() => { setSelectedViewLimit(views); setShowViewLimit(false); }}
                    >
                      {views === 0 ? "Unlimited" : `${views} views`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {showAnonymousToggle && (
              <div className="mb-2 p-3 bg-gray-100 rounded-lg flex items-center justify-between">
                <span className="text-sm text-gray-700">Anonymous mode</span>
                <Button
                  variant={isAnonymous ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAnonymous(!isAnonymous)}
                >
                  {isAnonymous ? "On" : "Off"}
                </Button>
              </div>
            )}

            <div className="flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 resize-none rounded-lg border p-2 min-h-[44px] max-h-32"
                rows={1}
              />
              <Button onClick={handleSend} disabled={!inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showFilePanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !uploading && setShowFilePanel(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Upload Files</h3>
              <Button variant="ghost" size="icon" onClick={() => !uploading && setShowFilePanel(false)} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
            />
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center mb-4 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => !uploading && fileInputRef.current?.click()}>
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to select files</p>
              <p className="text-xs text-gray-400 mt-1">or drag and drop</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Image className="h-4 w-4" /> Images
              </div>
              <div className="flex items-center gap-1">
                <Video className="h-4 w-4" /> Videos
              </div>
              <div className="flex items-center gap-1">
                <Music className="h-4 w-4" /> Audio
              </div>
              <div className="flex items-center gap-1">
                <FileIcon className="h-4 w-4" /> Docs
              </div>
            </div>
            <Button
              onClick={() => !uploading && fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full"
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
            <p className="text-xs text-gray-500 mt-3 text-center">
              Max {formatBytes(MAX_FILE_SIZE)} per file
            </p>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowSettings(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md p-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Settings</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowSettings(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound effects</span>
                <Button variant="outline" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
                  {soundEnabled ? "On" : "Off"}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Compact mode</span>
                <Button variant="outline" size="sm" onClick={() => setCompactMode(!compactMode)}>
                  {compactMode ? "On" : "Off"}
                </Button>
              </div>

              <div>
                <span className="text-sm block mb-2">Font size</span>
                <div className="flex gap-2">
                  {(['sm', 'md', 'lg'] as const).map((size) => (
                    <Button
                      key={size}
                      variant={fontSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFontSize(size)}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500 mb-2">Share this room</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/chat/${code}`;
                      navigator.clipboard.writeText(url);
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" /> Copy Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = `${window.location.origin}/chat/${code}`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, "_blank");
                    }}
                    className="bg-green-50 hover:bg-green-100"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                  </Button>
                </div>
              </div>

              <div className="border-t pt-4">
                <Button variant="destructive" className="w-full" onClick={handleLeave}>
                  Leave Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-white" onClick={() => setSelectedImage(null)}>
            <X className="h-6 w-6" />
          </Button>
          <img src={selectedImage.url} alt={selectedImage.name} className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}
