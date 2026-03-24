"use client";

import { useState, useRef } from "react";
import { Copy, CheckCheck, Smile, Reply, Pin, PinOff, Flame, Trash2, MoreVertical, Download, ExternalLink, Play, Pause, Ghost, EyeOff, FileIcon, FileText, Music, Video, Volume2, VolumeX, Bold, Italic, Code as CodeIcon, Link as LinkIcon, Image as ImageIcon, MessageSquare, Heart, Eye } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatRelativeTime, formatBytes, cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message, FileMetadata } from "@/types/message";

const EMOJIS = [
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
  "😽", "🙀", "😿", "😾", "🙈", "🙉", "🙊", "💋", "💌", "💘",
  "💝", "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️",
  "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢",
  "💥", "💫", "💦", "💨", "🕳️", "💣", "💬", "👋", "🤚", "🖐️",
  "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙",
  "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊",
  "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💅",
  "🤳", "💪", "🔥", "⭐", "🌟", "✨", "💫", "🎉", "🎊", "🎈",
  "🎁", "🎀", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🎗️", "🎪",
  "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎷", "🎺",
  "🎸", "🪘", "🎻", "🎲", "🧩", "♟️", "🎯", "🎳", "🎮", "🕹️",
  "🎰", "🚀", "✈️", "🛩️", "🚀", "🛸", "🚁", "🚂", "🚗", "🚙",
  "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🏍️",
  "🛵", "🚲", "🛴", "🛹", "🚏", "🛤", "🛣", "⛽", "🚧", "🚦",
  "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪",
  "🏫", "🏬", "🏭", "🏯", "🏰", "💒", "🗼", "🗽", "⛪", "⛩️",
  "🕌", "🕍", "⛲", "⛺", "🌉", "🌃", "🌄", "🌅", "🌄", "🌠",
  "🎇", "🎆", "🌌", "🌃", "🌉", "🌁", "🌠", "🎑", "💴", "💵",
  "💶", "💷", "💰", "💳", "💎", "⚖️", "🦾", "🦿", "🦵", "🦶",
  "👂", "👃", "🧠", "🫀", "🫁", "🦷", "🦴", "👀", "👁️", "👅",
  "👄", "👶", "🧒", "👦", "👧", "🧑", "👱", "👨", "🧔", "👩",
  "🧓", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🧏",
  "🙇", "🤦", "🤷", "👮", "🕵️", "💂", "🥷", "👰", "🤵", "👸",
  "🤴", "🦸", "🦹", "🧙", "🧚", "🧛", "🧜", "🧝", "🧞", "🧟",
  "💏", "💑", "👫", "👬", "👭", "💏", "💑", "❤️‍🔥", "❤️‍🔥", "👪",
  "👨‍👩‍👧", "👨‍👩‍👧‍👦", "👨‍👩‍👦‍👦", "👩‍👩‍👧‍👦", "👩‍👩‍👦‍👦", "👨‍👨‍👧‍👦", "👨‍👨‍👦‍👦",
  "👚", "👛", "👜", "👝", "🛍️", "🎒", "👞", "👟", "👠", "👡",
  "👢", "👡", "👞", "👟", "🥾", "🥿", "🎩", "👒", "🎓", "🧢",
  "👑", "💄", "💍", "💎", "🐶", "🐱", "🐭", "🐹", "🐰", "🦊",
  "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵",
  "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥",
  "🦆", "🦅", "🦉", "🦇", "🐺", "🐗", "🐴", "🦄", "🐝", "🪱",
  "🦋", "🐌", "🐞", "🐜", "🪰", "🪲", "🪳", "🦟", "🦗", "🕷️",
  "🕸️", "🦂", "🐢", "🐍", "🦎", "🦖", "🦕", "🐙", "🦑", "🦐",
  "🦞", "🦀", "🐡", "🐠", "🐟", "🐬", "🐳", "🐋", "🦈", "🐊",
  "🐅", "🐆", "🦓", "🦍", "🦧", "🦣", "🐘", "🦛", "🦏", "🐪",
  "🐫", "🦒", "🦘", "🦬", "🐃", "🐂", "🐄", "🐎", "🐖", "🐏",
  "🐑", "🦙", "🐐", "🦌", "🐕", "🐩", "🦮", "🐈", "🐓", "🦃",
  "🦤", "🦚", "🦜", "🦢", "🦩", "🕊️", "🐇", "🦝", "🦨", "🦡",
  "🦫", "🦦", "🦥", "🐁", "🐀", "🐿️", "🦔", "🌵", "🌲", "🌳",
  "🌴", "🌱", "🌿", "☘️", "🍀", "🎍", "🎋", "🍃", "🍂", "🍁",
  "🍄", "🌾", "💐", "🌷", "🌹", "🥀", "🌺", "🌸", "🌼", "🌻",
  "🌞", "🌝", "🌛", "🌜", "🌚", "🌕", "🌖", "🌗", "🌘", "🌑",
  "🌒", "🌓", "🌔", "🌙", "🌎", "🌍", "🌏", "🪐", "💫", "⭐",
  "🌟", "✨", "💥", "💢", "💦", "💧", "🔥", "🌪", "🌈", "☀️",
  "🌤️", "⛅", "🌥️", "☁️", "🌦️", "🌧️", "⛈️", "🌩️", "🌨️", "❄️",
  "☃️", "⛄", "🌬️", "💨", "💩", "🌪", "🌫️", "🌁", "🌊", "💧",
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
  "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣", "🥡",
  "🥢", "🧂", "⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉",
  "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃",
  "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹",
  "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼",
  "🤸", "🤺", "⛹️", "🤾", "🏌️", "🏇", "⛳", "🧗", "🏄", "🏊",
  "🤽", "🚣", "🧜", "🚴", "🚵", "🎠", "🎡", "🎢", "💎", "🎪",
  "🎭", "🎨", "🎪", "🎫", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁",
  "🎷", "🎺", "🎸", "🪘", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮",
  "🕹️", "🎰", "⌚", "📱", "📲", "💻", "⌨️", "🖥️", "🖨️", "🖱️",
  "🖲️", "💽", "💾", "💿", "📀", "📼", "📷", "📸", "📹", "🎥",
  "📽️", "🎞️", "📞", "☎️", "📟", "📠", "📺", "📻", "🎙️", "🎚️",
  "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋",
  "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴",
  "💶", "💷", "🪙", "💰", "💳", "💎", "⚖️", "🪜", "🧰", "🪛",
  "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🪚", "🔩", "⚙️", "🪤", "🧱",
  "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️",
  "🚬", "⚰️", "🪦", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️",
  "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠",
  "🧫", "🧪", "🌡️", "🧹", "🪠", "🧺", "🧻", "🚽", "🚰", "🚿",
  "🛁", "🛀", "🧼", "🪥", "🪒", "🧽", "🪣", "🧴", "🛎️", "🔑",
  "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🪆", "🖼️", "🪞",
  "🪟", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🎊", "🎉", "🎎",
  "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤",
  "📦", "🏷️", "📪", "📫", "📬", "📭", "📮", "📯", "📜", "📃",
  "📄", "📑", "🧾", "📊", "📈", "📉", "🗒️", "🗓️", "📆", "📅",
  "🗑️", "📇", "🗃️", "🗳️", "🗄️", "📋", "📁", "📂", "🗂️", "🗞️",
  "📰", "📓", "📔", "📒", "📕", "📗", "📘", "📙", "📚", "📖",
  "🔖", "🧷", "🔗", "📎", "🖇️", "📐", "📏", "🧮", "📌", "📍",
  "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️", "📝", "✏️", "🔍", "🔎",
  "🔏", "🔐", "🔒", "🔓", "🧱", "⛓️", "🧲", "🔧", "🔨", "⚒️",
  "🛠️", "⛏️", "🔩", "⚙️", "🔗", "📌", "📍", "🔒", "🔓", "🔏",
  "🔐", "🔑", "🗝️", "🔨", "🪓", "🔧", "🪛", "🔩", "⚙️", "🔗",
  "📎", "🖇️", "📏", "📐", "✂️", "🖊️", "🖋️", "✒️", "🖌️", "🖍️"
];

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightCode = (code: string, lang: string): string => {
    let highlighted = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const commentPatterns: Record<string, RegExp[]> = {
      default: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g, /#.*$/gm],
      python: [/#.*$/gm, /"""[\s\S]*?"""/g, /'''[\s\S]*?'''/g],
      html: [/<!--[\s\S]*?-->/g],
      css: [/\/\*[\s\S]*?\*\//g],
      shell: [/#.*$/gm],
      bash: [/#.*$/gm],
      powershell: [/#.*$/gm, /<#[\s\S]*?#>/g],
      sql: [/--.*$/gm, /\/\*[\s\S]*?\*\//g],
      lua: [/--.*$/gm, /--\[\[[\s\S]*?\]\]/g],
      ruby: [/#.*$/gm, /=begin[\s\S]*?=end/g],
      perl: [/#.*$/gm, /=pod[\s\S]*?=cut/g],
      r: [/#.*$/gm],
      go: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      java: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      javascript: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      typescript: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      c: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      cpp: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      php: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g, /#.*$/gm],
      rust: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      swift: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      kotlin: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
      scala: [/\/\/.*$/gm, /\/\*[\s\S]*?\*\//g],
    };

    const patterns = commentPatterns[lang.toLowerCase()] || commentPatterns.default;
    
    patterns.forEach(pattern => {
      highlighted = highlighted.replace(pattern, (match) => {
        return `<span class="text-slate-400/80 italic font-medium drop-shadow-sm">${match}</span>`;
      });
    });

    highlighted = highlighted
      .replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, (match) => {
        return `<span class="text-emerald-300 drop-shadow-[0_0_8px_rgba(110,231,183,0.3)]">${match}</span>`;
      });

    highlighted = highlighted
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-300 drop-shadow-[0_0_8px_rgba(253,186,116,0.3)]">$1</span>');

    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'true', 'false', 'null', 'undefined', 'def', 'print', 'elif', 'in', 'not', 'and', 'or', 'public', 'private', 'static', 'void', 'int', 'string', 'bool', 'package', 'interface', 'type', 'struct', 'func', 'go', 'select', 'case', 'default', 'switch', 'break', 'continue', 'yield', 'lambda', 'self', 'None', 'True', 'False'];
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
      highlighted = highlighted.replace(regex, '<span class="text-indigo-300 font-semibold drop-shadow-[0_0_8px_rgba(165,180,252,0.3)]">$1</span>');
    });

    return highlighted;
  };

  return (
    <div className="rounded-xl overflow-hidden text-xs my-3 bg-slate-950/90 border border-white/10 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-2.5 bg-white/5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-amber-500/50" />
          <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
          <span className="ml-2 text-slate-400 font-mono text-[10px] uppercase tracking-wider">{language}</span>
        </div>
        <button 
          onClick={copyCode} 
          className="text-slate-400 hover:text-white transition-all duration-200 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-white/5 active:scale-95"
        >
          {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span className="text-[10px] font-medium tracking-tight">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto max-h-[32rem] overflow-y-auto custom-scrollbar-dark selection:bg-indigo-500/30">
        <code 
          className="text-slate-200 font-mono text-[12px] leading-relaxed whitespace-pre"
          dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
        />
      </pre>
    </div>
  );
}

function ImagePreview({ file, onClick }: { file: FileMetadata; onClick: () => void }) {
  if (!file?.url) return null;
  return (
    <div className="relative group mb-2 overflow-hidden rounded-xl shadow-lg border border-white/10 bg-black/5">
      <img 
        src={file.url} 
        alt={file.name || 'Image'} 
        className="w-full h-auto max-h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
        <button 
          onClick={onClick}
          className="bg-white/20 backdrop-blur-md rounded-full p-2.5 border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90"
          title="Preview"
        >
          <Eye className="h-5 w-5" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); if (file?.url) { const link = document.createElement('a'); link.href = file.url; link.download = file.name || 'image'; link.click(); } }}
          className="bg-indigo-500/80 backdrop-blur-md rounded-full p-2.5 border border-white/30 text-white hover:bg-indigo-600 transition-all active:scale-90"
          title="Download"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
      {file?.size && (
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] text-white/90 border border-white/10 font-medium">
          {formatBytes(file.size)}
        </div>
      )}
    </div>
  );
}

function VideoPreview({ file, onClick }: { file: FileMetadata; onClick: () => void }) {
  if (!file?.url) return null;
  
  return (
    <div className="relative mb-3 group rounded-xl overflow-hidden shadow-xl border border-white/10 bg-black/20">
      <video 
        src={file.url} 
        className="w-full h-auto max-h-80" 
        preload="metadata"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2">
        <button 
          onClick={onClick}
          className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30 text-white hover:bg-white/30 transition-all active:scale-90 shadow-xl"
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); if (file?.url) { const link = document.createElement('a'); link.href = file.url; link.download = file.name || 'video'; link.click(); } }}
          className="bg-indigo-500/80 backdrop-blur-md rounded-full p-3 border border-white/30 text-white hover:bg-indigo-600 transition-all active:scale-90 shadow-xl"
        >
          <Download className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
function AudioPreview({ file, isOwn }: { file: FileMetadata; isOwn: boolean }) {
  if (!file?.url) return null;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleDownload = () => {
    if (file?.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name || 'audio';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  return (
    <div className={cn(
      "mb-2 rounded-xl p-3 backdrop-blur border",
      isOwn ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 border-indigo-500/30" : "bg-white/10 border-white/10"
    )}>
      <audio 
        ref={audioRef}
        src={file.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="flex items-center gap-3">
        <button 
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors flex-shrink-0"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-xs text-white/60">
              <Music className="h-3 w-3" />
              <span className="max-w-[100px] truncate">{file.name}</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/40">
              <span>{formatTime(currentTime)}</span>
              <button onClick={() => { if (audioRef.current) { audioRef.current.muted = !isMuted; setIsMuted(!isMuted); } }}>
                {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </button>
            </div>
          </div>
          <div 
            className="h-1.5 bg-white/20 rounded-full cursor-pointer overflow-hidden"
            onClick={seek}
          >
            <div 
              className={cn("h-full rounded-full transition-all", isOwn ? "bg-gradient-to-r from-indigo-400 to-purple-400" : "bg-white/60")}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <button 
          onClick={handleDownload}
          className={cn(
            "p-2 rounded-lg transition-all flex-shrink-0",
            isOwn ? "bg-indigo-500/50 hover:bg-indigo-600" : "bg-white/10 hover:bg-white/20"
          )}
        >
          <Download className="h-4 w-4 text-white/80" />
        </button>
      </div>
    </div>
  );
}

function FilePreview({ file, isOwn, onDownload, onPreview }: { file: FileMetadata; isOwn: boolean; onDownload: () => void; onPreview: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!file?.url) return null;

  const getFileIcon = () => {
    if (!file?.name) return <FileIcon className="h-8 w-8 text-slate-400" />;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return <FileText className="h-8 w-8 text-rose-400" />;
    if (['doc', 'docx', 'txt', 'rtf', 'md'].includes(ext || '')) return <FileText className="h-8 w-8 text-blue-400" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileText className="h-8 w-8 text-emerald-400" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <FileText className="h-8 w-8 text-orange-400" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return <FileIcon className="h-8 w-8 text-amber-400" />;
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext || '')) return <Music className="h-8 w-8 text-violet-400" />;
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext || '')) return <Video className="h-8 w-8 text-pink-400" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <ImageIcon className="h-8 w-8 text-emerald-400" />;
    if (['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp', 'html', 'css'].includes(ext || '')) return <CodeIcon className="h-8 w-8 text-indigo-400" />;
    return <FileIcon className="h-8 w-8 text-slate-400" />;
  };

  const isPreviewable = () => {
    const ext = file.name?.split('.').pop()?.toLowerCase();
    return ['pdf', 'txt', 'md', 'js', 'ts', 'tsx', 'jsx', 'py', 'java', 'c', 'cpp', 'html', 'css', 'json'].includes(ext || '');
  };

  return (
    <div 
      className={cn(
        "mb-2 rounded-xl p-3 backdrop-blur-md border transition-all duration-300",
        isOwn 
          ? "bg-white/10 border-white/20 hover:bg-white/20" 
          : "bg-slate-700/50 border-white/10 hover:bg-slate-700/70",
        isHovered && "translate-y-[-2px] shadow-lg shadow-black/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 border border-white/10 shadow-inner">
          {getFileIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-white truncate font-semibold tracking-tight">{file?.name || 'Unknown file'}</p>
          <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider">{file?.size ? formatBytes(file.size) : '0 B'}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {isPreviewable() && (
            <button 
              onClick={(e) => { e.stopPropagation(); onPreview(); }}
              className={cn(
                "p-2.5 rounded-xl transition-all duration-200 active:scale-90 shadow-sm",
                isOwn ? "bg-white/20 hover:bg-white/30" : "bg-white/10 hover:bg-white/20"
              )}
              title="Preview"
            >
              <Eye className="h-4 w-4 text-white" />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className={cn(
              "p-2.5 rounded-xl transition-all duration-200 active:scale-90 shadow-sm",
              isOwn ? "bg-white/20 hover:bg-white/30" : "bg-indigo-500/80 hover:bg-indigo-500 text-white"
            )}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: Message;
  isFirst: boolean;
  isLast: boolean;
  onDownload: (file: FileMetadata) => void;
  onOpenImage: (url: string, name: string) => void;
  onReact: (messageId: string, emoji: string) => void;
  onQuoteReply: (message: Message) => void;
  onBurn: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
  onVote: (messageId: string, optionId: string) => void;
  isBurned: boolean;
  isPinned: boolean;
  blurredMessages: Set<string>;
  onRevealBlur: (messageId: string) => void;
  reactions: Record<string, string[]>;
  replyMessage?: Message | null;
}

export function MessageBubble({ message, isFirst, isLast, onDownload, onOpenImage, onReact, onQuoteReply, onBurn, onDelete, onPin, onVote, isBurned, isPinned, blurredMessages, onRevealBlur, reactions, replyMessage }: MessageBubbleProps) {
  const isOwn = message.userId === localStorage.getItem("userId");
  const isSystem = message.type === "system";
  const file = message.metadata as FileMetadata | null;
  const isImage = file?.type?.startsWith("image/");
  const isVideo = file?.type?.startsWith("video/");
  const isAudio = file?.type?.startsWith("audio/");
  const isBlurredHere = blurredMessages.has(message.id);
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Check if message has markdown or code
  const hasMarkdownOrCode = /```[\s\S]*?```|`[^`]+`|\*\*|__|##|#\s|\[.+\]\(.+\)/.test(message.content);

  if (isSystem) {
    return (
      <div className="flex justify-center py-3 animate-in fade-in zoom-in-95">
        <span className="text-xs text-white/60 bg-white/5 backdrop-blur px-4 py-1.5 rounded-full border border-white/10">
          {message.content}
        </span>
      </div>
    );
  }

  if (isBurned) {
    return (
      <div className={cn("flex w-full mb-1 px-4", isOwn ? "justify-end" : "justify-start")}>
        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur",
          isOwn ? "bg-red-500/20 text-red-300 border border-red-500/30" : "bg-white/5 text-white/40 border border-white/10"
        )}>
          <Flame className="h-4 w-4 animate-pulse" />
          <span className="text-sm italic">Message burned</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex w-full mb-1 px-4 group",
      isOwn ? "justify-end" : "justify-start",
      !isLast && "mb-0.5",
      isFirst && "mt-4"
    )}>
      <div className={cn(
        "flex max-w-[85%] sm:max-w-[75%] gap-0",
        isOwn ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        <div className={cn(
          "flex-shrink-0 flex items-end mb-1 z-10",
          !isLast && "opacity-0"
        )}>
          <div className={cn(
            "w-9 h-9 rounded-2xl flex items-center justify-center text-[11px] font-bold text-white shadow-lg border-2 border-white",
            isOwn 
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200/50 -ml-2" 
              : "bg-gradient-to-br from-slate-600 to-slate-800 shadow-slate-200/50 -mr-2"
          )}>
            {message.senderName?.slice(0, 2).toUpperCase() || (message.userId?.slice(0, 2).toUpperCase() ?? "AN")}
          </div>
        </div>

        <div className={cn(
          "flex flex-col flex-1 min-w-0",
          isOwn ? "items-end" : "items-start"
        )}>
          {/* Sender Name */}
          {isFirst && !isOwn && (
            <span className="text-[11px] font-bold text-slate-500 ml-4 mb-1 uppercase tracking-tight">
              {message.senderName || "Anonymous"}
            </span>
          )}

          <div className="relative group/bubble flex items-center gap-2 w-full">
            <div className={cn(
              "relative px-4 py-2.5 shadow-md transition-all duration-200",
              isOwn 
                ? "bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white" 
                : "bg-slate-800/90 backdrop-blur-md text-slate-100 border border-white/5 shadow-black/20",
              isFirst && isLast 
                ? "rounded-[20px]" 
                : isFirst 
                  ? (isOwn ? "rounded-t-[20px] rounded-l-[20px]" : "rounded-t-[20px] rounded-r-[20px]")
                  : isLast
                    ? (isOwn ? "rounded-b-[20px] rounded-l-[20px]" : "rounded-b-[20px] rounded-r-[20px]")
                    : (isOwn ? "rounded-l-[20px]" : "rounded-r-[20px]")
            )}>
              {/* Reply Reference */}
              {replyMessage && (
                <div className={cn(
                  "text-[11px] px-2 py-1 mb-2 rounded-lg border-l-2 backdrop-blur-sm",
                  isOwn ? "bg-white/10 border-white/30 text-white/80" : "bg-black/20 border-white/20 text-white/60"
                )}>
                  <span className="font-bold">{(replyMessage.senderName || "Anonymous").slice(0, 8)}</span>
                  <p className="truncate max-w-[200px]">{replyMessage.content}</p>
                </div>
              )}

              {/* Blurred Message Overlay */}
              {isBlurredHere && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md rounded-[20px] z-10 flex items-center justify-center cursor-pointer group/blur" onClick={() => onRevealBlur(message.id)}>
                  <div className="flex flex-col items-center gap-1 scale-90 transition-transform group-hover/blur:scale-100">
                    <EyeOff className="h-5 w-5 text-white/80" />
                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest">Reveal</span>
                  </div>
                </div>
              )}

              {/* Message Content */}
              {isImage && file && (
                <ImagePreview file={file} onClick={() => onOpenImage(file.url || '', file.name || '')} />
              )}
              {isVideo && file && (
                <VideoPreview file={file} onClick={() => onOpenImage(file.url || '', file.name || '')} />
              )}
              {isAudio && file && (
                <AudioPreview file={file} isOwn={isOwn} />
              )}
              {!isImage && !isVideo && !isAudio && file && message.type !== "voice" && (
                <FilePreview 
                  file={file} 
                  isOwn={isOwn} 
                  onDownload={() => onDownload(file)} 
                  onPreview={() => onOpenImage(file.url || '', file.name || '')}
                />
              )}
              
              {!isImage && !isVideo && !isAudio && message.type !== "voice" && (
                <div className={cn(
                  "text-[15px] leading-relaxed break-words",
                  isOwn ? "text-white" : "text-slate-100"
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
                      code: ({ node, className, children, ...props }) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match && !className;
                        if (isInline) {
                          return <code className="bg-black/20 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>;
                        }
                        return <CodeBlock code={String(children).replace(/\n$/, '')} language={match?.[1] || 'plaintext'} />;
                      },
                      a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:opacity-80 transition-opacity">{children}</a>
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}

              {/* Message Badges */}
              <div className="absolute -top-2 -right-2 flex gap-1">
                {message.burnAfterReading === 1 && (
                  <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-full p-1 shadow-lg shadow-red-500/30 animate-pulse">
                    <Flame className="h-3 w-3 text-white" />
                  </div>
                )}
                {message.isAnonymous === 1 && (
                  <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-full p-1 shadow-lg">
                    <Ghost className="h-3 w-3 text-white" />
                  </div>
                )}
                {isPinned && (
                  <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-1 shadow-lg">
                    <Pin className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Actions Menu */}
            <div className={cn(
              "flex items-center gap-1 opacity-0 group-hover/bubble:opacity-100 transition-all duration-200 translate-y-2 group-hover/bubble:translate-y-0",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}>
              <button 
                onClick={() => onReact && onReact(message.id, "❤️")}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-500 transition-colors shadow-sm bg-white border border-slate-100"
              >
                <Heart className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={() => onQuoteReply && onQuoteReply(message)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-indigo-500 transition-colors shadow-sm bg-white border border-slate-100"
              >
                <Reply className="h-3.5 w-3.5" />
              </button>
              {(hasMarkdownOrCode || message.content.length > 50) && (
                <button 
                  onClick={handleCopyMessage}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-green-500 transition-colors shadow-sm bg-white border border-slate-100"
                  title="Copy to clipboard"
                >
                  {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              )}
              <button 
                onClick={() => onDelete(message.id)}
                className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shadow-sm bg-white border border-slate-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          
          {isLast && (
            <div className={cn(
              "flex items-center gap-1.5 text-[10px] mt-1 px-1 font-medium tracking-tight",
              isOwn ? "text-indigo-500/70" : "text-slate-400"
            )}>
              <span>{formatRelativeTime(new Date(message.createdAt))}</span>
              {isOwn && <CheckCheck className="h-3 w-3" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  code: string;
  copied: boolean;
  onCopyCode: () => void;
}

export function EmptyState({ code, copied, onCopyCode }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-lg flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
        <MessageSquare className="h-12 w-12 text-indigo-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-3">Start the conversation</h3>
      <p className="text-sm text-white/60 max-w-xs leading-relaxed">Be the first to send a message! Share the room code with friends to chat together.</p>
      <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
        <span className="font-mono text-white font-bold">{code}</span>
        <button onClick={onCopyCode} className="ml-2 p-1 hover:bg-white/10 rounded transition-colors">
          {copied ? <CheckCheck className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-white/60" />}
        </button>
      </div>
    </div>
  );
}

export { EMOJIS };
