"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function JoinContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      const formattedCode = codeParam.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 6);
      const codeArray = formattedCode.split("").concat(Array(6 - formattedCode.length).fill(""));
      setCode(codeArray);
      
      setTimeout(() => {
        inputRefs.current[Math.min(formattedCode.length, 5)]?.focus();
      }, 100);
    }
  }, [searchParams]);

  const handleCodeChange = (index: number, value: string) => {
    const char = value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(-1);
    
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError("");

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z2-9]/g, "");
    const chars = pastedData.slice(0, 6).split("");
    const newCode = [...code];
    
    chars.forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    
    setCode(newCode);
    setError("");
    
    const lastFilledIndex = Math.min(chars.length, 6) - 1;
    if (lastFilledIndex >= 0) {
      inputRefs.current[Math.min(chars.length, 5)]?.focus();
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleJoin = async () => {
    const fullCode = code.join("");
    
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-character code");
      triggerShake();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const validateResponse = await fetch("/api/rooms/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: fullCode }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        setError(validateData.error || "Invalid code");
        triggerShake();
        return;
      }

      const joinResponse = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: fullCode,
          nickname: nickname || "Guest"
        }),
      });

      if (!joinResponse.ok) {
        const joinData = await joinResponse.json();
        setError(joinData.error || "Failed to join room");
        triggerShake();
        return;
      }

      const joinData = await joinResponse.json();
      localStorage.setItem("userId", joinData.userId);
      
      router.push(`/chat/${fullCode}`);
    } catch (err) {
      console.error("Join error:", err);
      setError("Failed to join room. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const fullCode = code.join("");
  const isCodeComplete = fullCode.length === 6;

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
            <CardTitle className="text-2xl">Join a Room</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Room Code
            </label>
            <div 
              className={`flex gap-2 justify-center ${shake ? "animate-pulse" : ""}`}
              onPaste={handlePaste}
            >
              {code.map((char, index) => (
                <Input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  value={char}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 text-center text-xl font-mono font-bold uppercase transition-all ${
                    shake ? "border-red-500 ring-2 ring-red-200" : ""
                  } ${char ? "bg-indigo-50 border-indigo-300" : ""}`}
                  maxLength={1}
                  autoComplete="off"
                />
              ))}
            </div>
            <p className="text-xs text-center text-gray-500">
              Type or paste the 6-character code
            </p>
          </div>

          {error && (
            <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

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

          <Button
            onClick={handleJoin}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
            disabled={loading || !isCodeComplete}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Room"
            )}
          </Button>

          {!isCodeComplete && fullCode.length > 0 && (
            <p className="text-xs text-center text-gray-400">
              Enter {6 - fullCode.length} more characters
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-950"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>}>
      <JoinContent />
    </Suspense>
  );
}
