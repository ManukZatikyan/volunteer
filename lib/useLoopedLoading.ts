'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { LOADING_ANIMATION_DURATION_MS } from './loadingAnimation';

interface UseLoopedLoadingOptions {
  animationDurationMs?: number;
  initiallyLoading?: boolean;
}

/**
 * Maintains a loading flag that only turns off at the end of an animation cycle.
 * - Call startLoading for every pending request (supports parallel requests).
 * - Call stopLoading when a request finishes; loading will stay true until the
 *   current animation loop completes, so the animation never cuts mid-cycle.
 */
export function useLoopedLoading(
  { animationDurationMs = LOADING_ANIMATION_DURATION_MS, initiallyLoading = false }: UseLoopedLoadingOptions = {}
) {
  const [loading, setLoading] = useState(initiallyLoading);
  const pendingCountRef = useRef(initiallyLoading ? 1 : 0);
  const startTimeRef = useRef<number | null>(initiallyLoading ? performance.now() : null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cycleCountRef = useRef(0);

  const clearStopTimeout = useCallback(() => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
  }, []);

  const startLoading = useCallback(() => {
    clearStopTimeout();
    pendingCountRef.current += 1;

    if (pendingCountRef.current === 1) {
      startTimeRef.current = performance.now();
      setLoading(true);
      cycleCountRef.current = 0;
    }
  }, [clearStopTimeout]);

  const stopLoading = useCallback(() => {
    if (pendingCountRef.current === 0) {
      return;
    }

    pendingCountRef.current -= 1;
    if (pendingCountRef.current > 0) {
      return;
    }

    const startedAt = startTimeRef.current ?? performance.now();
    const elapsed = performance.now() - startedAt;
    const totalCycles = Math.ceil(elapsed / animationDurationMs);
    const remainder = elapsed % animationDurationMs;
    const waitTime = remainder === 0 ? 0 : animationDurationMs - remainder;

    clearStopTimeout();
    stopTimeoutRef.current = setTimeout(() => {
      cycleCountRef.current = totalCycles;
      setLoading(false);
      startTimeRef.current = null;
    }, waitTime);
  }, [animationDurationMs, clearStopTimeout]);

  const trackPromise = useCallback(
    async <T,>(promise: Promise<T>): Promise<T> => {
      startLoading();
      try {
        return await promise;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  useEffect(() => {
    return () => {
      clearStopTimeout();
    };
  }, [clearStopTimeout]);

  return { loading, startLoading, stopLoading, trackPromise, animationDurationMs };
}

