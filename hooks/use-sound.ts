"use client";

import { useCallback, useRef } from "react";

interface SoundOptions {
  volume?: number;
  frequency?: number;
  duration?: number;
}

export function useSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((options: SoundOptions = {}) => {
    const { volume = 0.3, frequency = 800, duration = 100 } = options;
    
    try {
      const ctx = getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      
      gainNode.gain.value = volume;
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
      console.warn("Sound playback failed:", error);
    }
  }, [getAudioContext]);

  const playMessageSound = useCallback(() => {
    playTone({ frequency: 600, duration: 100, volume: 0.2 });
  }, [playTone]);

  const playSendSound = useCallback(() => {
    playTone({ frequency: 800, duration: 80, volume: 0.15 });
  }, [playTone]);

  const playJoinSound = useCallback(() => {
    playTone({ frequency: 500, duration: 150, volume: 0.2 });
    setTimeout(() => playTone({ frequency: 700, duration: 150, volume: 0.2 }), 150);
  }, [playTone]);

  const playLeaveSound = useCallback(() => {
    playTone({ frequency: 400, duration: 200, volume: 0.2 });
  }, [playTone]);

  return {
    playMessageSound,
    playSendSound,
    playJoinSound,
    playLeaveSound,
  };
}
