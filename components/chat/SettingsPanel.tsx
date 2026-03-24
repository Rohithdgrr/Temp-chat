"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Settings, Volume2, MessageSquare, FileText, Share2, Copy, MessageCircle, Sun, Moon, Type, Palette, Layout, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light" | "gradient";
type FontFamily = "sans" | "serif" | "mono";
type BubbleStyle = "rounded" | "square" | "modern";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  compactMode: boolean;
  onToggleCompact: () => void;
  fontSize: 'sm' | 'md' | 'lg';
  onFontSizeChange: (size: 'sm' | 'md' | 'lg') => void;
  roomCode: string;
  onLeave: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  fontFamily: FontFamily;
  onFontFamilyChange: (font: FontFamily) => void;
  bubbleStyle: BubbleStyle;
  onBubbleStyleChange: (style: BubbleStyle) => void;
}

export function SettingsPanel({
  open,
  onClose,
  soundEnabled,
  onToggleSound,
  compactMode,
  onToggleCompact,
  fontSize,
  onFontSizeChange,
  roomCode,
  onLeave,
  theme,
  onThemeChange,
  fontFamily,
  onFontFamilyChange,
  bubbleStyle,
  onBubbleStyleChange,
}: SettingsPanelProps) {
  if (!open) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/chat/${roomCode}` : '';

  const themes: { value: Theme; label: string; icon: typeof Sun; preview: string }[] = [
    { value: "dark", label: "Dark", icon: Moon, preview: "bg-slate-900" },
    { value: "gradient", label: "Gradient", icon: Palette, preview: "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" },
    { value: "light", label: "Light", icon: Sun, preview: "bg-gray-100" },
  ];

  const fonts: { value: FontFamily; label: string; sample: string }[] = [
    { value: "sans", label: "Sans", sample: "Aa" },
    { value: "serif", label: "Serif", sample: "Aa" },
    { value: "mono", label: "Mono", sample: "Aa" },
  ];

  const bubbleStyles: { value: BubbleStyle; label: string; description: string }[] = [
    { value: "rounded", label: "Rounded", description: "Soft, friendly edges" },
    { value: "modern", label: "Modern", description: "Clean, contemporary look" },
    { value: "square", label: "Square", description: "Bold, structured design" },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl w-full max-w-md p-5 max-h-[85vh] overflow-y-auto border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            Settings
          </h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="hover:bg-white/10 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Theme Section */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-indigo-400" />
              <span className="text-sm text-white/80 font-medium">Theme</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => onThemeChange(t.value)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-xl transition-all",
                    theme === t.value ? "bg-indigo-500/30 border-2 border-indigo-500" : "bg-white/5 border-2 border-transparent hover:border-white/20"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", t.preview)}>
                    {theme === t.value && <Check className="h-5 w-5 text-white" />}
                  </div>
                  <span className="text-xs text-white/80">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Family */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Type className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white/80 font-medium">Font Style</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {fonts.map((f) => (
                <button
                  key={f.value}
                  onClick={() => onFontFamilyChange(f.value)}
                  className={cn(
                    "p-3 rounded-xl transition-all text-center",
                    fontFamily === f.value ? "bg-purple-500/30 border-2 border-purple-500" : "bg-white/5 border-2 border-transparent hover:border-white/20"
                  )}
                >
                  <span className={cn(
                    "text-xl font-bold text-white block mb-1",
                    f.value === "serif" && "font-serif",
                    f.value === "mono" && "font-mono"
                  )}>{f.sample}</span>
                  <span className="text-xs text-white/60">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bubble Style */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Layout className="h-4 w-4 text-pink-400" />
              <span className="text-sm text-white/80 font-medium">Bubble Style</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {bubbleStyles.map((b) => (
                <button
                  key={b.value}
                  onClick={() => onBubbleStyleChange(b.value)}
                  className={cn(
                    "p-3 rounded-xl transition-all text-center",
                    bubbleStyle === b.value ? "bg-pink-500/30 border-2 border-pink-500" : "bg-white/5 border-2 border-transparent hover:border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-8 mx-auto mb-2",
                    b.value === "rounded" && "rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500",
                    b.value === "modern" && "rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500",
                    b.value === "square" && "rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500"
                  )} />
                  <span className="text-xs text-white/80 block">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-white/80 font-medium">Font Size</span>
            </div>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg'] as const).map((size) => (
                <Button
                  key={size}
                  variant={fontSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => onFontSizeChange(size)}
                  className={cn(
                    "flex-1",
                    fontSize === size ? "bg-gradient-to-r from-amber-500 to-orange-500" : "border-white/20 text-white/80 hover:bg-white/10"
                  )}
                >
                  <span className={cn(size === 'sm' && "text-xs", size === 'md' && "text-sm", size === 'lg' && "text-base")}>
                    {size === 'sm' ? 'Small' : size === 'md' ? 'Medium' : 'Large'}
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-sm text-white/80 flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-indigo-400" />
              Sound effects
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleSound}
              className={soundEnabled ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300" : "border-white/20 text-white/60"}
            >
              {soundEnabled ? "On" : "Off"}
            </Button>
          </div>

          {/* Compact Mode */}
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="text-sm text-white/80 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-400" />
              Compact mode
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onToggleCompact}
              className={compactMode ? "bg-purple-500/20 border-purple-500/50 text-purple-300" : "border-white/20 text-white/60"}
            >
              {compactMode ? "On" : "Off"}
            </Button>
          </div>

          {/* Share Section */}
          <div className="border-t border-white/10 pt-4">
            <p className="text-sm text-white/60 mb-3 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-indigo-400" />
              Share this room
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(shareUrl)}
                className="flex-1 border-white/20 text-white/80 hover:bg-white/10"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`, "_blank")}
                className="flex-1 bg-green-500/20 border-green-500/50 hover:bg-green-500/30 text-green-300"
              >
                <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
              </Button>
            </div>
          </div>

          {/* Leave Room */}
          <div className="border-t border-white/10 pt-4">
            <Button 
              variant="destructive" 
              className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600" 
              onClick={onLeave}
            >
              Leave Room
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
