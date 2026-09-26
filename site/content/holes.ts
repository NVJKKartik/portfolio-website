import { journey } from './journey';

// Rabbit holes, not hobbies: each field he went into, and how far down he went, measured by what came
// out of it. When, where and the path down come from the journey stop, so they can't disagree.

type Entry = { stop: string; field: string; depth: string; links: { label: string; href: string }[] };

const entries: Entry[] = [
  {
    stop: 'future-agi',
    field: 'Evaluating AI agents',
    depth: 'A first-author paper, a granted patent and the SDKs',
    links: [
      { label: 'AgentCompass', href: '/work/agentcompass/' },
      { label: 'The patent', href: '/research/synthetic-data-patent/' },
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
