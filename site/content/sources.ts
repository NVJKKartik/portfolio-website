// Every factual claim on the site points at one of these. Checked on 2026-09-26.
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
      'Hivemind (2023, EJS; began as a course project). Kartik’s commits: Firebase PDF upload and rendering, authenticated book reader, discussion forum messaging, notepad, image upload, WebGazer in the book finder. With priyeshgupta14, PlatJack (Aarsh Desai), VinayakRai5.',
  },
  repoAlumni: {
    id: 'repoAlumni',
    label: 'github.com/NVJKKartik/Alumni_connect',
    url: 'https://github.com/NVJKKartik/Alumni_connect',
    supports:
      'Alumni Connect Flutter app (profiles, search, chat, posts, job listings). Contributors: Ashxsh1 (Aarsh Desai, lead), NVJKKartik, VinayakRai5, priyeshgupta14.',
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
    supports: 'Kartik is the top contributor: 215 commits, then JayaSurya-27 (145) and sarthakFuture (29), on 26 Sep 2026.',
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
  linkedin: {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/n-v-j-k-kartik-95283823b/',
    supports: 'Profile link only; not machine-readable, nothing on the site is sourced from it.',
  },
  oldPortfolio: {
    id: 'oldPortfolio',
    label: 'Previous portfolio, as it stood before this redesign (self-reported)',
    // The live URL now serves this site, so the evidence points at the old site's source instead.
    url: 'https://github.com/NVJKKartik/portfolio-website/tree/752fffa3636e88060a4353442ef32d41c50faf71/src',
    supports: 'Self-reported: IIIT Dharwad (Data Science & AI), research at IIT Bombay Educational Technology, CRF approach for SSMR.',
  },
  prEvaluation: {
    id: 'prEvaluation',
    label: 'future-agi/agent-learning-kit PR #13 — Version 1.0.0 (merged 27 Feb 2026)',
    url: 'https://github.com/future-agi/agent-learning-kit/pull/13',
    supports:
      'Unified evaluate() with engine routing, 72+ local metrics, multimodal judge, feedback loop, streaming, OTel spans, distributed backends, uv migration. Authored by Kartik; 38 of 39 commits his, one from nik13.',
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
    label: 'future-agi/agent-command-center-sdk PR #1 — AgentCC SDK v1.0.0 and the public repository (merged 22 Apr 2026)',
    url: 'https://github.com/future-agi/agent-command-center-sdk/pull/1',
    supports:
      'v1.0.0 of agentcc (Python), @agentcc/client, @agentcc/langchain, @agentcc/llamaindex, @agentcc/react, @agentcc/vercel, as one commit by Kartik. The SDKs were first written by nik13 in an internal repository and were already on npm and PyPI as 0.1.0 (9 Apr 2026).',
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
      'Root-cause agent over ClickHouse traces (at launch: per-trace summaries on a lite model, the investigation on the main model, ~$0.03–0.08 a run), streamed Fix tab, cached synthesis, billing wiring. Feed endpoints before → after: overview ~1.5 s → 49 ms, trends ~800 ms → 280 ms, sidebar ~1.2 s → 100 ms, list ~1.7 s → 47 ms. Authored by Kartik: 83 of 113 commits. velalagan-pixel (19) built the redesigned Overview and Fix tab UI; the KarthikAvinashFI, commitPirate and cdileep23 commits are unrelated dev-branch fixes carried in by a merge. The agent itself is in ee (internal ee#121, all 54 commits by Kartik).',
  },
  prsClickhouse: {
    id: 'prsClickhouse',
    label: 'future-agi/future-agi — Kartik’s merged annotation and ClickHouse PRs',
    url: 'https://github.com/future-agi/future-agi/pulls?q=is%3Apr+is%3Amerged+author%3ANVJKKartik',
    supports:
      '20 merged PRs, 3–31 Jul 2026: 16 on annotations, 4 on Error Feed and its scanner. Annotation reads to ClickHouse: #1427, #1495, #1604, #1607. Error Feed: #1510, #1644. Memory: #1160, #1434 (annotations), #1373, #1455 (trace scanner). Project scoping: #1565. Queue performance: #1591, #1593, #1831, #1852, #1861, #1865, #1871, #1876, #1878. The link lists all of Kartik’s merged PRs in the repository, not only these 20.',
  },
  prErrorFeedCH: {
    id: 'prErrorFeedCH',
    label: 'future-agi/future-agi PR #1510 — make Error Feed ClickHouse-native (merged 11 Jul 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/1510',
    supports:
      'Every feed read, the deep-analysis worker and the live scanner moved to ClickHouse to survive the tracer Postgres-table drop; proven by dropping the tables in tests and renaming them away on a live stack. Authored by Kartik.',
  },
  prErrorFeedPerf: {
    id: 'prErrorFeedPerf',
    label: 'future-agi/future-agi PR #1644 — prune feed ClickHouse reads (merged 18 Jul 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/1644',
    supports:
      'Benchmarked on a 10M-row spans table: list 19.7 s → ~150 ms, cluster detail 17 s → ~200 ms, overview 15–17 s → ~200 ms, trends 14–24 s → ~160 ms, traces tab >30 s → ~150 ms. Authored by Kartik.',
  },
  prErrorFeedGrouping: {
    id: 'prErrorFeedGrouping',
    label: 'future-agi/future-agi PR #2979 — grouping, scored evals and causal breadcrumbs (merged 23 Sep 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/2979',
    supports:
      'Grouping on by default for eligible projects, with a kill-switch and budget controls; choice, threshold and numeric eval failures eligible for clustering; each finding shows its origin, decisive and symptom steps. Authored by Kartik (21 of 23 commits; atharva-bhange 2). Merged into a stacked branch and released in v1.40.0 (23 Sep 2026); the PR notes quality at scale was still to be verified after deployment.',
  },
  prAnnotations: {
    id: 'prAnnotations',
    label: 'future-agi/future-agi PR #1495 — ClickHouse-native reads for annotation sources (merged 11 Jul 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/1495',
    supports:
      'Annotation reads of trace, span and session data moved to ClickHouse; tenant-gated, fail-closed; lean batched reads; supersedes the drop-safety draft #1214, which guarded the Postgres reads instead of removing them. 575 annotation tests passing across 12 suites. Authored by Kartik.',
  },
  pypiTraceai: {
    id: 'pypiTraceai',
    label: 'PyPI Stats — fi-instrumentation-otel',
    url: 'https://pypistats.org/packages/fi-instrumentation-otel',
    supports: 'traceAI’s core Python instrumentation package: 14,383 downloads in the month to 26 Sep 2026 (traceai-openai: 11,864).',
  },
  ghTraceai: {
    id: 'ghTraceai',
    label: 'GitHub — future-agi/traceAI',
    url: 'https://github.com/future-agi/traceAI/stargazers',
    supports: '222 stars and 44 forks on 26 Sep 2026.',
  },
  ghPlatform: {
    id: 'ghPlatform',
    label: 'GitHub — future-agi/future-agi',
    url: 'https://github.com/future-agi/future-agi/stargazers',
    supports: 'The open-source platform repository Error Feed and the annotation reads ship in: 2,077 stars and 644 forks on 26 Sep 2026.',
  },
  prSimulateV1: {
    id: 'prSimulateV1',
    label: 'future-agi/simulate-sdk PR #1 — Version 0.1.1, the first release (merged 9 Oct 2025)',
    url: 'https://github.com/future-agi/simulate-sdk/pull/1',
    supports:
      'Simulate SDK’s first version, all 20 commits by Kartik from the repository’s initial commit (6 Oct 2025): LiveKit integration, RTC, transcription, call recording, the simulated-customer agent definition, end-call handling. Released as agent-simulate 0.1.1 on PyPI (9 Oct 2025). Kartik has 60 of the repository’s 70 commits (26 Sep 2026).',
  },
  traceaiSdks: {
    id: 'traceaiSdks',
    label: 'future-agi/traceAI — Kartik’s merged PRs, including the v1 SDKs (#127–#131) and TypeScript support (#9)',
    url: 'https://github.com/future-agi/traceAI/pulls?q=is%3Apr+is%3Amerged+author%3ANVJKKartik',
    supports:
      'All authored by Kartik: C# SDK (#127, 10 of 10 commits), Java SDK (#128, 7 of 7), 31 new TypeScript packages (#129), TypeScript move to gen_ai conventions (#130), 23 new Python instrumentors (#131), merged 23–24 Feb 2026. TypeScript support (#9, merged 20 May 2025): FITracer, register, OpenAI, Anthropic and LangChain instrumentation, 28 of 32 commits (sarthakFuture 4). The v1.0.0 notes say TypeScript grew from 8 packages to 39.',
  },
  prErrorFeedReadPath: {
    id: 'prErrorFeedReadPath',
    label: 'future-agi/future-agi PR #2019 — scanner and cluster-RCA port, deterministic RCA read path (merged 7 Aug 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/2019',
    supports:
      'Measured on a live production run: ClickHouse was 551 ms of a five-minute investigation and 88% of wall clock was model turns. The read tool stopped sending the span tree to a cheaper model; it renders budgeted verbatim I/O deterministically, budgeted per trace with failing spans first, plus a 90 s per-turn deadline. Authored by Kartik (21 of 24 commits; 3 ported from hadarishav’s scanner branch).',
  },
  prErrorFeedV2: {
    id: 'prErrorFeedV2',
    label: 'future-agi/future-agi PR #2942 — Error Feed investigation handoff (merged 23 Sep 2026, released in v1.40.0)',
    url: 'https://github.com/future-agi/future-agi/pull/2942',
    supports:
      'Opt-in traces are handed to a separate investigation worker; durable investigation jobs, normalized findings and evidence are stored and read back in Error Feed and cluster RCA; legacy scans are backfilled. Authored by Kartik (32 of 32 commits). In the v1.40.0 release (23 Sep 2026), 47 of 59 commits are Kartik’s and 12 are atharva-bhange’s (grouping jobs, severity and fix-layer assessments).',
  },
  prGatewayOtlp: {
    id: 'prGatewayOtlp',
    label: 'future-agi/future-agi PR #2186 — gateway traces over OTLP/HTTP with prompts and completions (merged 18 Aug 2026, v1.28.0)',
    url: 'https://github.com/future-agi/future-agi/pull/2186',
    supports:
      'An OTLP/HTTP exporter (the otel plugin could only print spans to stdout); bodies behind otel.include_bodies, redacted before truncation; byte-bounded batches; streamed completions assembled; image, embedding, rerank, search and OCR bodies. The stacked #2183, #2187 and #2188 were collapsed into it. Authored by Kartik (11 of 11 commits).',
  },
  prGatewayPlugins: {
    id: 'prGatewayPlugins',
    label: 'future-agi/future-agi PR #2231 — run the plugin pipeline on /v1/messages and Gemini generateContent (merged 21 Aug 2026)',
    url: 'https://github.com/future-agi/future-agi/pull/2231',
    supports:
      'Those two handlers never called the plugin engine, so Anthropic-SDK and Google-GenAI-SDK traffic had no span, request log, cost, budget, credits or rate limits. Fixed on all eight paths, with a regression test over all 11 billable handlers. Authored by Kartik.',
  },
  npmAgentcc: {
    id: 'npmAgentcc',
    label: 'npm — @agentcc/client versions',
    url: 'https://www.npmjs.com/package/@agentcc/client?activeTab=versions',
    supports: '0.1.0 published 9 Apr 2026 by azainfi; 1.0.0 published 22 Apr 2026 by nvjkkartik. PyPI agentcc: 0.1.0 on 9 Apr, 1.0.0 on 22 Apr 2026.',
  },
  futureAgiOrg: {
    id: 'futureAgiOrg',
    label: 'github.com/future-agi — open-source repositories',
    url: 'https://github.com/future-agi',
    supports: 'agent-opt, agent-learning-kit, simulate-sdk, agent-command-center-sdk, futureagi-sdk, traceAI.',
  },
} satisfies Record<string, Source>;

export type SourceId = keyof typeof sources;
