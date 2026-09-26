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
import { Hands, Hard, NextUp, RecordTop, Sec } from '@/components/record/Record';
import { tintOf } from '@/lib/tint';
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
  const tint = await tintOf(w.cover.src);

  return (
    <Paper bleed tone={tint.light ? 'dark' : 'light'}>
      <article>
        <RecordTop
          back={hall.back}
          kicker={`${w.kind} · ${w.place} · ${w.years} · ${w.medium}`}
          title={w.name}
          lede={w.oneLiner}
          image={w.study ? undefined : w.cover}
          tint={tint}
        />
        {w.study && (
          <div className={r.study}>
            <Study kind={w.study} poster={w.cover.src} alt={w.cover.alt} fonts={studyFonts} />
          </div>
        )}
        <Hands
          did={w.contribution.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          withTitle="Who I made it with"
          credit={<p>{w.collaborators}</p>}
          links={
            w.links.length > 0 &&
            w.links.map(l =>
              l.href.startsWith('/') ? (
                <Link key={l.href} href={l.href} transitionTypes={['nav-forward']}>
                  {l.label}
                </Link>
              ) : (
                <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                  {l.label} ↗
                </a>
              ),
            )
          }
        />

        <div className={r.paper}>
          <Sec title="What it’s for">
            {w.purpose.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Sec>
          <Hard title="Why it was hard">
            <p>{w.hard}</p>
          </Hard>
          {w.sections.map(sec => (
            <Sec key={sec.heading} title={sec.heading}>
              {sec.body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </Sec>
          ))}
          {w.facts.length > 0 && (
            <Sec title="In numbers">
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
            </Sec>
          )}
          {w.code && (
            <Sec title="Getting started">
              <figure className={r.code}>
                <pre>
                  <code>{w.code.source}</code>
                </pre>
                <figcaption>{w.code.caption}</figcaption>
              </figure>
            </Sec>
          )}
          {(w.original || w.gallery?.length) && (
            <Sec title={w.original ? 'The original' : 'More from the project'}>
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
            </Sec>
          )}

          {w.demo === 'break-the-agent' && (
            <section className={r.demo} aria-labelledby="demo-h">
              <h2 id="demo-h">Try it: break the agent</h2>
              <p>Pick a scenario, click any span to inspect it, then run the evaluation. Watch what the dashboard says while the answer is wrong.</p>
              <TraceDemo />
            </section>
          )}

          <SourceList ids={w.sources} />
          <NextUp next={hall.next} wrapped={hall.wrapped} />
        </div>
      </article>
    </Paper>
  );
}
