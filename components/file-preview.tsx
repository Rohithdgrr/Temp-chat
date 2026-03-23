"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
  FileText,
  Code,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatBytes } from "@/lib/utils";

interface FilePreviewProps {
  url: string;
  name: string;
  type: string;
  size: number;
  onClose?: () => void;
  className?: string;
}

export function FilePreview({ url, name, type, size, onClose, className }: FilePreviewProps) {
  const isImage = type.startsWith("image/");
  const isVideo = type.startsWith("video/");
  const isAudio = type.startsWith("audio/");
  const isText = type.startsWith("text/");
  const isCode = isCodeFile(name);
  const isPdf = type === "application/pdf";

  if (isImage) {
    return <ImagePreview url={url} name={name} onClose={onClose} className={className} />;
  }

  if (isVideo) {
    return <VideoPreview url={url} name={name} size={size} onClose={onClose} className={className} />;
  }

  if (isAudio) {
    return <AudioPreview url={url} name={name} size={size} onClose={onClose} className={className} />;
  }

  if (isText || isCode || isPdf) {
    return <DocumentPreview url={url} name={name} type={type} size={size} onClose={onClose} className={className} />;
  }

  return null;
}

function isCodeFile(filename: string): boolean {
  const codeExtensions = [
    'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'scss',
    'py', 'rb', 'php', 'java', 'c', 'cpp', 'h', 'hpp',
    'go', 'rs', 'swift', 'kt', 'sql', 'sh', 'bash', 'zsh',
    'md', 'txt', 'yml', 'yaml', 'xml', 'env', 'gitignore'
  ];
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return codeExtensions.includes(ext);
}

function ImagePreview({ url, name, onClose, className }: { url: string; name: string; onClose?: () => void; className?: string }) {
  return (
    <div className={cn("relative", className)}>
      <img 
        src={url} 
        alt={name}
        className="w-full rounded-xl"
      />
      {onClose && (
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-2 right-2 bg-white/90 hover:bg-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

function VideoPreview({ url, name, size, onClose, className }: { url: string; name: string; size: number; onClose?: () => void; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative bg-black">
        <video
          ref={videoRef}
          src={url}
          className="w-full max-h-96 object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={false}
        />
        
        {/* Custom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          {/* Progress Bar */}
          <div className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer"
            onClick={(e) => {
              if (videoRef.current) {
                const rect = e.currentTarget.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                videoRef.current.currentTime = pos * duration;
              }
            }}
          >
            <div 
              className="h-full bg-indigo-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skip(-10)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => skip(10)}
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              <span className="text-white text-xs ml-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => videoRef.current?.requestFullscreen()}
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {onClose && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 bg-white/90 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="p-3 bg-gray-50">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500">{formatBytes(size)}</p>
      </div>
    </Card>
  );
}

function AudioPreview({ url, name, size, onClose, className }: { url: string; name: string; size: number; onClose?: () => void; className?: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          controls={false}
          className="hidden"
        />

        <div className="flex items-center gap-4">
          {/* Play Button */}
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 shadow-lg"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>

          {/* Progress & Info */}
          <div className="flex-1">
            {/* Progress Bar */}
            <div className="h-2 bg-white/50 rounded-full mb-2 cursor-pointer"
              onClick={(e) => {
                if (audioRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  audioRef.current.currentTime = pos * duration;
                }
              }}
            >
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
              <p className="text-xs text-gray-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Card>
  );
}

function DocumentPreview({ url, name, type, size, onClose, className }: { url: string; name: string; type: string; size: number; onClose?: () => void; className?: string }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(url);
        const text = await response.text();
        setContent(text.slice(0, 5000)); // Limit to 5000 chars for preview
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    if (url) {
      fetchContent();
    }
  }, [url]);

  const isPdf = type === "application/pdf";
  const language = getLanguageFromFilename(name);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-indigo-100 flex items-center justify-center">
            <FileText className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm truncate">{name}</p>
            <p className="text-xs text-gray-500">{formatBytes(size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              Open Original
            </a>
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-96 overflow-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Loading preview...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-gray-500">
            Unable to preview this file
          </div>
        ) : (
          <div className="bg-gray-900 p-4">
            {isPdf ? (
              <iframe
                src={url}
                className="w-full h-80"
                title={name}
              />
            ) : (
              <pre className="text-sm text-green-400 font-mono overflow-x-auto">
                <code>{content}</code>
              </pre>
            )}
          </div>
        )}
      </div>

      {content && content.length >= 5000 && (
        <div className="p-2 bg-gray-50 border-t text-center text-xs text-gray-500">
          Preview limited to first 5000 characters
        </div>
      )}
    </Card>
  );
}

function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const langMap: Record<string, string> = {
    js: 'javascript', jsx: 'javascript',
    ts: 'typescript', tsx: 'typescript',
    py: 'python', rb: 'ruby',
    php: 'php', java: 'java',
    c: 'c', cpp: 'cpp',
    html: 'html', css: 'css',
    json: 'json', xml: 'xml',
    md: 'markdown', sql: 'sql',
    sh: 'bash', go: 'go',
    rs: 'rust'
  };
  return langMap[ext] || 'text';
}
