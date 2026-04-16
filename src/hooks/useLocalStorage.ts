import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Bug Category 1: Rendering -> Missing dependency in useEffect
  // `storedValue` is NOT in the dependency array. Changes to storedValue
  // won't persist to localStorage unless `key` changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // silently fail
    }
  }, [key]);

  return [storedValue, setStoredValue] as const;
}
