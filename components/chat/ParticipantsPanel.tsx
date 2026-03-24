"use client";

import { X, Crown, User, Clock, MessageSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeTime } from "@/lib/utils";

interface Participant {
  id: string;
  nickname: string;
  joinedAt: Date | string;
}

interface ParticipantsPanelProps {
  participants: Participant[];
  userCount: number;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export function ParticipantsPanel({ 
  participants, 
  userCount, 
  isOpen, 
  onClose,
  currentUserId 
}: ParticipantsPanelProps) {
  return (
    <div className={cn(
      "fixed inset-0 z-50 transition-all duration-500",
      isOpen ? "pointer-events-auto" : "pointer-events-none"
    )}>
      {/* Backdrop */}
      <div 
        className={cn(
          "absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        "absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Room Members</h2>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{userCount} Active Now</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Participants List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {participants.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <MessageSquare className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm italic">No participants yet</p>
            </div>
          ) : (
            participants.map((participant) => {
              const isMe = participant.id === currentUserId;
              return (
                <div 
                  key={participant.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-200 group",
                    isMe 
                      ? "bg-indigo-50 border-indigo-100 shadow-sm" 
                      : "bg-white border-slate-100 hover:border-slate-200 hover:shadow-md"
                  )}
                >
                  <div className="relative">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105",
                      isMe 
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600" 
                        : "bg-gradient-to-br from-slate-600 to-slate-800"
                    )}>
                      {participant.nickname.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-bold truncate",
                        isMe ? "text-indigo-900" : "text-slate-900"
                      )}>
                        {participant.nickname}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] font-black rounded uppercase tracking-tighter">You</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>Joined {formatRelativeTime(new Date(participant.joinedAt))}</span>
                    </div>
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {participant.id === 'creator' && (
                      <div className="p-1.5 rounded-lg bg-amber-50 text-amber-500" title="Room Creator">
                        <Crown className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <button 
            className="w-full py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
            onClick={() => {
              if (typeof window !== 'undefined') {
                const url = window.location.href;
                navigator.clipboard.writeText(url);
              }
            }}
          >
            <User className="h-4 w-4" />
            Invite Friends
          </button>
        </div>
      </div>
    </div>
  );
}
