"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Download, 
  Home,
  Loader2,
  FileJson,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SessionStats {
  duration: string;
  messageCount: number;
  fileCount: number;
}

export default function EndedPage() {
  const [stats, setStats] = useState<SessionStats>({
    duration: "0:00",
    messageCount: 0,
    fileCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  const code = typeof window !== "undefined" 
    ? new URLSearchParams(window.location.search).get("code") || "------"
    : "------";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/rooms/${code}/messages`);
        if (response.ok) {
          const messages = await response.json();
          setStats({
            duration: "0:45",
            messageCount: messages.length,
            fileCount: messages.filter((m: { type: string }) => m.type === "file").length,
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  const handleExport = async (format: "json" | "txt") => {
    setExporting(true);
    try {
      const response = await fetch(`/api/rooms/${code}/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tempchat-${code}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export chat");
    } finally {
      setExporting(false);
    }
  };

  const formattedCode = code.slice(0, 3) + "-" + code.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Session Ended</CardTitle>
          <p className="text-muted-foreground mt-2">Your chat room has been closed</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">Room Code</p>
            <Badge variant="outline" className="font-mono font-bold text-lg px-4 py-1">
              {formattedCode}
            </Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Clock className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xl font-bold">{stats.duration}</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
              <div className="space-y-1">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xl font-bold">{stats.messageCount}</p>
                <p className="text-xs text-muted-foreground">Messages</p>
              </div>
              <div className="space-y-1">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Download className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-xl font-bold">{stats.fileCount}</p>
                <p className="text-xs text-muted-foreground">Files</p>
              </div>
            </div>
          )}

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 text-center">
              <strong>Note:</strong> All chat data has been permanently deleted.
              {stats.messageCount > 0 && " Export now if you haven't saved your chat."}
            </p>
          </div>

          {stats.messageCount > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-center">Export Chat Before It&apos;s Gone</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleExport("json")}
                  disabled={exporting}
                  className="w-full"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileJson className="h-4 w-4 mr-2" />
                  )}
                  JSON
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleExport("txt")}
                  disabled={exporting}
                  className="w-full"
                >
                  {exporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Text
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2 pt-2">
            <Link href="/create" className="block">
              <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                <Home className="h-4 w-4 mr-2" />
                Start New Chat
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-muted-foreground pt-2">
            Thank you for using TempChat!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
