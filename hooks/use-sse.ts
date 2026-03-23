"use client";

import { useEffect, useRef, useCallback } from "react";
import type { SSEEvent } from "@/types/message";
import { SSE_RECONNECT_DELAY } from "@/lib/constants";

interface UseSSEOptions {
  onEvent: (event: SSEEvent) => void;
  enabled?: boolean;
}

export function useSSE(url: string, { onEvent, enabled = true }: UseSSEOptions) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as SSEEvent;
        onEvent(data);
      } catch (e) {
        console.error("Failed to parse SSE data:", e);
      }
    };

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current?.close();
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, SSE_RECONNECT_DELAY);
    };
  }, [url, onEvent, enabled]);

  useEffect(() => {
    connect();

    return () => {
      eventSourceRef.current?.close();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);
}
