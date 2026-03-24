"use client";

import { useState, useRef } from "react";
import { Copy, CheckCheck, Smile, Reply, Pin, PinOff, Flame, Trash2, MoreVertical, Download, ExternalLink, Play, Pause, Ghost, EyeOff, FileIcon, FileText, Music, Video, Volume2, VolumeX, Bold, Italic, Code as CodeIcon, Link as LinkIcon, Image as ImageIcon, MessageSquare } from "lucide-react";
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
    <div className="relative group cursor-pointer mb-2 overflow-hidden rounded-xl shadow-lg border border-white/10" onClick={onClick}>
      <img 
        src={file.url} 
        alt={file.name || 'Image'} 
        className="w-full h-auto max-h-80 object-cover transition-transform duration-500 group-hover:scale-110" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30 transform scale-75 group-hover:scale-100 transition-transform duration-300">
          <ImageIcon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {file?.size && (
          <div className="bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 text-[10px] text-white/90 border border-white/10 font-medium">
            {formatBytes(file.size)}
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); if (file?.url) { const link = document.createElement('a'); link.href = file.url; link.download = file.name || 'image'; link.click(); } }}
          className="bg-indigo-500 hover:bg-indigo-600 rounded-lg p-1.5 transition-colors shadow-lg"
        >
          <Download className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </div>
  );
}

