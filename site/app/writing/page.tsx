import type { Metadata } from 'next';
import Link from 'next/link';
import { og } from '@/lib/meta';
import { posts, snapshotAt, splitTitle } from '@/content/writing';
import Paper from '@/components/page/Paper';
import w from './writing.module.css';

const description = 'Posts about agents, evals, tracing and production, usually starting with the bug.';
export const metadata: Metadata = { title: 'Writing', description, openGraph: og('Writing', description) };

const month = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function WritingIndex() {
  const groups = posts.reduce<Record<string, typeof posts>>((acc, x) => {
    (acc[month(x.date)] ??= []).push(x);
    return acc;
  }, {});
  return (
    <Paper current="/#writing">
      <header className={w.head}>
        <p className={w.kick}>Technical writing · {posts.length} posts on DEV and Medium</p>
        <h1>Most of them start with the bug.</h1>
      </header>
      {Object.entries(groups).map(([m, items], k) => (
        <section key={m} className={w.month} aria-labelledby={`m-${k}`}>
          <h2 id={`m-${k}`}>{m}</h2>
          <ol>
            {items.map(x => {
              const [setup, turn] = splitTitle(x.title);
              return (
                <li key={x.slug}>
                  <Link href={`/writing/${x.slug}/`} transitionTypes={['nav-forward']}>
                    <span className={w.ti}>
                      {setup && <span className={w.setup}>{setup} </span>}
                      <span className={w.turn}>{turn}</span>
                    </span>
                    <span className={w.x}>{x.excerpt}</span>
                    <span className={w.meta}>
                      {x.source} · {x.readingMinutes} min
                      <i aria-hidden style={{ width: `${x.readingMinutes * 10}px` }} />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
      <p className={w.snapshot}>
        A snapshot of every DEV post and Medium’s latest ten, taken {snapshotAt.slice(0, 10)}. Older Medium posts are on{' '}
        <a href="https://medium.com/@kartik.nvj">Medium</a>.
      </p>
    </Paper>
  );
}
