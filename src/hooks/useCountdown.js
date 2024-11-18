import { useState, useEffect } from 'react';

export const useCountdown = () => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });

      setProgress(prev => prev + (100 / 60));
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const startCountdown = () => {
    setTimeLeft(60);
    setProgress(0);
    setIsActive(true);
  };

  return {
    isActive,
    timeLeft,
    progress,
    startCountdown
  };
};