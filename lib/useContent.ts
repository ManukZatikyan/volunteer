'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';

export function useContent<T>(pageKey: string): {
  content: T | null;
  loading: boolean;
  error: string | null;
} {
  const locale = useLocale();
  const [content, setContent] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to fetch from API first
        const response = await fetch(
          `/api/content/${pageKey}?locale=${locale}`
        );

        if (response.ok) {
          const data = await response.json();
          setContent(data.content);
          setLoading(false);
          return;
        }

        // If not found in API, fall back to data files
        // This is handled server-side, so we'll import directly
        // For client components, we need to rely on API
        setLoading(false);
      } catch (err: any) {
        console.error(`Error fetching content for ${pageKey}:`, err);
        setError(err.message || 'Failed to fetch content');
        setLoading(false);
      }
    };

    fetchContent();
  }, [pageKey, locale]);

  return { content, loading, error };
}

