"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

type ToastVariant = "default" | "destructive" | "success";

interface ToastItem {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextType {
  toast: (props: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

export function Toaster() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = useCallback(({ title, description, variant = "default" }: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProvider>
        {toasts.map(({ id, title, description, variant }) => (
          <Toast key={id} variant={variant} onOpenChange={(open) => !open && removeToast(id)}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </ToastProvider>
    </ToastContext.Provider>
  );
}
