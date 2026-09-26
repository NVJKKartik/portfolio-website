import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { og } from '@/lib/meta';
import { work, workBySlug } from '@/content/work';
import { sources } from '@/content/sources';
import Paper from '@/components/page/Paper';
import SourceList from '@/components/page/SourceList';
import Study from '@/components/studies/Study';
import { studyFonts } from '@/components/studies/fonts';
import TraceDemo from '@/components/work/TraceDemo';
import { placeInHall } from '@/components/record/place';
import r from '@/components/record/record.module.css';

export const dynamicParams = false;
export const generateStaticParams = () => work.map(w => ({ slug: w.slug }));

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const w = workBySlug((await params).slug);
  return w ? { title: w.name, description: w.oneLiner, openGraph: og(w.name, w.oneLiner) } : {};
}

export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const w = workBySlug((await params).slug);
  if (!w) notFound();
  const hall = placeInHall(w.slug);

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
            {w.study ? (
              <Study kind={w.study} poster={w.cover.src} alt={w.cover.alt} fonts={studyFonts} />
            ) : (
              <figure className={r.mount}>
                <img src={w.cover.src} alt={w.cover.alt} />
                {w.cover.caption && <figcaption>{w.cover.caption}</figcaption>}
              </figure>
            )}
          </div>
          <header className={r.tomb}>
            <p className={r.kicker}>
              {w.kind} · {w.place}
            </p>
            <h1>{w.name}</h1>
            <p className={r.when}>{w.years}</p>
            <p className={r.medium}>{w.medium}</p>
            <p className={r.lede}>{w.oneLiner}</p>
            <hr className={r.rule} />
            <h2 className={r.h}>Kartik’s part</h2>
            {w.contribution.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <h2 className={r.h}>Credit</h2>
            <p className={r.credit}>{w.collaborators}</p>
            {w.links.length > 0 && (
              <p className={r.links}>
                {w.links.map(l =>
                  l.href.startsWith('/') ? (
                    <Link key={l.href} href={l.href} transitionTypes={['nav-forward']}>
                      {l.label}
                    </Link>
                  ) : (
                    <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                      {l.label} ↗
                    </a>
                  ),
                )}
              </p>
            )}
          </header>
        </div>

        <div className={r.body}>
          <section>
            <h2>What it’s for</h2>
            <div>
              {w.purpose.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
          <section>
            <h2>Why it was hard</h2>
            <div>
              <p>{w.hard}</p>
            </div>
          </section>
          {w.sections.map(sec => (
            <section key={sec.heading}>
              <h2>{sec.heading}</h2>
              <div>
                {sec.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
          {w.facts.length > 0 && (
            <section>
              <h2>In numbers</h2>
              <div>
                <dl className={r.facts}>
                  {w.facts.map(f => (
                    <div key={f.label}>
                      <dt>{f.value}</dt>
                      <dd>
                        {f.label}.{' '}
                        <a href={sources[f.source].url} target="_blank" rel="noreferrer">
                          Source
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          )}
          {w.code && (
            <section>
              <h2>Getting started</h2>
              <div>
                <figure className={r.code}>
                  <pre>
                    <code>{w.code.source}</code>
                  </pre>
                  <figcaption>{w.code.caption}</figcaption>
                </figure>
              </div>
            </section>
          )}
          {(w.original || w.gallery?.length) && (
            <section>
              <h2>{w.original ? 'The original' : 'More from the project'}</h2>
              <div>
                <div className={r.originals}>
                  {[...(w.original ? [w.original] : []), ...(w.gallery ?? [])].map(g => (
                    <figure key={g.src} data-tall={g.tall || undefined}>
                      <img src={g.src} alt={g.alt} loading="lazy" />
                      {g.caption && <figcaption>{g.caption}</figcaption>}
                    </figure>
                  ))}
                </div>
                {w.original && (
                  <p>The screens above are the project as it was built. The study at the top of this page is a 2026 redesign made for this site.</p>
                )}
              </div>
            </section>
          )}
        </div>

        {w.demo === 'break-the-agent' && (
          <section className={r.demo} aria-labelledby="demo-h">
            <h2 id="demo-h">Try it: break the agent</h2>
            <p>Pick a scenario, click any span to inspect it, then run the evaluation. Watch what the dashboard says while the answer is wrong.</p>
            <TraceDemo />
          </section>
        )}

        <SourceList ids={w.sources} />

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
