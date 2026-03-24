"use client";

import { useState, useRef } from "react";
import { Send, Smile, X, Paperclip, Image, Video, Music, FileIcon, Copy, CheckCheck, Play, Loader2, Code, Eye, MessageSquare, Cat, Heart, Hand, Apple, Sun, Package, Sparkles, Sticker } from "lucide-react";
import { cn } from "@/lib/utils";
// Emoji categories for organized picker
const EMOJI_CATEGORIES = {
  faces: {
    icon: Smile,
    label: "Faces",
    emojis: [
      "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😇", "😍", "🤩",
      "😘", "😗", "😚", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗",
      "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒",
      "🙄", "😬", "😮‍💨", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷",
      "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯",
      "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹️", "😮",
      "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢",
      "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "🥱", "😤",
      "😡", "😠", "🤬", "😈", "👿", "💀", "☠️", "💩", "🤡", "👹",
      "👺", "👻", "👽", "👾", "🤖", "😺", "😸", "😹", "😻", "😼",
      "😽", "🙀", "😿", "😾"
    ]
  },
  animals: {
    icon: Cat,
    label: "Animals",
    emojis: [
      "🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨",
      "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒",
      "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇",
      "🐺", "🐗", "🐴", "🦄", "🐝", "🪱", "🦋", "🐌", "🐞", "🐜",
      "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️", "🕸️", "🦂", "🐢", "🐍",
      "🦎", "🦖", "🦕", "🐙", "🦑", "🦐", "🦞", "🦀", "🐡", "🐠",
      "🐟", "🐬", "🐳", "🐋", "🦈", "🐊", "🐅", "🐆", "🦓", "🦍",
      "🦧", "🦣", "🐘", "🦛", "🦏", "🐪", "🐫", "🦒", "🦘", "🦬",
      "🐃", "🐂", "🐄", "🐎", "🐖", "🐏", "🐑", "🦙", "🐐", "🦌",
      "🐕", "🐩", "🦮", "🐈", "🐓", "🦃", "🦤", "🦚", "🦜", "🦢",
      "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡", "🦫", "🦦", "🦥", "🐁",
      "🐀", "🐿️", "🦔"
    ]
  },
  hearts: {
    icon: Heart,
    label: "Hearts",
    emojis: [
      "💋", "💌", "💘", "💝", "💖", "💗", "💓", "💞", "💕", "💟",
      "❣️", "💔", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤",
      "🤍", "💯", "❤️‍🔥", "🫶", "❣️", "💕"
    ]
  },
  hands: {
    icon: Hand,
    label: "Hands",
    emojis: [
      "👋", "🤚", "🖐️", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
      "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
      "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
      "🙏", "✍️", "💅", "🤳", "💪"
    ]
  },
  food: {
    icon: Apple,
    label: "Food",
    emojis: [
      "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈",
      "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦",
      "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔",
      "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈",
      "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟",
      "🍕", "🫓", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘",
      "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪",
      "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧",
      "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫",
      "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "🫖", "☕",
      "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃",
      "🍸", "🍹", "🧉", "🍾", "🧊"
    ]
  },
  nature: {
    icon: Sun,
    label: "Nature",
    emojis: [
      "🌵", "🌲", "🌳", "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋",
      "🍃", "🍂", "🍁", "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺",
      "🌸", "🌼", "🌻", "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖",
      "🌗", "🌘", "🌑", "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏",
      "🪐", "💫", "⭐", "🌟", "✨", "💥", "💢", "💦", "💧", "🔥",
      "🌪", "🌈", "☀️", "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️",
      "🌩️", "🌨️", "❄️", "☃️", "⛄", "🌬️", "💨", "🌪", "🌫️", "🌁",
      "🌊"
    ]
  },
  objects: {
    icon: Package,
    label: "Objects",
    emojis: [
      "🔥", "⭐", "🌟", "✨", "💫", "🎉", "🎊", "🎈", "🎁", "🎀",
      "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎗️", "🎪", "🎭", "🎨",
      "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺", "🎸", "🪘",
      "🎻", "🎲", "🧩", "♟️", "🎯", "🎳", "🎮", "🕹️", "🎰", "🚀",
      "✈️", "🛩️", "🛸", "🚁", "🚂", "🚗", "🚙", "🏎️", "🚓", "🚑",
      "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️", "🛵", "🚲", "🛴",
      "🛹", "🚏", "🛤", "🛣", "⛽", "🚧", "🚦", "🏠", "🏡", "🏢",
      "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "🏭",
      "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "⛩️", "🕌", "🕍", "⛲",
      "⛺", "🌉", "🌃", "🌄", "🌅", "🌠", "🎇", "🎆", "🌌", "🌁",
      "💴", "💵", "💶", "💷", "💰", "💳", "💎", "⚖️"
    ]
  }
};

