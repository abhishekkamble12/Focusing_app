import { useState, useEffect, useRef, useCallback } from 'react';

export const useTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, focused, paused
  const timerRef = useRef(null);

  const start = useCallback(() => {
    if (!isActive) {
      setIsActive(true);
      setStatus('focused');
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  }, [isActive]);

  const pause = useCallback(() => {
    if (isActive) {
      clearInterval(timerRef.current);
      setIsActive(false);
      setStatus('paused');
    }
  }, [isActive]);

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    setIsActive(false);
    setStatus('idle');
    const finalSeconds = seconds;
    setSeconds(0);
    return finalSeconds;
  }, [seconds]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  return { seconds, isActive, status, start, pause, stop };
};
