import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { og } from '@/lib/meta';
import { research, researchBySlug } from '@/content/research';
import { exhibitById } from '@/content/hall';
import Paper from '@/components/page/Paper';
import SourceList from '@/components/page/SourceList';
import { placeInHall } from '@/components/record/place';
import { Hands, Hard, NextUp, RecordTop, Sec } from '@/components/record/Record';
import { tintOf } from '@/lib/tint';
import r from '@/components/record/record.module.css';

export const dynamicParams = false;
export const generateStaticParams = () => research.map(x => ({ slug: x.slug }));

export async function generateMetadata({ params }: PageProps<'/research/[slug]'>): Promise<Metadata> {
  const x = researchBySlug((await params).slug);
  return x ? { title: x.shortTitle, description: x.question, openGraph: og(x.shortTitle, x.question) } : {};
}

export default async function ResearchPage({ params }: PageProps<'/research/[slug]'>) {
  const x = researchBySlug((await params).slug);
  if (!x) notFound();
  const hall = placeInHall(x.slug);
  const image = exhibitById(x.slug)?.image;
  const tint = image ? await tintOf(image.src) : { bg: 'var(--paper-2)', ink: 'var(--ink)', light: true };
  const max = x.figure ? Math.max(...x.figure.rows.flatMap(row => [row.mine, row.other])) : 1;
  const list = (items: string[]) => (
    <ul>
      {items.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  );

  return (
    <Paper bleed tone={tint.light ? 'dark' : 'light'}>
      <article>
        <RecordTop
          back={hall.back}
          kicker={[x.kind, x.place, x.dateLabel, x.venue !== x.dateLabel ? x.venue : null].filter(Boolean).join(' · ')}
          title={x.shortTitle}
          lede={x.question}
          badge={x.badge}
          image={image}
          tint={tint}
        />
        <Hands
          did={
            <>
              <p>{x.role}</p>
              {x.did && <p>{x.did}</p>}
            </>
          }
          withTitle={x.kind === 'Granted patent' ? 'Inventors' : 'Authors'}
          credit={
            <p>
              {x.authors.map((a, i) => (
                <span key={a.name}>
                  {a.me ? <strong>{a.name}</strong> : a.name}
                  {i < x.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          }
          links={
            <>
              {x.links.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ))}
              {x.relatedWork && (
                <Link href={`/work/${x.relatedWork}/`} transitionTypes={['nav-forward']}>
                  The system
                </Link>
              )}
            </>
          }
        />

        <div className={r.paper}>
          <Sec title="Full title">
            <p>{x.title}</p>
            {x.kind === 'Preprint' && <p>A preprint: not yet peer-reviewed.</p>}
          </Sec>
          <Sec title="In plain words">
            {x.plain.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Sec>
          <Sec title="How it works">{list(x.technical)}</Sec>
          <Sec title="What it established">
            {list(x.established)}
            {x.figure && (
              <figure className={r.tableWrap} style={{ margin: '24px 0 0' }}>
                <table className={r.table}>
                  <caption>{x.figure.caption}</caption>
                  <thead>
                    <tr>
                      <th scope="col">Metric</th>
                      <th scope="col">{x.figure.mineLabel}</th>
                      <th scope="col">{x.figure.otherLabel}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {x.figure.rows.map(row => (
                      <tr key={row.label}>
                        <th scope="row">
                          {row.label}
                          {row.better === 'other' ? ' · baseline better' : ''}
                        </th>
                        <td>
                          <span className={r.barCell}>
                            <span className={r.bar} data-mine style={{ width: `${(row.mine / max) * 70}%` }} />
                            {row.mine.toFixed(3)}
                          </span>
                        </td>
                        <td>
                          <span className={r.barCell}>
                            <span className={r.bar} style={{ width: `${(row.other / max) * 70}%` }} />
                            {row.other.toFixed(3)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </figure>
            )}
          </Sec>
          <Hard title="Where it stops">{list(x.limits)}</Hard>

          <SourceList ids={x.sources} />
          <NextUp next={hall.next} wrapped={hall.wrapped} />
        </div>
      </article>
    </Paper>
  );
}
