import { journey } from './journey';

// Rabbit holes, not hobbies: each field he went into, and how far down he went, measured by what came
// out of it. When, where and the path down come from the journey stop, so they can't disagree.

type Entry = { stop: string; field: string; depth: string; links: { label: string; href: string }[] };

const entries: Entry[] = [
  {
    stop: 'future-agi',
    field: 'Evaluating AI agents',
    depth: 'A first-author paper that grew into Error Feed',
    links: [
      { label: 'AgentCompass', href: '/work/agentcompass/' },
      { label: 'Error Feed', href: '/work/error-feed/' },
      { label: 'traceAI', href: '/work/traceai/' },
    ],
  },
  {
    stop: 'iit-madras',
    field: 'Markets',
    depth: 'Sentiment research for swing trading',
    links: [{ label: 'Market sentiment', href: '/work/market-sentiment/' }],
  },
  {
    stop: 'nit-puducherry',
    field: 'Medical imaging',
    depth: 'Lung-nodule models about 77% more energy-efficient',
    links: [{ label: 'Lung nodules', href: '/work/lung-nodules/' }],
  },
  {
    stop: 'vocab-ai',
    field: 'Conversation analytics',
    depth: 'The models, and the app people used to run them',
    links: [{ label: 'Conversation analytics', href: '/work/conversation-analytics/' }],
  },
  {
    stop: 'iit-bombay',
    field: 'Classroom speech and learning',
    depth: 'Best Student Paper, IEEE TALE 2024',
    links: [
      { label: 'The paper', href: '/research/speaker-diarization-tale-2024/' },
      { label: 'The T4E chapter', href: '/research/ssmr-triggers-t4e/' },
      { label: 'AffectBots', href: '/work/affectbots/' },
    ],
  },
  {
    stop: 'iiit-dharwad',
    field: 'Building things with friends',
    depth: 'Five builds and a hackathon win',
    links: [
      { label: 'Hivemind', href: '/work/hivemind/' },
      { label: 'Nexus', href: '/work/nexus/' },
      { label: 'Alumni Connect', href: '/work/alumni-connect/' },
    ],
  },
];

export type Hole = Entry & { when: string; place: string; path: string[] };

export const holes: Hole[] = entries.map(e => {
  const j = journey.find(x => x.id === e.stop);
  if (!j) throw new Error(`holes: no journey stop "${e.stop}"`);
  return { ...e, when: j.when, place: j.place, path: j.did };
});

/**
 * Off the clock: what he's poking at outside work, from his own list (2026-09-26), cut to what belongs
 * on a public page. No depth claimed; the specifics are the depth.
 */
export const offClock: { field: string; poke: string }[] = [
  { field: 'Neuroscience', poke: 'Currently reading Behave; the “okay, but why does this happen?” side of biology and psychology.' },
  { field: 'Markets', poke: 'Valuations, market mechanics, and the history of financial scams.' },
  { field: 'Startups', poke: 'Business models, unit economics, and “could this actually be a company?”' },
  { field: 'Hardware', poke: 'GPUs, chips and compute economics. Adult LEGO, except one brick costs ₹3 lakh.' },
  { field: 'F1', poke: 'Ferrari and Leclerc, and the strategy calls more than the zoom. Cricket and football too.' },
  { field: 'Philosophy', poke: 'Free will, consciousness, and why people do what they do.' },
];
