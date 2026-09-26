import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { og } from '@/lib/meta';
import { research, researchBySlug } from '@/content/research';
import { exhibitById } from '@/content/hall';
import Paper from '@/components/page/Paper';
import SourceList from '@/components/page/SourceList';
import { placeInHall } from '@/components/record/place';
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
  const max = x.figure ? Math.max(...x.figure.rows.flatMap(row => [row.mine, row.other])) : 1;
  const list = (items: string[]) => (
    <ul>
      {items.map((p, i) => (
        <li key={i}>{p}</li>
      ))}
    </ul>
  );

  return (
    <Paper>
      <nav className={r.crumbs} aria-label="Where this hangs">
        <Link href={hall.back} transitionTypes={['nav-back']}>
          ← Back to the hall
        </Link>
        <span>{hall.where}</span>
      </nav>
      <article>
        <div className={r.top}>
          <div className={r.work}>
            {image && (
              <figure className={r.mount}>
                <img src={image.src} alt={image.alt} />
              </figure>
            )}
          </div>
          <header className={r.tomb}>
            <p className={r.kicker}>
              {x.kind} · {x.place}
            </p>
            <h1>{x.shortTitle}</h1>
            <p className={r.when}>{x.dateLabel}</p>
            <p className={r.medium}>{x.venue}</p>
            {x.badge && <p className={r.badge}>{x.badge}</p>}
            <p className={r.lede}>{x.question}</p>
            <hr className={r.rule} />
            <h2 className={r.h}>Kartik’s part</h2>
            <p>{x.role}</p>
            <h2 className={r.h}>{x.kind === 'Granted patent' ? 'Inventors' : 'Authors'}</h2>
            <p className={r.credit}>
              {x.authors.map((a, i) => (
                <span key={a.name}>
                  {a.me ? <strong>{a.name}</strong> : a.name}
                  {i < x.authors.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
            <p className={r.links}>
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
            </p>
          </header>
        </div>

        <div className={r.body}>
          <section>
            <h2>Full title</h2>
            <div>
              <p>{x.title}</p>
              {x.kind === 'Preprint' && <p>A preprint: not yet peer-reviewed.</p>}
            </div>
          </section>
          <section>
            <h2>In plain words</h2>
            <div>
              {x.plain.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
          <section>
            <h2>How it works</h2>
            <div>{list(x.technical)}</div>
          </section>
          <section>
            <h2>What it established</h2>
            <div>
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
            </div>
          </section>
          <section>
            <h2>Where it stops</h2>
            <div>{list(x.limits)}</div>
          </section>
        </div>

        <SourceList ids={x.sources} />

        <nav className={r.next} aria-label="Next in the room">
          <span>Next in the room, further back in time</span>
          <Link href={hall.next.href} transitionTypes={['nav-forward']}>
            {hall.next.title} →
          </Link>
        </nav>
      </article>
    </Paper>
  );
}