function VideoPreview({ file }: { file: FileMetadata }) {
  if (!file?.url) return null;
  
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (file?.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name || 'video';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative mb-3 group rounded-xl overflow-hidden shadow-xl border border-white/10 bg-black/20">
      <video 
        src={file.url} 
        controls 
        className="w-full h-auto max-h-80" 
        preload="metadata"
      />
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={handleDownload}
          className="bg-indigo-500 hover:bg-indigo-600 rounded-lg p-2 text-white shadow-lg transition-transform active:scale-95"
        >
          <Download className="h-4 w-4" />
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

function FilePreview({ file, isOwn, onDownload }: { file: FileMetadata; isOwn: boolean; onDownload: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  
  if (!file?.url) return null;

  const getFileIcon = () => {
    if (!file?.name) return <FileIcon className="h-8 w-8 text-slate-400" />;
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext || '')) return <FileText className="h-8 w-8 text-rose-400" />;
    if (['doc', 'docx', 'txt', 'rtf'].includes(ext || '')) return <FileText className="h-8 w-8 text-blue-400" />;
    if (['xls', 'xlsx', 'csv'].includes(ext || '')) return <FileText className="h-8 w-8 text-emerald-400" />;
    if (['ppt', 'pptx'].includes(ext || '')) return <FileText className="h-8 w-8 text-orange-400" />;
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) return <FileIcon className="h-8 w-8 text-amber-400" />;
    if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(ext || '')) return <Music className="h-8 w-8 text-violet-400" />;
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext || '')) return <Video className="h-8 w-8 text-pink-400" />;
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) return <ImageIcon className="h-8 w-8 text-emerald-400" />;
    return <FileIcon className="h-8 w-8 text-slate-400" />;
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDownload();
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
        <button 
          onClick={handleDownload}
          className={cn(
            "p-2.5 rounded-xl transition-all duration-200 active:scale-90 shadow-sm",
            isOwn ? "bg-white/20 hover:bg-white/30" : "bg-indigo-500/80 hover:bg-indigo-500 text-white"
          )}
        >
          <Download className="h-4 w-4" />
        </button>
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
  const isPoll = message.type === "poll";
  const file = message.metadata as FileMetadata | null;
  const isImage = file?.type?.startsWith("image/");
  const isVideo = file?.type?.startsWith("video/");
  const isAudio = file?.type?.startsWith("audio/");
  const isBlurredHere = blurredMessages.has(message.id);
  const [showMenu, setShowMenu] = useState(false);
  const messageReactions = reactions[message.id] || [];
  const pollOptions = message.pollOptions || [];

  const handleBurn = () => {
    setTimeout(() => onBurn(message.id), 2000);
  };

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
      <div className={cn("flex gap-2", isOwn ? "flex-row-reverse" : "flex-row")}>
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
      "flex gap-2 group animate-in slide-in-from-bottom fade-in",
      isOwn ? "flex-row-reverse" : "flex-row",
      !isFirst && "mt-1"
    )}>
      {!isOwn && isFirst && (
        <Avatar className="h-9 w-9 ring-2 ring-white/20 shadow-lg">
          <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-bold">
            {(message.userId || "AN").slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!isOwn && !isFirst && <div className="w-9" />}
      
      <div className={cn("max-w-[80%] sm:max-w-[70%]", isOwn && "flex flex-col items-end")}>
        {replyMessage && (
          <div className={cn(
            "text-xs px-3 py-1.5 mb-1.5 rounded-lg border-l-2 backdrop-blur",
            isOwn ? "bg-indigo-500/20 border-indigo-400 text-indigo-200" : "bg-white/5 border-white/30 text-white/70"
          )}>
            <span className="font-semibold">{(replyMessage.userId || "Anonymous").slice(0, 6)}:</span> {replyMessage.content.slice(0, 50)}
          </div>
        )}
        
        {isPinned && (
          <div className="flex items-center gap-1 text-xs text-amber-400 mb-1.5 bg-amber-500/10 px-2 py-0.5 rounded-full">
            <Pin className="h-3 w-3" />
            <span>Pinned</span>
          </div>
        )}
        
        <div className={cn(
          "rounded-2xl px-4 py-3 relative group/message transition-all duration-300 shadow-lg",
          isOwn 
            ? "bg-indigo-600/90 text-white rounded-br-sm border border-white/10 backdrop-blur-sm" 
            : "bg-slate-800/90 backdrop-blur-md text-slate-100 border border-white/5 rounded-bl-sm shadow-black/20"
        )}>
          {isBlurredHere && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors" onClick={() => onRevealBlur(message.id)}>
              <div className="text-center">
                <EyeOff className="h-6 w-6 text-white mx-auto mb-2 animate-pulse" />
                <span className="text-white text-sm font-medium">Click to reveal</span>
              </div>
            </div>
          )}
          
          {isAudio && file && (
            <AudioPreview file={file} isOwn={isOwn} />
          )}
          
          {isImage && file && (
            <ImagePreview file={file} onClick={() => onOpenImage(file.url || '', file.name || '')} />
          )}
          
          {isVideo && file && (
            <VideoPreview file={file} />
          )}
          
          {!isImage && !isVideo && !isAudio && file && message.type !== "voice" && (
            <FilePreview 
              file={file} 
              isOwn={isOwn} 
              onDownload={() => {
                if (file?.url) {
                  const link = document.createElement('a');
                  link.href = file.url;
                  link.download = file.name || 'file';
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }} 
            />
          )}
          
          {!isImage && !isVideo && !isAudio && message.type !== "voice" && (
            <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 mt-3">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-3">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-1.5 mt-2">{children}</h3>,
                h4: ({ children }) => <h4 className="text-sm font-bold mb-1 mt-2">{children}</h4>,
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                del: ({ children }) => <del className="line-through text-white/60">{children}</del>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5">{children}</ol>,
                li: ({ children }) => <li className="text-white/90">{children}</li>,
                blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-400 pl-3 italic text-white/70 my-2">{children}</blockquote>,
                code: ({ node, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const isInline = !match && !className;
                  if (isInline) {
                    return <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm font-mono text-indigo-300" {...props}>{children}</code>;
                  }
                  return <CodeBlock code={String(children).replace(/\n$/, '')} language={match?.[1] || 'plaintext'} />;
                },
                a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline inline-flex items-center gap-1">{children}<ExternalLink className="h-3 w-3" /></a>,
                table: ({ children }) => <table className="border-collapse w-full my-2">{children}</table>,
                thead: ({ children }) => <thead className="bg-white/10">{children}</thead>,
                th: ({ children }) => <th className="border border-white/20 px-3 py-1.5 text-left text-xs font-semibold">{children}</th>,
                td: ({ children }) => <td className="border border-white/20 px-3 py-1.5 text-sm">{children}</td>,
                hr: () => <hr className="border-white/10 my-3" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
            </div>
          )}
          
          {message.burnAfterReading === 1 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-orange-500 rounded-full p-1.5 shadow-lg shadow-red-500/50 animate-pulse">
              <Flame className="h-3 w-3 text-white" />
            </div>
          )}
          
          {message.isAnonymous === 1 && (
            <div className="absolute -top-2 -left-2 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full p-1.5 shadow-lg">
              <Ghost className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        
        {isPoll && pollOptions.length > 0 && (
          <div className={cn("mt-1.5 rounded-xl p-3 backdrop-blur border", isOwn ? "bg-indigo-500/20 border-indigo-500/30" : "bg-white/5 border-white/10")}>
            <p className="text-xs text-white/60 mb-2 font-medium">{message.content}</p>
            {pollOptions.map((option: any) => (
              <button
                key={option.id}
                onClick={() => onVote(message.id, option.id)}
                className={cn(
                  "w-full text-left px-4 py-2.5 rounded-lg mb-1.5 text-sm transition-all hover:scale-[1.02]",
                  isOwn ? "bg-indigo-500/30 hover:bg-indigo-500/40 text-white" : "bg-white/10 hover:bg-white/20 text-white"
                )}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  <span className="text-xs text-white/60">{option.votes || 0}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {messageReactions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {Object.entries(messageReactions.reduce((acc: Record<string, number>, r: string) => {
              acc[r] = (acc[r] || 0) + 1;
              return acc;
            }, {})).map(([emoji, count]) => (
              <span key={emoji} className="text-sm bg-white/10 backdrop-blur rounded-full px-2.5 py-0.5 border border-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                {emoji} {count}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-0.5 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/40 backdrop-blur-lg rounded-full px-2 py-1">
          <button onClick={() => { navigator.clipboard.writeText(message.content); }} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" title="Copy message">
            <Copy className="h-4 w-4 text-white/80" />
          </button>
          <button onClick={() => onReact(message.id, "😂")} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <Smile className="h-4 w-4 text-white/80" />
          </button>
          <button onClick={() => onQuoteReply(message)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
            <Reply className="h-4 w-4 text-white/80" />
          </button>
          {!isOwn && (
            <button onClick={() => onPin(message.id)} className="p-1.5 rounded-full hover:bg-white/20 transition-colors">
              {isPinned ? <PinOff className="h-4 w-4 text-amber-400" /> : <Pin className="h-4 w-4 text-white/80" />}
            </button>
          )}
          {!isOwn && (
            <button onClick={handleBurn} className="p-1.5 rounded-full hover:bg-red-500/30 transition-colors">
              <Flame className="h-4 w-4 text-red-400" />
            </button>
          )}
          <button onClick={() => onDelete(message.id)} className="p-1.5 rounded-full hover:bg-red-500/30 transition-colors">
            <Trash2 className="h-4 w-4 text-red-400" />
          </button>
          {file && (
            <button onClick={() => { onDownload(file); }} className="p-1.5 rounded-full hover:bg-white/20 transition-colors" title="Download">
              <Download className="h-4 w-4 text-white/80" />
            </button>
          )}
        </div>
        
        {isLast && (
          <div className={cn("flex items-center gap-1 text-[10px] mt-0.5", isOwn ? "text-white/50" : "text-white/40")}>
            <span>{formatRelativeTime(new Date(message.createdAt))}</span>
            {isOwn && <CheckCheck className="h-3 w-3 text-indigo-400" />}
          </div>
        )}
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
