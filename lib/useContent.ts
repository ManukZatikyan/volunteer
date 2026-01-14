'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useLoopedLoading } from './useLoopedLoading';

export function useContent<T>(pageKey: string): {
  content: T | null;
  loading: boolean;
  error: string | null;
} {
  const locale = useLocale();
  const [content, setContent] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { loading, startLoading, stopLoading } = useLoopedLoading();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        startLoading();
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
      } catch (err: any) {
        console.error(`Error fetching content for ${pageKey}:`, err);
        setError(err.message || 'Failed to fetch content');
      } finally {
        stopLoading();
      }
    };

    fetchContent();
  }, [pageKey, locale, startLoading, stopLoading]);

  return { content, loading, error };
}

