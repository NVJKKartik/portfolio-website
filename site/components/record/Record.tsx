import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { Exhibit } from '@/content/hall';
import type { Tint } from '@/lib/tint';
import r from './record.module.css';

type TopProps = {
  back: string;
  kicker: string;
  title: string;
  lede: string;
  badge?: string;
  image?: { src: string; alt: string };
  tint: Tint;
};

/** A record's top: its plate on a ground of the plate's own colour, so no two records look alike. */
export function RecordTop({ back, kicker, title, lede, badge, image, tint }: TopProps) {
  return (
    <header className={r.top} style={{ '--tint': tint.bg, '--tint-ink': tint.ink } as CSSProperties}>
      <div className={r.inner}>
        <nav className={r.crumb} aria-label="Back to the hall">
          <Link href={back} transitionTypes={['nav-back']}>
            ← Back to the hall
          </Link>
        </nav>
        <div>
          <p className={r.kicker}>{kicker}</p>
          <h1 data-long={Math.max(...title.split(/[\s-]/).map(w => w.length)) >= 10 || undefined}>{title}</h1>
          {badge && <p className={r.badge}>{badge}</p>}
          <p className={r.lede}>{lede}</p>
        </div>
        {image && (
          <div className={r.plate}>
            <img src={image.src} alt={image.alt} />
          </div>
        )}
      </div>
    </header>
  );
}

/** What I did, in my colour, beside who I made it with, in the team's. */
export function Hands({ did, withTitle, credit, links }: { did: ReactNode; withTitle: string; credit: ReactNode; links?: ReactNode }) {
  return (
    <div className={r.hands}>
      <div className={r.hand}>
        <h2>What I did</h2>
        {did}
        {links && <p className={r.links}>{links}</p>}
      </div>
      <div className={`${r.hand} ${r.team}`}>
        <h2>{withTitle}</h2>
        {credit}
      </div>
    </div>
  );
}

/** One section of the body: its name in the margin. */
export function Sec({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={r.sec}>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
}

/** The hard part, said big. */
export function Hard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <blockquote className={r.hard}>
      <span>{title}</span>
      <div>{children}</div>
    </blockquote>
  );
}

export function NextUp({ next, wrapped }: { next: Exhibit; wrapped?: boolean }) {
  return (
    <Link className={r.next} href={next.href} transitionTypes={['nav-forward']}>
      <img src={next.image.src} alt="" loading="lazy" />
      <span>
        <small>{wrapped ? 'That was the oldest. Back to the newest' : 'Next, a little further back in time'}</small>
        <b>{next.title} →</b>
      </span>
    </Link>
  );
}
