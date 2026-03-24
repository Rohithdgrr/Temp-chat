"use client";

import { MessageSquare, Users, Clock, Copy, CheckCheck, Settings, MoreVertical, Pin, Hash, LogOut, Timer, Ghost, X, Crown, User, Shield } from "lucide-react";
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
  onToggleParticipants: () => void;
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
  onToggleParticipants,
  onToggleMenu,
  menuOpen,
  theme = 'light',
}: ChatHeaderProps) {
  const isLight = theme === 'light';
  
  const headerBg = isLight 
    ? "bg-white/80"
    : theme === 'gradient'
    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"
    : "bg-slate-800";
  
  return (
    <header className={cn(
      "sticky top-0 z-40 w-full backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300",
      headerBg
    )}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Logo & Status */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-200/50">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="text-sm sm:text-lg font-bold text-slate-900 truncate leading-none">
                {code}
              </h1>
              <button 
                onClick={onCopyCode}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors flex-shrink-0"
              >
                {copied ? (
                  <CheckCheck className="h-3 w-3 text-emerald-500" />
                ) : (
                  <Copy className="h-3 w-3 text-slate-400" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-600 truncate">Encrypted</span>
            </div>
          </div>
        </div>

        {/* Center Section: Participants */}
        <button 
          onClick={onToggleParticipants}
          className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all active:scale-95 group flex-shrink-0"
        >
          <div className="relative">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          </div>
          <span className="text-[11px] sm:text-sm font-bold text-slate-700">{userCount}</span>
          <span className="hidden xs:inline text-[10px] sm:text-xs text-slate-500 font-medium">Online</span>
        </button>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50/50 border border-indigo-100">
            <Clock className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-bold text-indigo-600 font-mono tracking-tight">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <button 
            onClick={onToggleSettings}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all active:scale-95 border border-transparent hover:border-slate-200"
            title="Room Settings"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          
          <button 
            onClick={onLeave}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95 border border-transparent hover:border-rose-100"
            title="Leave Room"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile Timer Bar */}
      <div className="sm:hidden w-full bg-indigo-50/30 border-t border-indigo-100/50 py-1 px-4 flex items-center justify-center gap-2">
        <Clock className="h-3 w-3 text-indigo-500" />
        <span className="text-[10px] font-bold text-indigo-600 font-mono">
          Expires in {formatTime(timeLeft)}
        </span>
      </div>
    </header>
  );
}
