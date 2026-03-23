"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Loader2, Users, Clock, MessageSquare, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EXPIRY_OPTIONS } from "@/lib/constants";
import { QRCodeSVG } from "qrcode.react";

function CreatePageContent() {
  const router = useRouter();
  const [step, setStep] = useState<"form" | "waiting">("form");
  const [nickname, setNickname] = useState("");
  const [expiry, setExpiry] = useState(1440);
  const [maxUsers, setMaxUsers] = useState(31);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedExpiry = EXPIRY_OPTIONS.find(opt => opt.value === expiry);
  const shareUrl = typeof window !== "undefined" && code 
    ? `${window.location.origin}/join?code=${code}`
    : "";

  const handleCreate = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: nickname || "Guest", expiryMinutes: expiry, maxUsers }),
      });

      if (!response.ok) throw new Error("Failed to create room");

      const data = await response.json();
      setCode(data.code);
      setStep("waiting");
      localStorage.setItem("userId", data.userId);
    } catch (err) {
      console.error("Create room error:", err);
      setError("Failed to create room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyShareUrl = async () => {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinNow = () => {
    router.push(`/chat/${code}`);
  };

  const adjustMaxUsers = (delta: number) => {
    setMaxUsers(prev => Math.min(31, Math.max(2, prev + delta)));
  };

  if (step === "waiting" && code) {
    const formattedCode = code.slice(0, 3) + "-" + code.slice(3);

    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">Share this code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-gray-900 text-white rounded-xl px-6 py-4">
                <span className="text-3xl font-mono font-bold tracking-wider">
                  {formattedCode}
                </span>
              </div>
              <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0 h-12 w-12">
                {copied ? (
                  <Check className="h-5 w-5 text-green-600" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>

            <Button onClick={joinNow} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg">
              Open Chat Room
            </Button>

            <div className="border-t pt-6 space-y-4">
              <p className="text-sm text-gray-500 text-center">Scan with your phone:</p>
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl border shadow-sm">
                  <QRCodeSVG
                    value={shareUrl}
                    size={180}
                    level="M"
                    includeMargin
                    bgColor="#ffffff"
                    fgColor="#1f2937"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-gray-500 text-center mb-3">Or share this link:</p>
              <div className="flex gap-2">
                <Input value={shareUrl} readOnly className="text-sm" />
                <Button variant="outline" size="icon" onClick={copyShareUrl}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-indigo-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              <span className="text-sm font-medium">Waiting for someone to join...</span>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-600">
                Share the code or link with your friends. {maxUsers - 1} more can join!
              </p>
            </div>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-gray-500">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="flex items-center text-gray-500 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div className="text-center">
            <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-7 w-7 text-indigo-600" />
            </div>
            <CardTitle className="text-2xl">Create a Room</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Name (optional)</label>
            <Input
              placeholder="Enter your name"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={50}
              className="h-12"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Room Duration</label>
            <div className="grid grid-cols-3 gap-3">
              {EXPIRY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setExpiry(option.value)}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    expiry === option.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Max Participants</label>
            <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustMaxUsers(-1)}
                disabled={maxUsers <= 2}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <span className="text-2xl font-bold text-indigo-600">{maxUsers}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => adjustMaxUsers(1)}
                disabled={maxUsers >= 31}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 text-center">
              {maxUsers - 1} friends can join you
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            onClick={handleCreate}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Room"
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>Room will expire in {selectedExpiry?.label.toLowerCase()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    }>
      <CreatePageContent />
    </Suspense>
  );
}
