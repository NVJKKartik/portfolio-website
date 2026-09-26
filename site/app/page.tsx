import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import Hall from '@/components/hall/Hall';
import Catalogue from '@/components/hall/Catalogue';
import { places, rows, rowYears } from '@/content/hall';
import { profile } from '@/content/profile';
import { journey } from '@/content/journey';
import { posts } from '@/content/writing';
import s from './home.module.css';

// One page, walked in the order you'd leave a museum: the room, the list of what's in it, the writing,
// the wall text about the person, and the front desk.
export default function Home() {
  const years = rows.map(rowYears);
  return (
    <div className="dark">
      <SiteHeader tone="light" hideName />
      <main id="main">
        <Hall rows={rows} years={years} places={places} name={profile.fullName} intro={profile.wall} proof={profile.proof} />

        <section id="work" className={s.section} aria-labelledby="work-h">
          <div className={s.head}>
            <h2 id="work-h">Work</h2>
            <p>Every work in the room, newest first. Each one opens its full record: what it is, what I did, and who I made it with.</p>
          </div>
          <Catalogue rows={rows} years={years} />
        </section>

        <section id="writing" className={s.section} aria-labelledby="writing-h">
          <div className={s.head}>
            <h2 id="writing-h">Writing</h2>
            <p>Mostly about the gap between a green check and a working system.</p>
          </div>
          <ol className={s.posts}>
            {posts.slice(0, 4).map(x => (
              <li key={x.slug}>
                <Link href={`/writing/${x.slug}/`}>
                  <b>{x.title}</b>
                  <span>
                    {x.source} · {x.readingMinutes} min · {x.date}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className={s.more}>
            <Link href="/writing/">All {posts.length} posts</Link>
          </p>
        </section>

        <section id="about" className={s.section} aria-labelledby="about-h">
          <div className={s.head}>
            <h2 id="about-h">About</h2>
            <p>{profile.role}.</p>
          </div>
          <div className={s.about}>
            <div className={s.words}>
              {profile.about.map((t, i) => (
                <p key={i}>{t}</p>
              ))}
            </div>
            <ol className={s.chrono} aria-label="Chronology">
              {[...journey].reverse().map(stop => (
                <li key={stop.id} id={stop.id}>
                  <span>{stop.when}</span>
                  <b>{stop.place}</b>
                  {stop.role && <em>{stop.role}</em>}
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="contact" className={`${s.section} ${s.contact}`} aria-labelledby="contact-h">
          <div className={s.head}>
            <h2 id="contact-h">Contact</h2>
            <p>
              <a className={s.mail} href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </p>
          </div>
          <ul className={s.links}>
            {profile.links.map(l => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer me">
                  {l.label}
                </a>
                <span>{l.handle}</span>
              </li>
            ))}
          </ul>
          <p className={s.more}>
            <Link href="/receipts/">Where every fact on this site comes from</Link>
          </p>
        </section>
      </main>
    </div>
  );
}
