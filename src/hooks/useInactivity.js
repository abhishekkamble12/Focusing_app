import { useEffect, useRef } from 'react';

export const useInactivity = (onInactivity, onActivity, timeout = 60000) => {
  const timeoutRef = useRef(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onActivity?.();
    timeoutRef.current = setTimeout(() => {
      onInactivity?.();
    }, timeout);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        onInactivity?.();
      } else {
        onActivity?.();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => document.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      events.forEach(event => document.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

  }, [onInactivity, onActivity, timeout]);
};
