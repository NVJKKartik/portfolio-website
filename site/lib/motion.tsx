'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';

type Prefs = {
  /** OS asks for reduced motion. Scenes render their static composition. */
  reduced: boolean;
  /** Visitor pressed pause. Loops stop; scroll choreography still follows the scrollbar. */
  paused: boolean;
  togglePaused: () => void;
};

const MotionContext = createContext<Prefs>({
  reduced: false,
  paused: false,
  togglePaused: () => {},
});

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};

// External stores: the OS reduced-motion setting and the visitor's saved pause preference.
const REDUCE = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (cb: () => void) => {
  const mq = matchMedia(REDUCE);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const pausedListeners = new Set<() => void>();
const subscribePaused = (cb: () => void) => {
  pausedListeners.add(cb);
  return () => pausedListeners.delete(cb);
};
const serverFalse = () => false;

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCE).matches, serverFalse);
  const paused = useSyncExternalStore(subscribePaused, () => read('kartik:paused') === '1', serverFalse);

  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : paused ? 'paused' : 'full';
  }, [reduced, paused]);

  const togglePaused = useCallback(() => {
    write('kartik:paused', read('kartik:paused') === '1' ? '0' : '1');
    pausedListeners.forEach(l => l());
  }, []);

  const value = useMemo(() => ({ reduced, paused, togglePaused }), [reduced, paused, togglePaused]);
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export const useMotion = () => useContext(MotionContext);
