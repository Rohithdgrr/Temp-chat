"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { Message } from "@/types/message";
import type { UserPresence } from "@/types/user";
import { useSSE } from "./use-sse";

interface UseChatOptions {
  roomCode: string;
  userId: string;
  onMessage?: (message: Message) => void;
}

export function useChat({ roomCode, userId, onMessage }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isConnected, setIsConnected] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSSEEvent = useCallback((event: { type: string; [key: string]: unknown }) => {
    switch (event.type) {
      case "connected":
        setIsConnected(true);
        break;
      case "message:new":
        const newMessage = event.message as Message;
        if (newMessage.userId !== userId) {
          setMessages((prev) => [...prev, newMessage]);
          onMessage?.(newMessage);
        }
        break;
      case "user:joined":
        const joinedUser = event.user as { id: string; nickname: string };
        setUsers((prev) => {
          if (prev.some((u) => u.id === joinedUser.id)) return prev;
          return [...prev, { ...joinedUser, isTyping: false }];
        });
        break;
      case "user:left":
        const leftUserId = event.userId as string;
        setUsers((prev) => prev.filter((u) => u.id !== leftUserId));
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(leftUserId);
          return next;
        });
        break;
      case "typing:start":
        const typingUser = event as unknown as { userId: string; nickname: string };
        if (typingUser.userId !== userId) {
          setTypingUsers((prev) => new Set(prev).add(typingUser.userId));
        }
        break;
      case "typing:stop":
        const stopTypingUserId = event.userId as string;
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(stopTypingUserId);
          return next;
        });
        break;
      case "room:expire":
        break;
    }
  }, [userId, onMessage]);

  useSSE(`/api/rooms/${roomCode}/stream`, { onEvent: handleSSEEvent });

  const sendMessage = useCallback(async (content: string) => {
    const response = await fetch(`/api/rooms/${roomCode}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message");
    }

    const newMessage = await response.json();
    setMessages((prev) => [...prev, newMessage]);
  }, [roomCode, userId]);

  const sendTyping = useCallback(async (isTyping: boolean) => {
    await fetch(`/api/rooms/${roomCode}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isTyping }),
    });
  }, [roomCode, userId]);

  const startTyping = useCallback(() => {
    sendTyping(true);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
    }, 3000);
  }, [sendTyping]);

  const stopTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping(false);
  }, [sendTyping]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages,
    users,
    typingUsers,
    isConnected,
    sendMessage,
    startTyping,
    stopTyping,
  };
}
