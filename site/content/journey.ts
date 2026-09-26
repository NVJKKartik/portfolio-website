import type { SourceId } from './sources';

// Kartik's path, oldest first. Roles come from his previous portfolio; later items from public artifacts.
// Anything unconfirmed (end dates, titles) is tracked in docs/CONTENT-CHECKLIST.md, not shown as fact.

export type Stop = {
  id: string;
  when: string; // display
  sort: string; // ISO-ish for ordering
  /** [start, end]: YYYY-MM, YYYY when only the year is known, or 'now'. Omitted when undated. */
  span?: [string, string];
  place: string;
  role?: string;
  kind: 'study' | 'research' | 'industry' | 'milestone';
  summary: string;
  did: string[];
  work?: string[]; // project slugs
  research?: string[]; // research slugs
  sources: SourceId[];
};

export const journey: Stop[] = [
  {
    id: 'iiit-dharwad',
    span: ['2021', '2025'],
    when: '2021 — 2025',
    sort: '2021',
    place: 'IIIT Dharwad',
    role: 'Data Science & AI',
    kind: 'study',
    summary:
      'Where the early projects happened: hackathons, a campus alumni app and web platforms, mostly built with the same small group of collaborators.',
    did: [
      'Built Hivemind, a study-together web platform, with friends from class.',
      'Worked on Alumni Connect, a Flutter app for the college’s career centre.',
      'Hackathons: an emotion detector for online classes (DRS) and Nexus at Hackfest ’24.',
    ],
    work: ['hivemind', 'alumni-connect', 'emotion-detector', 'nexus'],
    sources: ['oldPortfolio', 'repoHivemind', 'repoAlumni'],
  },
  {
    id: 'iit-bombay',
    span: ['2023-05', '2024-08'],
    when: 'May 2023 — Aug 2024',
    sort: '2023-05',
    place: 'IIT Bombay',
    role: 'Research Associate, Educational Technology',
    kind: 'research',
    summary: 'Classroom AI research: who is speaking, how a group feels, and when it starts regulating its own thinking.',
    did: [
      'Built AffectBots, a multimodal tutoring system that reads audio, video and text to recognise emotion in real time.',
      'Implemented speaker diarization for code-switched classroom audio with pyannote and Whisper. The paper won Best Student Paper at IEEE TALE 2024.',
      'Applied Conditional Random Fields to detect triggers of socially shared regulation in group problem-solving. First author on the T4E paper.',
    ],
    research: ['speaker-diarization-tale-2024', 'ssmr-triggers-t4e'],
    sources: ['oldPortfolio', 'taleAwards', 'springerT4E'],
  },
  {
    id: 'vocab-ai',
    span: ['2023-08', '2024-05'],
    when: 'Aug 2023 — May 2024',
    sort: '2023-08',
    place: 'Vocab.AI',
    role: 'Full Stack Developer Intern',
    kind: 'industry',
    summary: 'Conversation analytics for customer-service teams: the models, the app around them and the APIs underneath.',
    did: [
      'Built speaker diarization and voice emotion recognition models, and the React app people used to run them.',
      'Fine-tuned Llama 2 and GPT-3.5 Turbo for sentiment, topic modelling and conversation scoring.',
      'Wired an automated QA system into customer service workflows, plus the REST APIs behind the analytics.',
    ],
    sources: ['oldPortfolio'],
  },
  {
    id: 'nit-puducherry',
    span: ['2023-12', '2024-01'],
    when: 'Dec 2023 — Jan 2024',
    sort: '2023-12',
    place: 'NIT Puducherry',
    role: 'MLOps Intern, Dept. of CSE',
    kind: 'research',
    summary: 'Making medical imaging models cheap enough to run: same accuracy, a fraction of the energy.',
    did: [
      'Designed energy-efficient models for lung nodule classification and segmentation on LIDC-IDRI, using pruning, quantization and architecture changes.',
    ],
    work: ['lung-nodules'],
    sources: ['oldPortfolio'],
  },
  {
    id: 'iit-madras',
    span: ['2024-06', '2024-08'],
    when: 'Jun 2024 · 3 months',
    sort: '2024-06',
    place: 'IIT Madras · RBCDSAI',
    role: 'Research Intern',
    kind: 'research',
    summary: 'Can the mood of the market help predict it? Multimodal signals for swing trading on Indian equities.',
    did: [
      'Transformer-based sentiment analysis over social media and financial news.',
      'Combined sentiment with technical indicators and fundamentals, and studied how feature selection and time-series models change prediction quality.',
    ],
    sources: ['oldPortfolio'],
  },
  {
    id: 'future-agi',
    span: ['2024-12', 'now'],
    // From Kartik, 2026-09-26: joined as an intern in December 2024, full-time from July 2025.
    when: 'Dec 2024 — now',
    sort: '2024-12',
    place: 'Future AGI',
    role: 'Intern, then full-time from Jul 2025. Now senior engineer and tech lead',
    kind: 'industry',
    summary:
      'Most of the platform and its open-source SDKs: evaluation, Agent Optimizer, simulation, the gateway, Error Feed, and the data and annotation systems underneath.',
    did: [
      'Rewrote the evaluation SDK for 1.0: one evaluate() call routed between local metrics, Turing models and LLM judges.',
      'Built the Error Feed root-cause agent, which investigates a cluster of failing traces and returns a cause, a fix, a confidence and its evidence.',
      'Shipped Agent Optimizer’s first release, chat simulation in Simulate SDK, and the Agent Command Center SDK 1.0.',
      'Moved the annotation system onto ClickHouse, and published traceAI v1.0.0 in four languages.',
      'First author of AgentCompass; co-inventor on a granted US patent; co-hosted a Bengaluru Tech Week session.',
    ],
    work: [
      'ai-evaluation',
      'error-feed',
      'agent-optimizer',
      'chat-simulation',
      'agent-command-center',
      'annotations-clickhouse',
      'open-source',
      'traceai',
      'agentcompass',
    ],
    research: ['agentcompass', 'synthetic-data-patent'],
    sources: [
      'prEvaluation',
      'prErrorFeed',
      'prAgentOpt',
      'prSimulate',
      'prAgentcc',
      'prAnnotations',
      'traceaiV1',
      'arxivAgentCompass',
      'patent',
      'luma',
    ],
  },
];
