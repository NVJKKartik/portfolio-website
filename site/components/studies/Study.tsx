'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotion } from '@/lib/motion';
import s from './Study.module.css';

export type StudyKind = 'nexus' | 'centio' | 'alumni';
type Controller = { play: () => void; pause: () => void; setState: (n: string) => unknown; zoom: (on: boolean) => void; destroy: () => void };

const load: Record<StudyKind, () => Promise<{ mount: (el: HTMLElement, o?: object) => Promise<Controller> }>> = {
  nexus: () => import('./nexus.js'),
  centio: () => import('./centio.js'),
  alumni: () => import('./alumni.js'),
};
const states: Record<StudyKind, [string, string][]> = {
  nexus: [
    ['calm', 'Calm'],
    ['nudge', 'Nudge'],
    ['cooldown', 'Cool-down'],
  ],
  centio: [
    ['research', 'Researching'],
    ['writing', 'Writing'],
    ['done', 'Draft ready'],
  ],
  alumni: [
    ['start', 'Start'],
    ['filter', 'Filtered'],
    ['ask', 'Referral ask'],
  ],
};

/** A redesigned interface, live. The still image shows until it's on screen; then the real UI takes over. */
export default function Study({ kind, poster, alt, fonts }: { kind: StudyKind; poster: string; alt: string; fonts: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const ctl = useRef<Controller | null>(null);
  const [live, setLive] = useState(false);
  // Phones see a close-up of the panel the story is on; this shows the whole screen instead.
  const [whole, setWhole] = useState(false);
  const { reduced } = useMotion();

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    let gone = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting || ctl.current) return;
        io.disconnect();
        const mod = await load[kind]();
        if (gone) return;
        ctl.current = await mod.mount(el);
        setLive(true);
      },
      { rootMargin: '200px' },
    );
    io.observe(el);
    return () => {
      gone = true;
      io.disconnect();
      ctl.current?.destroy();
      ctl.current = null;
    };
  }, [kind]);

  return (
    <figure className={s.study}>
      <div ref={stage} className={`${s.stage} ${fonts}`} data-whole={whole || undefined}>
        <img src={poster} alt={alt} data-hidden={live || undefined} />
      </div>
      <figcaption className={s.bar}>
        <span>
          <b>Interface study, 2026.</b> Redesigned for this site with sample data. It is not the shipped app.
        </span>
        <span className={s.btns}>
          {!reduced && (
            <button type="button" onClick={() => ctl.current?.play()} disabled={!live}>
              Play the interaction
            </button>
          )}
          <button
            type="button"
            className={s.whole}
            aria-pressed={whole}
            disabled={!live}
            onClick={() => {
              ctl.current?.zoom(whole);
              setWhole(!whole);
            }}
          >
            {whole ? 'Close-up' : 'Whole screen'}
          </button>
          {states[kind].map(([k, label]) => (
            <button key={k} type="button" onClick={() => ctl.current?.setState(k)} disabled={!live}>
              {label}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
