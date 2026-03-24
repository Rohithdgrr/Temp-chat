"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Send, Smile, X, Paperclip, Image, Video, Music, FileIcon, Copy, CheckCheck, Play, Loader2, Code, Eye, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { EMOJIS } from "./MessageBubble";
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
    <div className="bg-white border-t border-gray-200 p-3 shadow-lg">
      <div className="max-w-2xl mx-auto space-y-3">
        {/* Emoji Picker */}
        {showMoodPicker && (
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-lg max-h-80 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                <Smile className="h-4 w-4 text-yellow-500" /> How are you feeling?
              </p>
              <button onClick={onToggleMoodPicker} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-10 gap-1">
              {EMOJIS.map((emoji, index) => (
                <button
                  key={`${emoji}-${index}`}
                  className="p-2 hover:bg-gray-100 rounded-lg text-2xl transition-all hover:scale-125"
                  onClick={() => { insertEmoji(emoji); }}
                  title="Insert emoji"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Input Bar */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-2xl border border-gray-200 p-2">
          {/* File Upload Menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 hover:bg-gray-200 text-gray-600 rounded-xl" 
              onClick={() => setShowFileMenu(!showFileMenu)}
              title="Attach files"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            {showFileMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 animate-in slide-in-from-bottom-2 min-w-[140px]">
                {fileTypes.map((type, index) => (
                  <button
                    key={index}
                    onClick={() => handleFileTypeSelect(type)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors text-gray-700",
                      type.color
                    )}
                  >
                    <type.icon className="h-5 w-5" />
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Emoji Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className={cn(
              "h-10 w-10 rounded-xl",
              currentMood ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200" : "hover:bg-gray-200 text-gray-600"
            )} 
            onClick={onToggleMoodPicker}
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </Button>

          {/* Copy Button */}
          {inputValue.trim() && (
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl hover:bg-gray-200 text-gray-600 transition-all"
              onClick={handleCopy}
              title="Copy message"
            >
              {copied ? <CheckCheck className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
          )}

          {/* Text Input */}
          <textarea
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={currentMood ? `Feeling ${currentMood}...` : "Type a message..."}
            className={cn(
              "flex-1 resize-none bg-transparent text-gray-800 placeholder:text-gray-400 focus:outline-none py-2 text-sm transition-all duration-200",
              hasCode(inputValue) ? "min-h-[160px] max-h-64" : "min-h-[40px] max-h-40"
            )}
            rows={hasCode(inputValue) ? 6 : 1}
          />

          {/* Send Button */}
          <Button 
            onClick={onSend} 
            disabled={!inputValue.trim()}
            className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 shadow-md transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
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
