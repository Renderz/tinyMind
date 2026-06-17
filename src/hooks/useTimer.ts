import { useState, useRef, useCallback } from "react";

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const baseRef = useRef(0);

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      const now = performance.now();
      setElapsed((now - startTimeRef.current + baseRef.current) / 1000);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const start = useCallback(() => {
    startTimeRef.current = performance.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const stop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (startTimeRef.current !== null) {
      baseRef.current += performance.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    startTimeRef.current = null;
    baseRef.current = 0;
    setElapsed(0);
    setIsRunning(false);
  }, []);

  return { elapsed, isRunning, start, stop, reset };
}
