import { exhibitById } from './hall';
import { researchBySlug } from './research';
import { workBySlug } from './work';

// Start here: three works, three sides of him, above the full list. His picks (2026-09-26): no
// AgentCompass (Error Feed carries that thread) and no college projects. The line under each is the
// headline of the call he made on it.
const picks = [
  { id: 'error-feed', side: 'Engineering' },
  { id: 'agent-command-center', side: 'Infrastructure' },
  { id: 'speaker-diarization-tale-2024', side: 'Research' },
];

export const startHere = picks.map(p => {
  const e = exhibitById(p.id);
  if (!e) throw new Error(`startHere: no exhibit "${p.id}"`);
  const call = (workBySlug(p.id)?.decision ?? researchBySlug(p.id)?.decision)?.title;
  return { ...p, title: e.title, href: e.href, image: e.image, when: e.when, place: e.place, call: call ?? e.caption };
});
