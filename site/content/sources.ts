// Every factual claim on the site points at one of these. Checked on 2026-09-25.
export type Source = { id: string; label: string; url: string; supports: string };

export const sources = {
  arxivAgentCompass: {
    id: 'arxivAgentCompass',
    label: 'arXiv:2509.14647 — AgentCompass (preprint, v1, 18 Sep 2025)',
    url: 'https://arxiv.org/abs/2509.14647',
    supports: 'Title, author order (Kartik first), date, preprint status, abstract.',
  },
  arxivAgentCompassHtml: {
    id: 'arxivAgentCompassHtml',
    label: 'AgentCompass full text (arXiv HTML)',
    url: 'https://arxiv.org/html/2509.14647v1',
    supports: 'Four-stage pipeline, five-category error taxonomy, episodic/semantic memory, TRAIL results table.',
  },
  springerT4E: {
    id: 'springerT4E',
    label: 'Springer — T4E 2024 Proceedings Vol. 2, pp. 43–51',
    url: 'https://link.springer.com/chapter/10.1007/978-981-95-1734-3_6',
    supports: 'Title, author order (Kartik first), series, pages, published online 23 Oct 2025 (via Crossref metadata).',
  },
  crossrefT4E: {
    id: 'crossrefT4E',
    label: 'Crossref metadata for DOI 10.1007/978-981-95-1734-3_6',
    url: 'https://api.crossref.org/works/10.1007/978-981-95-1734-3_6',
    supports: 'Author list, online publication date, page range.',
  },
  ieeeTale: {
    id: 'ieeeTale',
    label: 'IEEE Xplore — Advancing Speaker Diarization With Whisper… (TALE 2024)',
    url: 'https://ieeexplore.ieee.org/document/10834319/',
    supports: 'Method (pyannote + Whisper, custom VAD, embedding clustering), 137 recordings, DER 0.26 vs Deepgram/Otter.',
  },
  taleAwards: {
    id: 'taleAwards',
    label: 'IEEE TALE 2024 — Awards',
    url: 'https://2024.tale-conference.org/awards/',
    supports: 'Best Student Paper; full author order (Aarsh Desai first, Kartik second).',
  },
  iitbAwards: {
    id: 'iitbAwards',
    label: 'IIT Bombay Educational Technology — Awards',
    url: 'https://www.et.iitb.ac.in/about-us/awards',
    supports: 'Independent listing of the TALE 2024 Best Student Paper.',
  },
  badheFollowup: {
    id: 'badheFollowup',
    label: 'Badhe & Rajendran — multimodal follow-up on SSMR triggers (Springer, 2026)',
    url: 'https://link.springer.com/chapter/10.1007/978-3-032-29794-5_69',
    supports: 'The group later proposed extending verbal-only trigger detection with video (posture, head movement).',
  },
  repoNexus: {
    id: 'repoNexus',
    label: 'github.com/hackfest-dev/HF24-Nexus',
    url: 'https://github.com/hackfest-dev/HF24-Nexus',
    supports:
      'Nexus crypto exchange with emotional monitoring (Hackfest 2024). Kartik’s commits: project setup (Vite + React), dashboard/coin/crypto pages, stress metric, market volatility, trade analysis route, mood logging, educational content.',
  },
  repoHivemind: {
    id: 'repoHivemind',
    label: 'github.com/NVJKKartik/Hivemind',
    url: 'https://github.com/NVJKKartik/Hivemind',
    supports:
      'Hivemind (2023, EJS; began as a course project). Kartik’s commits: Firebase PDF upload and rendering, authenticated book reader, discussion forum messaging, notepad, image upload, WebGazer in the book finder. With priyeshgupta14, PlatJack, VinayakRai5.',
  },
  repoAlumni: {
    id: 'repoAlumni',
    label: 'github.com/NVJKKartik/Alumni_connect',
    url: 'https://github.com/NVJKKartik/Alumni_connect',
    supports:
      'Alumni Connect Flutter app (profiles, search, chat, posts, job listings). Contributors: Ashxsh1 (lead), NVJKKartik, VinayakRai5, priyeshgupta14.',
  },
  repoCentio: {
    id: 'repoCentio',
    label: 'github.com/VinayakRai5/Centio.AI',
    url: 'https://github.com/VinayakRai5/Centio.AI',
    supports: 'Centio.AI assistant (chat, assistant tasks, researcher, docs RAG). Kartik is a contributor; his BrainBox repo carries the same app.',
  },
  repoDRS: {
    id: 'repoDRS',
    label: 'github.com/PlatJack/DRS-Hackathon-2',
    url: 'https://github.com/PlatJack/DRS-Hackathon-2',
    supports: 'Emotion detector for online classes, aimed at students with disabilities. Kartik is a contributor.',
  },
  repoTaskAlloc: {
    id: 'repoTaskAlloc',
    label: 'github.com/NVJKKartik/AI-Task_Allocation',
    url: 'https://github.com/NVJKKartik/AI-Task_Allocation',
    supports: 'LangChain task-allocation agent (2025).',
  },
  lidc: {
    id: 'lidc',
    label: 'LIDC-IDRI dataset (The Cancer Imaging Archive)',
    url: 'https://www.cancerimagingarchive.net/collection/lidc-idri/',
    supports: 'Public lung CT dataset used for the NIT Puducherry work.',
  },
  patent: {
    id: 'patent',
    label: 'USPTO Official Gazette — US 12,608,610 B1',
    url: 'https://patentsgazette.uspto.gov/week16/OG/html/1545-3/US12608610-20260421.html',
    supports: 'Title, inventors (Kartik fourth of four), assignee Future AGI Inc., filed 27 May 2025, issued 21 Apr 2026, claim 1.',
  },
  traceaiRepo: {
    id: 'traceaiRepo',
    label: 'github.com/future-agi/traceAI',
    url: 'https://github.com/future-agi/traceAI',
    supports: 'What traceAI is, OpenTelemetry-native, integrations, Apache-2.0 license, contributor ranking.',
  },
  traceaiV1: {
    id: 'traceaiV1',
    label: 'traceAI v1.0.0 release (published by @NVJKKartik, 11 Mar 2026)',
    url: 'https://github.com/future-agi/traceAI/releases/tag/v1.0.0',
    supports: 'Four languages; 46 Python packages, 39 TypeScript packages, 24 Java modules, C# core SDK.',
  },
  traceaiContributors: {
    id: 'traceaiContributors',
    label: 'traceAI contributors graph',
    url: 'https://github.com/future-agi/traceAI/graphs/contributors',
    supports: 'Contributors to traceAI, including Kartik.',
  },
  npm: {
    id: 'npm',
    label: 'npm — ~nvjkkartik',
    url: 'https://www.npmjs.com/~nvjkkartik',
    supports: 'Listed as a maintainer on 54 packages (@traceai/*, @future-agi/*, @agentcc/*) on 2026-09-25.',
  },
  pypi: {
    id: 'pypi',
    label: 'PyPI — nvjkkartik',
    url: 'https://pypi.org/user/nvjkkartik/',
    supports: 'Profile link only; package count not verified (page is bot-protected).',
  },
  huggingface: {
    id: 'huggingface',
    label: 'Hugging Face — nvjkkartik',
    url: 'https://huggingface.co/nvjkkartik',
    supports: 'llama2-qlora-hi-7b (Nov 2023) and Mistral emotion–cause pair model repos.',
  },
  github: {
    id: 'github',
    label: 'GitHub — NVJKKartik',
    url: 'https://github.com/NVJKKartik',
    supports: 'Personal repositories listed under Experiments.',
  },
  dev: {
    id: 'dev',
    label: 'DEV — kartik-nvjk',
    url: 'https://dev.to/kartik-nvjk',
    supports: 'Articles snapshotted into the Writing section.',
  },
  medium: {
    id: 'medium',
    label: 'Medium — @kartik.nvj',
    url: 'https://medium.com/@kartik.nvj',
    supports: 'Articles snapshotted into the Writing section.',
  },
  luma: {
    id: 'luma',
    label: 'Luma — Harness Engineering (Bengaluru Tech Week)',
    url: 'https://luma.com/future-bpgk',
    supports: '6 Sep 2026, 11:00–13:00 IST at Future AGI, HSR Layout; Kartik listed among hosts.',
  },
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/n-v-j-k-kartik-95283823b/',
    supports: 'Profile link only; not machine-readable, nothing on the site is sourced from it.',
  },
  oldPortfolio: {
    id: 'oldPortfolio',
    label: 'Previous portfolio (self-reported)',
    url: 'https://nvjkkartik.netlify.app/',
    supports: 'Self-reported: IIIT Dharwad (Data Science & AI), research at IIT Bombay Educational Technology, CRF approach for SSMR.',
  },
  prEvaluation: {
    id: 'prEvaluation',
    label: 'future-agi/agent-learning-kit PR #13 — Version 1.0.0 (merged 27 Feb 2026)',
    url: 'https://github.com/future-agi/agent-learning-kit/pull/13',
    supports:
      'Unified evaluate() with engine routing, 72+ local metrics, multimodal judge, feedback loop, streaming, OTel spans, distributed backends, uv migration. Authored by Kartik; 38 of 40 commits his, one from nik13.',
  },
  prAgentOpt: {
    id: 'prAgentOpt',
    label: 'future-agi/agent-opt PR #6 — first release to main (merged 2 Oct 2025)',
    url: 'https://github.com/future-agi/agent-opt/pull/6',
    supports:
      'Optimizers shipped (random search, ProTeGi, meta-prompt, GEPA, Bayesian, PromptWizard). Commit authors: Kartik (working prototype, simplified loop, Bayesian search) and azain-commits (most other optimizers, evaluator integration).',
  },
  prSimulate: {
    id: 'prSimulate',
    label: 'future-agi/simulate-sdk PR #4 — chat simulation (merged 30 Dec 2025)',
    url: 'https://github.com/future-agi/simulate-sdk/pull/4',
    supports:
      'Agent wrappers for OpenAI, LangChain, Anthropic, Gemini; tool calls and outputs; traced conversations; timeouts; platform runs; LiveKit engine split out. All 28 commits by Kartik.',
  },
  prAgentcc: {
    id: 'prAgentcc',
    label: 'future-agi/agent-command-center-sdk PR #1 — AgentCC SDK v1.0.0 (merged 22 Apr 2026)',
    url: 'https://github.com/future-agi/agent-command-center-sdk/pull/1',
    supports:
      'Initial public release: agentcc (Python), @agentcc/client, @agentcc/langchain, @agentcc/llamaindex, @agentcc/react, @agentcc/vercel. Authored by Kartik.',
  },
  prGateway: {
    id: 'prGateway',
    label: 'future-agi/future-agi PR #2302 — Anthropic server tools on the OpenAI-format endpoint (merged 25 Aug 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/2302',
    supports:
      'Non-function tools were silently dropped by the Anthropic translator; the fix keeps and replays the caller’s original bytes. Authored by Kartik.',
  },
  prErrorFeed: {
    id: 'prErrorFeed',
    label: 'future-agi/future-agi PR #853 — Error Feed cluster RCA agent, perf sweep, billing (merged 27 Jun 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/853',
    supports:
      'Root-cause agent over ClickHouse traces, streamed Fix tab, cached synthesis, feed API latencies cut 65–92%, billing wiring. Authored by Kartik (70 commits); KarthikAvinashFI, velalagan-pixel, commitPirate and cdileep23 also committed.',
  },
  prAnnotations: {
    id: 'prAnnotations',
    label: 'future-agi/future-agi PR #1495 — ClickHouse-native reads for annotation sources (merged 11 Jul 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/1495',
    supports:
      'Annotation reads of trace, span and session data moved to ClickHouse; tenant-gated, fail-closed; supersedes the drop-safety draft #1214. Authored by Kartik.',
  },
  futureAgiOrg: {
    id: 'futureAgiOrg',
    label: 'github.com/future-agi — open-source repositories',
    url: 'https://github.com/future-agi',
    supports: 'agent-opt, agent-learning-kit, simulate-sdk, agent-command-center-sdk, futureagi-sdk, traceAI.',
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