// Indian Instagram Meme Stickers (popular reactions)
const MEME_STICKERS = [
  { id: 1, emoji: "😂", label: "Haha" },
  { id: 2, emoji: "🤣", label: "ROFL" },
  { id: 3, emoji: "😭", label: "Crying" },
  { id: 4, emoji: "💀", label: "Dead" },
  { id: 5, emoji: "😱", label: "Shocked" },
  { id: 6, emoji: "🤡", label: "Clown" },
  { id: 7, emoji: "😤", label: "Angry" },
  { id: 8, emoji: "🥵", label: "Hot" },
  { id: 9, emoji: "🥶", label: "Cold" },
  { id: 10, emoji: "🤯", label: "Mind Blown" },
  { id: 11, emoji: "🫠", label: "Melting" },
  { id: 12, emoji: "💀", label: "Skull" },
  { id: 13, emoji: "👁️👄👁️", label: "Staring" },
  { id: 14, emoji: "🧠⚡", label: "Idea" },
  { id: 15, emoji: "🔥", label: "Fire" },
  { id: 16, emoji: "💯", label: "100%" },
  { id: 17, emoji: "✨", label: "Sparkle" },
  { id: 18, emoji: "💅", label: "Slay" },
  { id: 19, emoji: "🙄", label: "Eye Roll" },
  { id: 20, emoji: "🤨", label: "Sus" },
  { id: 21, emoji: "😏", label: "Smirk" },
  { id: 22, emoji: "🥺", label: "Puppy Eyes" },
  { id: 23, emoji: "😤", label: "Huff" },
  { id: 24, emoji: "🤪", label: "Crazy" },
  { id: 25, emoji: "🫢", label: "Gasp" },
  { id: 26, emoji: "🤭", label: "Giggle" },
  { id: 27, emoji: "🫣", label: "Peek" },
  { id: 28, emoji: "🤓", label: "Nerd" },
  { id: 29, emoji: "😎", label: "Cool" },
  { id: 30, emoji: "🥳", label: "Party" },
  // Popular Indian meme text combinations
  { id: 31, emoji: "😂😂😂", label: "Triple HAHA" },
  { id: 32, emoji: "😭😭😭", label: "Triple Cry" },
  { id: 33, emoji: "💀💀💀", label: "Triple Dead" },
  { id: 34, emoji: "🔥🔥🔥", label: "Triple Fire" },
  { id: 35, emoji: "❤️", label: "Love" },
  { id: 36, emoji: "💔", label: "Heartbreak" },
  { id: 37, emoji: "🧡🤍💚", label: "Indian Flag" },
  { id: 38, emoji: "🙏", label: "Namaste" },
  { id: 39, emoji: "🙌", label: "Celebrate" },
  { id: 40, emoji: "👊", label: "Bro Fist" }
];
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function PreviewCodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setRunning(true);
    setOutput(null);
    setError(null);
    
    try {
      const logs: string[] = [];
      const customConsole = {
        log: (...args: unknown[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        error: (...args: unknown[]) => logs.push('Error: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        warn: (...args: unknown[]) => logs.push('Warn: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
        info: (...args: unknown[]) => logs.push('Info: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      };

      const fn = new Function('console', code);
      fn(customConsole);
      
      setTimeout(() => {
        if (logs.length > 0) {
          setOutput(logs.join('\n'));
        } else {
          setOutput('(No output)');
        }
        setRunning(false);
      }, 100);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setRunning(false);
    }
  };

  const canRun = ['js', 'javascript', 'ts', 'typescript', 'json', 'node'].includes(language.toLowerCase());

  return (
    <div className="rounded-lg overflow-hidden my-2 bg-gray-900 border border-gray-700">
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-mono text-[10px] uppercase font-semibold">{language}</span>
          {canRun && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-green-600 hover:bg-green-500 text-white transition-colors disabled:opacity-50"
            >
              {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
              Run
            </button>
          )}
        </div>
        <button onClick={handleCopy} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
          {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="text-[10px]">{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-3 overflow-x-auto max-h-48 overflow-y-auto">
        <code className="text-gray-100 font-mono text-[11px] leading-relaxed">{code}</code>
      </pre>
      {(output !== null || error !== null) && (
        <div className="px-3 pb-3">
          {error ? (
            <div className="bg-red-900/30 border border-red-700 rounded p-2 text-red-300 text-xs font-mono">
              <div className="font-semibold mb-1">Error:</div>
              <pre className="whitespace-pre-wrap">{error}</pre>
            </div>
          ) : (
            <div className="bg-gray-800 border border-gray-700 rounded p-2 text-green-400 text-xs font-mono">
              <div className="font-semibold mb-1 text-gray-400">Output:</div>
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ChatInputProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  showMoodPicker: boolean;
  onToggleMoodPicker: () => void;
  currentMood: string | null;
  onEmojiSelect: (emoji: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  insertEmoji: (emoji: string) => void;
}

export function ChatInput({
  inputValue,
  onInputChange,
  onSend,
  onKeyDown,
  showMoodPicker,
  onToggleMoodPicker,
  currentMood,
  onEmojiSelect,
  onFileUpload,
  insertEmoji,
}: ChatInputProps) {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState<keyof typeof EMOJI_CATEGORIES>('faces');
  const [showStickers, setShowStickers] = useState(false);
  const [emojiSearch, setEmojiSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);

  const markdownPatterns = [
    /^#{1,6}\s/m,
    /\*\*[\s\S]+?\*\*/,
    /__[\s\S]+?__/,
    /\*[\s\S]+?\*/,
    /_[\s\S]+?_(?!\w)/,
    /~~[\s\S]+?~~/,
    /`[^`]+`/,
    /```[\s\S]+?```/,
    /^\s*[-*+]\s/m,
    /^\s*\d+\.\s/m,
    />\s/m,
    /\[.+\]\(.+\)/,
    /!\[.+\]\(.+\)/,
    /\|.+\|/,
  ];

  const codePattern = /```(\w*)\n?([\s\S]*?)```|`[^`]+`/;
  const hasCode = (text: string): boolean => codePattern.test(text);

  const hasMarkdown = (text: string): boolean => {
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  // Calculate dynamic height based on content
  const getTextAreaHeight = (text: string) => {
    const lineCount = (text.match(/\n/g) || []).length + 1;
    const charCount = text.length;
    
    if (hasCode(text)) {
      return "min-h-[120px] sm:min-h-[160px] max-h-64 sm:max-h-80";
    }
    if (lineCount > 3 || charCount > 200) {
      return "min-h-[80px] sm:min-h-[100px] max-h-48 sm:max-h-64";
    }
    if (lineCount > 1 || charCount > 100) {
      return "min-h-[60px] sm:min-h-[80px] max-h-32 sm:max-h-40";
    }
    return "min-h-[36px] sm:min-h-[40px] max-h-32 sm:max-h-40";
  };

  const getTextAreaRows = (text: string) => {
    const lineCount = (text.match(/\n/g) || []).length + 1;
    if (hasCode(text)) return 6;
    if (lineCount > 3) return 4;
    if (lineCount > 1) return 2;
    return 1;
  };

  // Get filtered emojis based on search and category
  const getFilteredEmojis = () => {
    const categoryEmojis = EMOJI_CATEGORIES[activeEmojiCategory].emojis;
    if (!emojiSearch.trim()) return categoryEmojis;
    
    // Search across all categories
    const allEmojis = Object.values(EMOJI_CATEGORIES).flatMap(c => c.emojis);
    return allEmojis.filter((emoji, index, self) => self.indexOf(emoji) === index); // unique
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inputValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fileTypes = [
    { icon: Image, label: "Image", color: "hover:bg-pink-100", accept: "image/*", ref: imageInputRef },
    { icon: Video, label: "Video", color: "hover:bg-purple-100", accept: "video/*", ref: videoInputRef },
    { icon: Music, label: "Audio", color: "hover:bg-indigo-100", accept: "audio/*", ref: audioInputRef },
    { icon: Code, label: "Code/Script", color: "hover:bg-green-100", accept: ".md,.py,.java,.html,.htm,.js,.jsx,.ts,.tsx,.css,.scss,.json,.cpp,.c,.h,.bat,.ps1,.pt,.h5,.asm,.go,.sh,.shell,.php,.rb,.rs,.swift,.kt,.scala,.vue,.svelte,.yaml,.yml,.xml,.sql,.r,.m,.lua,.pl,.ex,.exs,.erl,.hs,.clj,.lisp,.tsv,.csv,.toml,.ini,.conf,.cfg,.env,.dockerfile,.makefile,.cmake,.gradle", ref: codeInputRef },
    { icon: FileIcon, label: "Document", color: "hover:bg-blue-100", accept: ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.epub,.mobi,.azw,.azw3", ref: documentInputRef },
    { icon: Paperclip, label: "All Files", color: "hover:bg-gray-100", accept: "*/*", ref: fileInputRef },
  ];

  const handleFileTypeSelect = (fileType: typeof fileTypes[0]) => {
    setShowFileMenu(false);
    if (fileType.ref.current) {
      fileType.ref.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white border-t border-gray-200 pb-safe p-2 sm:p-3 shadow-lg relative">
      {/* WhatsApp-style Emoji Picker */}
      {showMoodPicker && (
        <div 
          className="absolute bottom-full left-0 right-0 sm:left-auto sm:right-auto sm:w-[320px] bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 shadow-2xl max-h-[50vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-200 z-[100]"
        >
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search emoji..."
                className="w-full px-3 py-2 pl-9 text-sm bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300"
                value={emojiSearch}
                onChange={(e) => setEmojiSearch(e.target.value)}
              />
              <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Emoji Grid */}
          <div className="flex-1 overflow-y-auto p-2 min-h-[200px]">
            <div className="grid grid-cols-8 gap-0.5">
              {getFilteredEmojis().map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  className="p-2 text-xl hover:bg-gray-100 rounded-lg transition-all active:scale-90 flex items-center justify-center"
                  onClick={() => {
                    insertEmoji(emoji);
                    onToggleMoodPicker();
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          
          {/* Bottom Category Tabs - WhatsApp style */}
          <div className="flex border-t border-gray-100 bg-gray-50 overflow-x-auto">
            {Object.entries(EMOJI_CATEGORIES).map(([key, category]) => (
              <button
                key={key}
                onClick={() => {
                  setActiveEmojiCategory(key as keyof typeof EMOJI_CATEGORIES);
                  setEmojiSearch('');
                }}
                className={cn(
                  "flex-1 min-w-[40px] py-2.5 flex items-center justify-center transition-colors",
                  activeEmojiCategory === key 
                    ? "text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <category.icon className="h-5 w-5" />
              </button>
            ))}
            {/* Stickers Tab */}
            <button
              onClick={() => setShowStickers(!showStickers)}
              className={cn(
                "min-w-[40px] py-2.5 flex items-center justify-center transition-colors",
                showStickers 
                  ? "text-indigo-600 bg-indigo-50 border-b-2 border-indigo-600" 
                  : "text-gray-500 hover:bg-gray-100"
              )}
            >
              <Sticker className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-1 sm:px-4 space-y-2 sm:space-y-3">

          {/* Main Input Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-100 rounded-xl sm:rounded-2xl border border-gray-200 p-1.5 sm:p-2">
            {/* File Upload Menu */}
            <div className="relative z-20">
              <button 
                type="button"
                className="h-9 w-9 sm:h-10 sm:w-10 hover:bg-gray-200 text-gray-600 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors cursor-pointer" 
                onClick={() => setShowFileMenu(!showFileMenu)}
              >
                <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              
              {showFileMenu && (
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 z-50 animate-in slide-in-from-bottom-2 min-w-[160px] sm:min-w-[180px]">
                  {fileTypes.map((type, index) => (
                    <button
                      key={index}
                      onClick={() => handleFileTypeSelect(type)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors text-gray-700",
                        type.color
                      )}
                    >
                      <type.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>{type.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emoji Button */}
            <button 
              ref={emojiButtonRef}
              type="button"
              aria-label="Open emoji picker"
              className={cn(
                "h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer",
                currentMood ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" : "hover:bg-gray-200 text-gray-600",
                showMoodPicker && "bg-indigo-100 text-indigo-600"
              )} 
              onClick={onToggleMoodPicker}
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Text Input */}
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={currentMood ? `Feeling ${currentMood}...` : "Type..."}
              className={cn(
                "flex-1 resize-none bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none py-2 text-[14px] sm:text-sm transition-all duration-200",
                getTextAreaHeight(inputValue)
              )}
              rows={getTextAreaRows(inputValue)}
            />

            {/* Send Button */}
            <button 
              type="button"
              onClick={onSend} 
              disabled={!inputValue.trim()}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-md transition-all active:scale-95 disabled:opacity-50 flex-shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white pointer-events-none" />
            </button>
          </div>

          {/* Markdown Preview Panel */}
          {showPreview && inputValue.trim() && (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Preview</span>
                  {hasCode(inputValue) && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Code detected</span>
                  )}
                  {hasMarkdown(inputValue) && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">Markdown</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-3 min-h-[60px] max-h-48 overflow-y-auto">
                <div className="text-sm text-gray-800">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-0">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-0">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-0">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-sm font-semibold mb-1 mt-0">{children}</h4>,
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      del: ({ children }) => <del className="line-through text-gray-500">{children}</del>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-1 space-y-0.5">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-1 space-y-0.5">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-400 pl-3 italic text-gray-600 my-1">{children}</blockquote>,
                      code: ({ className, children }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className;
                        if (isInline) {
                          return <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono text-indigo-600">{children}</code>;
                        }
                        return (
                          <PreviewCodeBlock
                            code={String(children).replace(/\n$/, '')}
                            language={match?.[1] || 'plaintext'}
                          />
                        );
                      },
                      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">{children}</a>,
                      hr: () => <hr className="border-gray-200 my-2" />,
                    }}
                  >
                    {inputValue}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          )}

          {/* Markdown/Code Hint when not previewing */}
          {!showPreview && inputValue.trim() && (hasMarkdown(inputValue) || hasCode(inputValue)) && (
            <div className="flex items-center gap-3 text-xs text-indigo-500 animate-in fade-in">
              {hasCode(inputValue) && (
                <span className="flex items-center gap-1 text-green-600">
                  <Code className="h-3.5 w-3.5" /> Code detected
                </span>
              )}
              {hasMarkdown(inputValue) && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" /> Markdown
                </span>
              )}
            </div>
          )}
        </div>

      {/* Hidden File Inputs */}
      <input ref={fileInputRef} type="file" multiple accept="*/*" onChange={handleFileChange} className="hidden" />
      <input ref={imageInputRef} type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
      <input ref={videoInputRef} type="file" multiple accept="video/*" onChange={handleFileChange} className="hidden" />
      <input ref={audioInputRef} type="file" multiple accept="audio/*" onChange={handleFileChange} className="hidden" />
      <input ref={documentInputRef} type="file" multiple accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.epub,.mobi,.azw,.azw3" onChange={handleFileChange} className="hidden" />
      <input ref={codeInputRef} type="file" multiple accept=".md,.py,.java,.html,.htm,.js,.jsx,.ts,.tsx,.css,.scss,.json,.cpp,.c,.h,.bat,.ps1,.pt,.h5,.asm,.go,.sh,.shell,.php,.rb,.rs,.swift,.kt,.scala,.vue,.svelte,.yaml,.yml,.xml,.sql,.r,.m,.lua,.pl,.ex,.exs,.erl,.hs,.clj,.lisp,.tsv,.csv,.toml,.ini,.conf,.cfg,.env,.dockerfile,.makefile,.cmake,.gradle" onChange={handleFileChange} className="hidden" />
    </div>
  );
}
