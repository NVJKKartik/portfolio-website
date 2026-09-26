import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { og } from '@/lib/meta';
import { posts, postBySlug } from '@/content/writing';
import Paper from '@/components/page/Paper';
import w from '../writing.module.css';

export const dynamicParams = false;
export const generateStaticParams = () => posts.map(x => ({ slug: x.slug }));

export async function generateMetadata({ params }: PageProps<'/writing/[slug]'>): Promise<Metadata> {
  const x = postBySlug((await params).slug);
  if (!x) return {};
  return {
    title: x.title,
    description: x.excerpt,
    // The original post is the canonical copy.
    alternates: { canonical: x.url },
    openGraph: og(x.title, x.excerpt, { type: 'article', publishedTime: x.date }),
  };
}

const fmt = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default async function Article({ params }: PageProps<'/writing/[slug]'>) {
  const x = postBySlug((await params).slug);
  if (!x) notFound();
  const older = posts[posts.indexOf(x) + 1];

  return (
    <Paper current="/#writing">
      <article className={w.article}>
        <header className={w.articleHead}>
          <Link href="/writing/" transitionTypes={['nav-back']}>
            ← All writing
          </Link>
          <h1>{x.title}</h1>
          <p>
            <time dateTime={x.date}>{fmt(x.date)}</time> · {x.readingMinutes} min read ·{' '}
            <a href={x.url} target="_blank" rel="noreferrer">
              Originally on {x.source} ↗
            </a>
          </p>
        </header>
        {/* Kartik's own posts, snapshotted and sanitised by scripts/snapshot-writing.mjs */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: x.html }} />
        <footer className={w.articleFoot}>
          {x.tags.length > 0 && <p>Tags: {x.tags.join(', ')}</p>}
          <p>
            <a href={x.url}>Comment on {x.source}</a>
          </p>
          {older && (
            <p className={w.older}>
              <span>Older</span>
              <Link href={`/writing/${older.slug}/`} transitionTypes={['nav-forward']}>
                {older.title} →
              </Link>
            </p>
          )}
        </footer>
      </article>
    </Paper>
  );
}
