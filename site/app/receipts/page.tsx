import type { Metadata } from 'next';
import { og } from '@/lib/meta';
import { sources } from '@/content/sources';
import { snapshotAt } from '@/content/writing';
import Paper from '@/components/page/Paper';
import p from '@/components/page/page.module.css';

const description = 'Where the facts on this site come from, and what on it is illustration rather than evidence.';
export const metadata: Metadata = { title: 'Sources', description, openGraph: og('Sources', description) };

export default function Receipts() {
  return (
    <Paper>
      <header className={p.head}>
        <p className={p.kicker}>Checked September 2026</p>
        <h1>Sources</h1>
        <p className={p.lede}>
          Every factual claim on this site points to one of these. Shared work names the people it was shared with, and preprints are labelled as
          preprints.
        </p>
      </header>
      <div className={p.cols}>
        <h2>Sources</h2>
        <div>
          <ol className={p.list}>
            {Object.values(sources).map(s => (
              <li key={s.id}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
                <small>{s.supports}</small>
              </li>
            ))}
          </ol>
        </div>
        <h2>What isn’t evidence</h2>
        <div>
          <p>
            The Nexus, Centio.AI and Alumni Connect screens are interface studies drawn in 2026 for this site, with sample data. Each project page
            shows the original next to its study.
          </p>
          <p>
            The plates on the other easels illustrate an idea: the diarization lanes, the optimizer curve, the error cluster and the rest are
            drawings, not results. The patent drawing and the Hivemind screenshot are the real things.
          </p>
          <p>
            The “Break the agent” demo is deterministic, runs in your browser, and is modelled on a bug I wrote about. It is not product output, and
            its scores are not benchmark results.
          </p>
          <p>Posts in Writing are my own, snapshotted on {snapshotAt.slice(0, 10)}. The originals on DEV and Medium are canonical.</p>
        </div>
      </div>
    </Paper>
  );
}
