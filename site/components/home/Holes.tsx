'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Hole } from '@/content/holes';
import s from './Holes.module.css';

/**
 * Rabbit holes, newest first: the field, then what came out of it. Opening one shows the way down,
 * with links to the records. All closed to begin with, so the outcomes read as one list; one open at a time.
 */
export default function Holes({ holes }: { holes: Hole[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ol className={s.holes}>
      {holes.map(h => {
        const on = open === h.stop;
        return (
          <li key={h.stop} data-open={on || undefined}>
            <button type="button" aria-expanded={on} aria-controls={`hole-${h.stop}`} onClick={() => setOpen(on ? null : h.stop)}>
              <span className={s.field}>{h.field}</span>
              <span className={s.depth}>{h.depth}</span>
              <span className={s.meta}>
                {h.when} · {h.place}
              </span>
            </button>
            <div id={`hole-${h.stop}`} className={s.down} hidden={!on}>
              <ul>
                {h.path.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <p className={s.links}>
                {h.links.map(l => (
                  <Link key={l.href} href={l.href} transitionTypes={['nav-forward']}>
                    {l.label} →
                  </Link>
                ))}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
