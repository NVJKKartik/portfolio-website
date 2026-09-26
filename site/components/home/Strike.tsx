'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import s from './Strike.module.css';

/**
 * A red-pencil strike through a word, drawn once when it first scrolls into view. The only one on the
 * site. Under reduced motion it is simply there. The struck word is hidden from screen readers; the
 * heading carries the sentence as it should be read.
 */
export default function Strike({ children }: { children: ReactNode }) {
  const el = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        setDrawn(true);
        io.disconnect();
      },
      { threshold: 1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);
  return (
    <span ref={el} className={s.strike} data-drawn={drawn || undefined} aria-hidden>
      <span className={s.word}>{children}</span>
      <svg viewBox="0 0 100 24" preserveAspectRatio="none">
        <path d="M-2 15 C 18 10, 40 16, 62 11 S 92 12, 103 9" />
        <path d="M1 11 C 24 14, 52 8, 78 13 S 96 10, 101 12" />
      </svg>
    </span>
  );
}
