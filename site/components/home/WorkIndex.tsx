'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Exhibit } from '@/content/hall';
import s from './WorkIndex.module.css';

type Props = { rows: Exhibit[][]; years: string[] };

/**
 * Everything in the hall as a list, newest first: one row per work with what I did under the title.
 * On a wide screen, pointing at or focusing a row turns its plate around in the panel beside the list,
 * the hall's own gesture. The list is the reduced-motion and no-WebGL way in, so it's plain links first.
 * Rows carry data-exhibit (hash links into the hall resolve through it) and never an id of their own.
 */
export default function WorkIndex({ rows, years }: Props) {
  const all = rows.flat();
  const [at, setAt] = useState(all[0].id);
  const e = all.find(x => x.id === at) ?? all[0];
  const point = (id: string) => ({ onPointerEnter: () => setAt(id), onFocus: () => setAt(id) });

  return (
    <div className={s.index}>
      <div className={s.list}>
        {rows.map((row, k) => (
          <section key={k} className={s.period} aria-labelledby={`period-${k}`}>
            <h3 id={`period-${k}`}>{years[k]}</h3>
            <ul>
              {row.map(x => (
                <li key={x.id} data-exhibit={x.id} data-on={x.id === at || undefined}>
                  {x.external ? (
                    <a href={x.href} target="_blank" rel="noreferrer" {...point(x.id)}>
                      <Row x={x} />
                    </a>
                  ) : (
                    <Link href={x.href} transitionTypes={['nav-forward']} {...point(x.id)}>
                      <Row x={x} />
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {/* A preview of the row the pointer or focus is on; the row itself says the same things to a screen reader. */}
      <aside className={s.panel} aria-hidden>
        <div key={e.id} className={s.plate}>
          <img src={e.image.src} alt="" style={{ aspectRatio: e.image.ratio }} />
        </div>
        <h4>{e.title}</h4>
        <p className={s.when}>
          {e.when} · {e.place}
        </p>
        <p className={s.mine}>{e.caption}</p>
        <p className={s.team}>{e.credit}</p>
      </aside>
    </div>
  );
}

function Row({ x }: { x: Exhibit }) {
  return (
    <>
      <img className={s.thumb} src={x.image.src} alt="" loading="lazy" />
      <b>
        {x.title}
        {x.external && ' ↗'}
      </b>
      <span className={s.did}>{x.caption}</span>
      <span className={s.meta}>
        <span>{x.when}</span>
        <span>{x.place}</span>
      </span>
    </>
  );
}
