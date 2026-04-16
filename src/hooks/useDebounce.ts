import { useState, useRef, useCallback } from 'react';

export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bug Category 6: Event handling - Debounce swallows the FIRST call
  // The flag starts as true, meaning the very first invocation gets debounced
  // instead of executing immediately (leading-edge debounce is broken)
  const [isWaiting, setIsWaiting] = useState(true);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isWaiting) {
      callback(...args);
      setIsWaiting(true);
    }

    timeoutRef.current = setTimeout(() => {
      setIsWaiting(false);
      callback(...args);
    }, delay);
  }, [callback, delay, isWaiting]);

  return debouncedFn;
}
