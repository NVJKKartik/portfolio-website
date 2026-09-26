import type { SourceId } from './sources';

export type Talk = {
  slug: string;
  title: string;
  event: string;
  date: string;
  dateLabel: string;
  place: string;
  role: string;
  credit: string;
  summary: string;
  quote: string;
  href: string;
  source: SourceId;
};

export const speaking: Talk[] = [
  {
    slug: 'harness-engineering-btw-2026',
    title: 'Harness Engineering: Build the Loop Around Agents You Can Trust',
    event: 'Bengaluru Tech Week',
    date: '2026-09-06',
    dateLabel: '6 Sep 2026 · 11:00–13:00 IST',
    place: 'Future AGI, HSR Layout, Bengaluru',
    role: 'One of the hosts.',
    credit: 'Presented by Future AGI with Arvind Narayanamurthy (The Gen Academy).',
    summary:
      'A live build of an agent harness, layer by layer. It starts with a model call that fails, then adds tracing, evaluation gates, guardrails and feedback loops until the agent is one you can trust.',
    quote: 'Model quality is no longer your differentiator, because everyone rents the same models. Harness quality is, because you build it.',
    href: 'https://luma.com/future-bpgk',
    source: 'luma',
  },
];

export type Experiment = {
  name: string;
  year: number;
  note: string;
  href: string;
  kind: 'model' | 'repo' | 'app';
  image?: { src: string; alt: string };
  source: SourceId;
};

// Only public, first-party repos/models. Add new ones here; the Person scene and /archive pick them up.
export const experiments: Experiment[] = [
  {
    name: 'llama2-qlora-hi-7b',
    year: 2023,
    note: 'Llama 2 7B fine-tuned for Hindi with QLoRA. Seven billion parameters, one stubborn language gap.',
    href: 'https://huggingface.co/nvjkkartik/llama2-qlora-hi-7b',
    kind: 'model',
    source: 'huggingface',
  },
  {
    name: 'Multimodal Emotion–Cause Pairs',
    year: 2023,
    note: 'Pairing emotions in a conversation with the utterances that caused them. There’s a Mistral instruct variant on Hugging Face too.',
    href: 'https://github.com/NVJKKartik/Multimodal_Emotion_Cause_Pair',
    kind: 'repo',
    source: 'github',
  },
  {
    name: 'AI Task Allocation',
    year: 2025,
    note: 'A LangChain agent that assigns work across a team by weighing skills, availability, workload and past performance.',
    href: 'https://github.com/NVJKKartik/AI-Task_Allocation',
    kind: 'repo',
    source: 'repoTaskAlloc',
  },
  {
    name: 'Photo-Metadata',
    year: 2024,
    note: 'Google Takeout strips your photo metadata into side files. This script puts it back where it belongs.',
    href: 'https://github.com/NVJKKartik/Photo-Metadata',
    kind: 'repo',
    source: 'github',
  },
  {
    name: 'Quotation-Generator',
    year: 2025,
    note: 'A Streamlit app where an agent turns rough photos of notes into a proper quotation document.',
    href: 'https://github.com/NVJKKartik/Quotation-Generator',
    kind: 'app',
    source: 'github',
  },
  {
    name: 'BlackJack',
    year: 2024,
    note: 'A blackjack game in plain JavaScript. The house still wins.',
    href: 'https://github.com/NVJKKartik/BlackJack_game',
    kind: 'repo',
    source: 'github',
  },
];

// Topics chips in the playground. Each is something the writing or work actually covers.
export const topics = [
  'tracing',
  'evals',
  'RAG',
  'voice agents',
  'MCP',
  'harnesses',
  'DSPy',
  'LangGraph',
  'OpenTelemetry',
  'CI/CD for agents',
  'diarization',
  'Hindi LLMs',
  'SWE-bench',
  'synthetic data',
];
