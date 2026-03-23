"use client";

import { useState, useEffect, useRef } from "react";

export function useTimer(expiresAt: Date | null | undefined) {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const expiresAtRef = useRef<Date | null | undefined>(expiresAt);

  useEffect(() => {
    expiresAtRef.current = expiresAt;
  }, [expiresAt]);

  useEffect(() => {
    if (!expiresAtRef.current) {
      setTimeLeft(86400);
      return;
    }

    const calculateTimeLeft = () => {
      const diff = expiresAtRef.current!.getTime() - Date.now();
      return Math.max(0, Math.floor(diff / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    timeLeft,
    isExpired: timeLeft <= 0 && expiresAtRef.current !== null,
    isExpiringSoon: timeLeft > 0 && timeLeft < 300,
  };
}
