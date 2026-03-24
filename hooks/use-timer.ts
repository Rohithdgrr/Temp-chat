"use client";

import { useState, useEffect } from "react";

export function useTimer(expiresAt: Date | null | undefined) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!expiresAt) {
        return 86400;
      }
      const diff = new Date(expiresAt).getTime() - Date.now();
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
  }, [expiresAt]);

  return {
    timeLeft,
    isExpired: timeLeft <= 0 && expiresAt !== null,
    isExpiringSoon: timeLeft > 0 && timeLeft < 300,
  };
}
