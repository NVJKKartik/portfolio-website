import Link from 'next/link';
import type { Exhibit } from '@/content/hall';
import s from './Catalogue.module.css';

/** The room as a plain list: the index, the reduced-motion home, and what search engines read. */
export default function Catalogue({ rows, years }: { rows: Exhibit[][]; years: string[] }) {
  return (
    <div className={s.cat}>
      {rows.map((row, k) => (
        <section key={k} className={s.row} aria-labelledby={`row-${k}`}>
          <h3 id={`row-${k}`} className={s.year}>
            {years[k]}
          </h3>
          <ul>
            {row.map(e => (
              <li key={e.id} data-exhibit={e.id}>
                {e.external ? (
                  <a href={e.href} target="_blank" rel="noreferrer">
                    <b>{e.title} ↗</b>
                    <span>{e.place}</span>
                    <span>{e.when}</span>
                  </a>
                ) : (
                  <Link href={e.href}>
                    <b>{e.title}</b>
                    <span>{e.place}</span>
                    <span>{e.when}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
