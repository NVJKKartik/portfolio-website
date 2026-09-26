import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import Hall from '@/components/hall/Hall';
import WorkIndex from '@/components/home/WorkIndex';
import Strike from '@/components/home/Strike';
import PlaceTabs from '@/components/home/PlaceTabs';
import { rows, rowYears, walls } from '@/content/hall';
import { profile } from '@/content/profile';
import { journey } from '@/content/journey';
import { posts, splitTitle } from '@/content/writing';
import s from './home.module.css';

const day = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

// One page: the room, then the lights come on for everything I've worked on, the writing, the places,
// and how to reach me.
export default function Home() {
  const years = rows.map(rowYears);
  const [user, domain] = profile.email.split('@');
  const tabs = [...journey].reverse().map(({ id, when, place, role, summary, did }) => ({ id, when, place, role, summary, did }));
  return (
    <>
      <SiteHeader tone="light" hideName />
      <main id="main">
        <div className="dark">
          <Hall rows={rows} years={years} walls={walls} name={profile.fullName} intro={profile.wall} proof={profile.proof} />
        </div>

        <div className={s.lit}>
          <section id="work" className={s.section} aria-labelledby="work-h">
            <h2 id="work-h" className={s.kick}>
              Everything I’ve worked on, newest first
            </h2>
            <WorkIndex rows={rows} years={years} />
          </section>

          <section id="writing" className={s.section} aria-labelledby="writing-h">
            <h2 id="writing-h" className={s.h} aria-label="Posts about what broke.">
              Posts about what <Strike>worked</Strike> broke.
            </h2>
            <ol className={s.titles}>
              {posts.slice(0, 4).map(p => {
                const [setup, turn] = splitTitle(p.title);
                return (
                  <li key={p.slug}>
                    <Link href={`/writing/${p.slug}/`} transitionTypes={['nav-forward']}>
                      <span className={s.ti}>
                        {setup && <span className={s.setup}>{setup} </span>}
                        <span className={s.turn}>{turn}</span>
                      </span>
                      <small>
                        {p.source} · {p.readingMinutes} min · {day(p.date)}
                      </small>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <Link className={s.more} href="/writing/">
              All {posts.length} posts →
            </Link>
          </section>

          <section id="about" className={s.section} aria-labelledby="about-h">
            <h2 id="about-h" className={s.h}>
              One job. Too many tabs.
            </h2>
            <p className={s.sub}>
              Senior engineer and tech lead at Future AGI, where I started as an intern in December 2024. <b>That’s one tab.</b> Click through the
              rest.
            </p>
            <div className={s.about}>
              <div className={s.words}>
                {profile.about.map((t, i) => (
                  <p key={i}>{t}</p>
                ))}
                <p className={s.aside}>Pinned: {new Intl.ListFormat('en-GB').format(profile.fun)}.</p>
              </div>
              <PlaceTabs places={tabs} fun={profile.fun} />
            </div>
          </section>

          <section id="contact" className={`${s.section} ${s.contact}`} aria-labelledby="contact-h">
            <h2 id="contact-h" className={s.kick}>
              One more tab won’t hurt.
            </h2>
            <a className={s.mail} href={`mailto:${profile.email}`}>
              {user}
              <wbr />@{domain}
            </a>
            <p className={s.links}>
              {profile.links.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer me">
                  {l.label} ↗
                </a>
              ))}
            </p>
            <p className={s.receipts}>
              <Link href="/receipts/">Receipts</Link> for every fact on this site.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
