"use client";

import { useState, useCallback } from "react";
import { Download, FileJson, FileText, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

interface ExportDialogProps {
  roomCode: string;
  messageCount: number;
}

type ExportFormat = "json" | "txt";

export function ExportDialog({ roomCode, messageCount }: ExportDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("json");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch(`/api/rooms/${roomCode}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tempchat-${roomCode}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export chat. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [roomCode, format]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Chat</DialogTitle>
          <DialogDescription>
            Download your chat history before the room expires.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="text-sm text-muted-foreground">
            {messageCount} message{messageCount !== 1 ? "s" : ""} to export
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormat("json")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                format === "json"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileJson className="h-6 w-6 mb-2 text-indigo-600" />
              <div className="font-medium">JSON</div>
              <div className="text-xs text-gray-500">Machine readable</div>
            </button>

            <button
              onClick={() => setFormat("txt")}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                format === "txt"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileText className="h-6 w-6 mb-2 text-indigo-600" />
              <div className="font-medium">Text</div>
              <div className="text-xs text-gray-500">Human readable</div>
            </button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : success ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Done!
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
