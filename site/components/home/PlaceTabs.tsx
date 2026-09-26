'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import s from './PlaceTabs.module.css';

export type Place = { id: string; when: string; place: string; role?: string; summary: string; did: string[] };

// Icons for the pinned tabs (the interests in content/profile.ts); anything new gets a plain pin.
const ICONS: Record<string, ReactNode> = {
  F1: (
    <>
      <path d="M3 14V2.5M3 3h9.5l-2 3 2 3H3" />
      <path d="M6 3v6M9 3v6M3 6h9.5" />
    </>
  ),
  Markets: (
    <>
      <path d="M1.5 12.5l4-4.2 3 2.6 5.8-6.4" />
      <path d="M11 4.4h3.4v3.4" />
    </>
  ),
  Economics: (
    <>
      <path d="M2 2v12h12" />
      <path d="M4 4.5c3 0 6 3.5 9 7" />
      <path d="M4 11.5c3-3.5 6-6.5 9-7" />
    </>
  ),
};
const PIN = <path d="M8 1.5v5M5 6.5h6l-1 3H6zM8 9.5v5" />;

/**
 * About, as a browser window: one tab per place, newest first, and they squash as they run out of
 * room, which is the joke. Real tabs: arrow keys move between them, and the panel is labelled by its tab.
 */
export default function PlaceTabs({ places, fun }: { places: Place[]; fun: string[] }) {
  const [at, setAt] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = places[at];
  const onKey = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : e.key === 'Home' ? -at : e.key === 'End' ? places.length - 1 - at : 0;
    if (!d) return;
    e.preventDefault();
    const n = (at + d + places.length) % places.length;
    setAt(n);
    tabs.current[n]?.focus();
  };
  return (
    <div className={s.win}>
      <div className={s.bar}>
        {fun.map(label => (
          <span key={label} className={s.pin} role="img" aria-label={`Pinned: ${label}`} title={label}>
            <svg viewBox="0 0 16 16">{ICONS[label] ?? PIN}</svg>
          </span>
        ))}
        <div className={s.tabs} role="tablist" aria-label="Where I’ve studied and worked" onKeyDown={onKey}>
          {places.map((x, i) => (
            <button
              key={x.id}
              ref={b => {
                tabs.current[i] = b;
              }}
              type="button"
              role="tab"
              id={`tab-${x.id}`}
              aria-selected={i === at}
              aria-controls="place-panel"
              tabIndex={i === at ? 0 : -1}
              title={x.place}
              className={s.tab}
              onClick={() => setAt(i)}
            >
              {x.place}
            </button>
          ))}
        </div>
        <span className={s.plus} aria-hidden>
          +
        </span>
      </div>
      <div className={s.panel} role="tabpanel" id="place-panel" aria-labelledby={`tab-${p.id}`}>
        <p className={s.when}>{p.when}</p>
        <h3>{p.place}</h3>
        {p.role && <p className={s.role}>{p.role}</p>}
        <p className={s.sum}>{p.summary}</p>
        <ul>
          {p.did.map(d => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
