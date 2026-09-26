import type { Metadata } from 'next';
import Link from 'next/link';
import { og } from '@/lib/meta';
import { posts, snapshotAt } from '@/content/writing';
import Paper from '@/components/page/Paper';
import p from '@/components/page/page.module.css';
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
      <header className={p.head}>
        <p className={p.kicker}>{posts.length} posts · DEV and Medium</p>
        <h1>Writing</h1>
        <p className={p.lede}>Mostly about the gap between a green check and a working system. Every post links to the original.</p>
      </header>
      <div className={p.cols}>
        {Object.entries(groups).map(([m, items]) => (
          <section key={m} style={{ display: 'contents' }} aria-label={m}>
            <h2>{m}</h2>
            <div>
              <ol className={w.posts}>
                {items.map(x => (
                  <li key={x.slug}>
                    <Link href={`/writing/${x.slug}/`} transitionTypes={['nav-forward']}>
                      <b>{x.title}</b>
                      <span>{x.excerpt}</span>
                      <small>
                        {x.source} · {x.readingMinutes} min · {x.date}
                      </small>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>
      <p className={w.snapshot}>
        A snapshot of every DEV post and Medium’s latest ten, taken {snapshotAt.slice(0, 10)}. Older Medium posts are on{' '}
        <a href="https://medium.com/@kartik.nvj">Medium</a>.
      </p>
    </Paper>
  );
}
