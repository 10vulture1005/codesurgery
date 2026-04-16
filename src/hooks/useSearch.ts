import { useState, useEffect, useRef } from 'react';
import type { Post } from '../types';
import { api } from '../services/api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Bug Category 6: Event handling - debounce implemented incorrectly
  // The timeout ref is recreated on every render because it's inside useEffect
  // without proper cleanup of the previous timeout before setting a new one.
  // This causes the search to fire multiple times for rapid input changes.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Bug: previous timeout is NOT cleared before setting a new one
    // when query changes rapidly, multiple in-flight requests pile up
    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await api.searchPosts(query);
        // Bug Category 2: Race condition - if a slower earlier request resolves
        // after a faster later one, it overwrites the correct results
        setResults(data);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    // Missing: return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [query]);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return { query, setQuery, results, isLoading, clearSearch };
}
