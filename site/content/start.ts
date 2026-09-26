import { exhibitById } from './hall';

// Start here: three works above the full list, his picks (2026-09-26): no AgentCompass (Error Feed
// carries that thread), no college projects, and the ClickHouse migration he was responsible for. The
// line under each says what the work does; the decision behind it is on the record.
const picks = [
  {
    id: 'error-feed',
    side: 'A harness that watches the product',
    line: 'Grouping failed AI runs into issues and investigating each one, without sending every trace to an expensive model.',
  },
  {
    id: 'agent-command-center',
    side: 'A shared AI gateway',
    line: 'Keeping provider-specific tools intact when every provider goes through one door.',
  },
  {
    id: 'annotations-clickhouse',
    side: 'A migration under a live feature',
    line: 'Twenty PRs moving annotations onto ClickHouse before their Postgres tables were dropped, without failing open or running out of memory.',
  },
];

export const startHere = picks.map(p => {
  const e = exhibitById(p.id);
  if (!e) throw new Error(`startHere: no exhibit "${p.id}"`);
  return { ...p, title: e.title, href: e.href, image: e.image };
});
