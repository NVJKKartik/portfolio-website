import Link from 'next/link';
import { sources, type SourceId } from '@/content/sources';
import s from './SourceList.module.css';

export default function SourceList({ ids }: { ids: SourceId[] }) {
  return (
    <section className={s.sources} aria-labelledby="sources-h">
      <h2 id="sources-h">Receipts</h2>
      <ol>
        {[...new Set(ids)].map(id => (
          <li key={id}>
            <a href={sources[id].url} target="_blank" rel="noreferrer">
              {sources[id].label}
            </a>
            <small>{sources[id].supports}</small>
          </li>
        ))}
      </ol>
      <p>
        <Link href="/receipts/">Every source on the site</Link>
      </p>
    </section>
  );
}
