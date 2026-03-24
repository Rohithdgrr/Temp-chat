"use client";

import { MessageSquare, Users, Clock, Copy, CheckCheck, Settings, MoreVertical, Pin, Hash, LogOut, Timer, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatTime, cn } from "@/lib/utils";

interface ChatHeaderProps {
  code: string;
  copied: boolean;
  timeLeft: number;
  userCount: number;
  pinnedMessages: Set<string>;
  currentMood: string | null;
  selectedTimer: number;
  isAnonymous: boolean;
  onCopyCode: () => void;
  onLeave: () => void;
  onToggleSettings: () => void;
  onToggleMenu: () => void;
  menuOpen: boolean;
  theme?: 'dark' | 'light' | 'gradient';
}

export function ChatHeader({
  code,
  copied,
  timeLeft,
  userCount,
  pinnedMessages,
  currentMood,
  selectedTimer,
  isAnonymous,
  onCopyCode,
  onLeave,
  onToggleSettings,
  onToggleMenu,
  menuOpen,
  theme = 'light',
}: ChatHeaderProps) {
  const isLight = theme === 'light';
  
  const headerBg = isLight 
    ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
    : theme === 'gradient'
    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
    : "bg-slate-800";
  
  const textColor = "text-white";
  const mutedTextColor = "text-white/80";

  return (
    <header className={`${headerBg} px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-lg`}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-lg flex items-center justify-center shadow-lg border border-white/20">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-white tracking-wide">TempChat</span>
            {currentMood && (
              <span className="text-lg animate-bounce" title="Your mood">{currentMood}</span>
            )}
          </div>
          <button onClick={onCopyCode} className="flex items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors w-fit group">
            <Hash className="h-3 w-3" />
            <span className="font-mono font-bold tracking-wider">{code.slice(0, 3)}-{code.slice(3)}</span>
            {copied ? (
              <CheckCheck className="h-3.5 w-3.5 text-green-300" />
            ) : (
              <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all backdrop-blur-lg",
          timeLeft < 300 ? "bg-red-500/80 text-white animate-pulse shadow-lg shadow-red-500/50" :
          timeLeft < 3600 ? "bg-orange-500/80 text-white" : "bg-white/20 text-white backdrop-blur"
        )}>
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{formatTime(timeLeft || 86400)}</span>
          <span className="sm:hidden">{timeLeft < 3600 ? formatTime(timeLeft || 86400) : `${Math.floor(timeLeft / 3600)}h`}</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white bg-white/10 backdrop-blur px-3 py-1.5 rounded-full border border-white/20">
          <div className="relative">
            <Users className="h-3.5 w-3.5 text-indigo-200" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
          <span className="font-medium">{userCount}</span>
          <span className="hidden sm:inline text-white/60">online</span>
        </div>

        {pinnedMessages.size > 0 && (
          <Button variant="ghost" size="icon" className="relative bg-amber-500/80 hover:bg-amber-500 text-white backdrop-blur">
            <Pin className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-amber-600 text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg">
              {pinnedMessages.size}
            </span>
          </Button>
        )}

        <Button variant="ghost" size="icon" onClick={onToggleSettings} className="hover:bg-white/20 text-white backdrop-blur">
          <Settings className="h-4 w-4" />
        </Button>

        <div className="relative lg:hidden">
          <Button variant="ghost" size="icon" onClick={onToggleMenu} className="hover:bg-white/20 text-white backdrop-blur">
            <MoreVertical className="h-4 w-4" />
          </Button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 z-50 animate-in slide-in-from-top-2">
              <div className="px-3 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl mb-2">
                <p className="text-xs text-gray-500 font-medium">Room Code</p>
                <p className="font-mono font-bold text-lg text-indigo-600 tracking-wider">{code}</p>
              </div>
              <div className="py-3 space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-500" /> 
                  <span>Expires in {formatTime(timeLeft || 86400)}</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg">
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
                  <div className="flex items-center gap-3 px-3 py-2 text-sm text-purple-600 bg-purple-50 rounded-lg">
                    <Ghost className="h-4 w-4" /> 
                    <span>Anonymous mode</span>
                  </div>
                )}
              </div>
              <div className="border-t border-gray-100 pt-3 mt-2">
                <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onLeave}>
                  <LogOut className="h-4 w-4 mr-2" /> Leave Room
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
