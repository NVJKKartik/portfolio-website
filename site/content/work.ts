import type { SourceId } from './sources';

export type Kind = 'AI engineering' | 'Platform engineering' | 'Open source' | 'Research system' | 'Full-stack' | 'Hackathon' | 'Applied research';

/** `ratio` is width / height; plates default to 4:5. */
export type Img = { src: string; alt: string; caption?: string; tall?: boolean; ratio?: number };

export type Work = {
  slug: string;
  name: string;
  /** Shorter name for the plan and tight labels. */
  short?: string;
  years: string;
  /** Tombstone line: where the work happened and what it is made of. */
  place: string;
  medium: string;
  sort: string;
  kind: Kind;
  /** What it was, in one breath. */
  oneLiner: string;
  /** Why it was interesting or hard. */
  hard: string;
  purpose: string[];
  contribution: string[];
  /** The easel caption, when the first sentence of `contribution` is too long for it. A subset of that sentence. */
  caption?: string;
  collaborators: string;
  cover: Img;
  gallery?: Img[];
  facts: { value: string; label: string; source: SourceId }[];
  sections: { heading: string; body: string[] }[];
  code?: { lang: string; caption: string; source: string };
  links: { label: string; href: string }[];
  sources: SourceId[];
  relatedResearch?: string;
  /** Deeper interactive on the case study page. */
  demo?: 'break-the-agent';
  /** A 2026 redesigned interface study replaces the dated screenshot; `original` keeps the real one. */
  study?: 'nexus' | 'centio' | 'alumni';
  original?: Img;
};

export const work: Work[] = [
  {
    slug: 'traceai',
    name: 'traceAI',
    years: '2025 — now',
    place: 'Future AGI',
    medium: 'Python · TypeScript · Java · C# · OpenTelemetry',
    sort: '2025-04',
    kind: 'AI engineering',
    oneLiner:
      'Open-source, OpenTelemetry-native tracing for AI apps: every LLM call, prompt, token, retrieval and agent decision recorded as a span.',
    hard: 'Four languages, dozens of frameworks, one vocabulary. A span has to mean the same thing whether it came from LangChain in Python or Spring AI in Java.',
    purpose: [
      'Normal monitoring sees an agent as one HTTP request. Inside that request the agent retrieved documents, called a model twice and picked a tool, and any of those steps can fail while the request still returns 200.',
      'traceAI instruments the frameworks people already use, so each of those steps becomes a span in a standard OpenTelemetry trace that any OTel backend can read.',
    ],
    contribution: [
      'I published the v1.0.0 release, which took traceAI from Python-first to SDKs in four languages: Python, TypeScript, Java and C#.',
      'I’m listed as a maintainer on the npm packages, including @traceai/fi-semantic-conventions, the shared vocabulary behind every SDK.',
    ],
    collaborators: 'Built with the Future AGI team, including JayaSurya-27, sarthakFuture and nik13.',
    cover: { src: '/media/plates/traceai.webp', alt: 'Plate: one tracing vocabulary across Python, TypeScript, Java and C#.' },
    gallery: [
      {
        src: '/media/work/platform.webp',
        alt: 'Future AGI platform banner from the traceAI README: simulations, agents, evaluate, optimize, monitor.',
        caption: 'From the traceAI README.',
      },
    ],
    facts: [
      { value: '4', label: 'languages in v1.0.0', source: 'traceaiV1' },
      { value: '46 / 39 / 24', label: 'Python packages / TypeScript packages / Java modules at v1', source: 'traceaiV1' },
      { value: '54', label: 'npm packages listing me as a maintainer', source: 'npm' },
    ],
    sections: [
      {
        heading: 'Why one standard matters',
        body: [
          'A trace is only useful if you can compare it: same step, same attribute names, across a Python service and a Java one. v1 put unified semantic conventions across all four SDKs.',
        ],
      },
      {
        heading: 'What it covers',
        body: [
          'LLM providers (OpenAI, Anthropic, Vertex AI, Bedrock, Mistral, Groq and more), agent frameworks (LangChain, LlamaIndex, CrewAI, AutoGen, OpenAI Agents, Spring AI, LangChain4j), vector databases (Pinecone, Chroma, Qdrant, Weaviate, Milvus, pgvector…) and tools such as Guardrails, Instructor, MCP, Pipecat and LiveKit.',
        ],
      },
    ],
    code: {
      lang: 'python',
      caption: 'The Python quick start from the traceAI README.',
      source: `from fi_instrumentation import register
from fi_instrumentation.fi_types import ProjectType
from traceai_openai import OpenAIInstrumentor

trace_provider = register(
    project_type=ProjectType.OBSERVE,
    project_name="my_ai_app",
)
OpenAIInstrumentor().instrument(tracer_provider=trace_provider)`,
    },
    links: [
      { label: 'GitHub', href: 'https://github.com/future-agi/traceAI' },
      { label: 'v1.0.0 release notes', href: 'https://github.com/future-agi/traceAI/releases/tag/v1.0.0' },
    ],
    sources: ['traceaiRepo', 'traceaiV1', 'traceaiContributors', 'npm'],
  },
  {
    slug: 'agentcompass',
    name: 'AgentCompass',
    years: '2025',
    place: 'Future AGI',
    medium: 'arXiv 2509.14647 · preprint',
    sort: '2025-09',
    kind: 'Research system',
    oneLiner:
      'An evaluator that reads production agent traces the way an experienced debugger would: find the error, name it, cluster it, score it, say what to fix first.',
    hard: 'Production failures are rarely one bug. They are patterns spread across thousands of runs, and the evaluator has to remember what it has already seen.',
    purpose: [
      'Pre-launch evals test the cases you thought of. Production is full of the ones you didn’t. AgentCompass is built for after deployment, when the question stops being “does it pass?” and becomes “what is it doing wrong, and how often?”',
    ],
    contribution: [
      'First author of the paper, with Garvit Sapra, Rishav Hada and Nikhil Pareek.',
      'The “Break the agent” demo on this page is my own illustration of the idea, built from a real bug I wrote about. It isn’t the product and it isn’t benchmark data.',
    ],
    collaborators: 'Garvit Sapra, Rishav Hada and Nikhil Pareek (Future AGI).',
    cover: {
      src: '/media/plates/agentcompass.webp',
      alt: 'Plate: the AgentCompass pipeline and its five error categories.',
    },
    gallery: [
      {
        src: '/media/work/ac-trace.webp',
        alt: 'A trace tree from an agent run, with nested LLM calls, tool calls and timings.',
        caption: 'A traced agent run, from the paper.',
        tall: true,
      },
      {
        src: '/media/work/ac-recs.webp',
        alt: 'Evaluation panel with scores per dimension, detected issue types and a recommended fix.',
        caption: 'Scores, issue clusters and a recommended fix, from the paper.',
      },
      { src: '/media/work/ac-paper.webp', alt: 'First page of the AgentCompass paper on arXiv.', caption: 'arXiv:2509.14647' },
    ],
    facts: [
      { value: '4', label: 'stages: identify → cluster → score → summarise', source: 'arxivAgentCompassHtml' },
      { value: '5', label: 'top-level error categories in the taxonomy', source: 'arxivAgentCompassHtml' },
      { value: '0.657', label: 'GAIA localisation accuracy on TRAIL (Gemini-2.5-Pro: 0.546)', source: 'arxivAgentCompassHtml' },
    ],
    sections: [
      {
        heading: 'Memory',
        body: [
          'Episodic memory keeps what was found in a single trace. Semantic memory keeps what generalises, so the tenth occurrence of a failure across a fleet of agents is recognised as a pattern, not a new mystery.',
        ],
      },
      {
        heading: 'Where it fell short',
        body: [
          'On TRAIL it was best at locating errors, but Gemini-2.5-Pro was better at naming the category and correlated slightly better with human scores. The paper is a preprint. The research page has the full table.',
        ],
      },
    ],
    links: [
      { label: 'Paper (arXiv)', href: 'https://arxiv.org/abs/2509.14647' },
      { label: 'Research notes', href: '/research/agentcompass/' },
    ],
    sources: ['arxivAgentCompass', 'arxivAgentCompassHtml'],
    relatedResearch: 'agentcompass',
    demo: 'break-the-agent',
  },
  {
    slug: 'nexus',
    name: 'Nexus',
    years: '2024',
    place: 'IIIT Dharwad · Hackfest ’24',
    medium: 'Vite · React',
    sort: '2024-04',
    kind: 'Hackathon',
    oneLiner:
      'A crypto exchange built for Hackfest ’24 that watches the trader as well as the market: mood tracking, stress read from trade metrics, and nudges to step away.',
    hard: 'Turning “emotional well-being” into something software can act on, using signals a trading app already has, inside a hackathon clock.',
    purpose: [
      'Most trading apps are designed to keep you trading. Nexus flipped that: it tracked mood, estimated stress from trading behaviour, suggested breaks and limits, and put education and risk tools next to the exchange.',
    ],
    contribution: [
      'Built in a hackathon with Vinayak Rai, Priyesh Gupta and Aarsh Desai. I set up the Vite + React app and built the dashboard and coin pages, the stress metric, the market-volatility and trade-analysis routes, mood logging, and the educational content.',
    ],
    collaborators: 'Vinayak Rai, Priyesh Gupta, Aarsh Desai.',
    cover: {
      src: '/media/studies/nexus.webp',
      ratio: 1.6,
      alt: 'Interface study: a Nexus trading screen with the market and the trader’s stress on one time axis, and a “Take ten?” nudge.',
    },
    study: 'nexus',
    original: {
      src: '/media/work/nexus.webp',
      alt: 'The 2024 Nexus landing page: “Buy & Sell Digital Assets In The Nexus” with coin illustrations and a price ticker.',
    },
    facts: [],
    sections: [
      {
        heading: 'Features',
        body: [
          'Emotional monitoring, interventions and safeguards, educational support, anxiety reduction and risk management, on top of a working exchange UI.',
        ],
      },
    ],
    links: [{ label: 'GitHub', href: 'https://github.com/hackfest-dev/HF24-Nexus' }],
    sources: ['repoNexus', 'oldPortfolio'],
  },
  {
    slug: 'centio',
    name: 'Centio.AI',
    years: '2024',
    place: 'IIIT Dharwad',
    medium: 'RAG · agents',
    sort: '2024-04',
    kind: 'Full-stack',
    oneLiner:
      'An AI assistant that mixes chat with real productivity: an assistant that turns requests into tasks, a researcher that writes sourced docs, and RAG over your own files.',
    hard: 'Getting an assistant to do multi-step work (search, write, file) without losing the thread, while still feeling like a normal notes-and-docs app.',
    purpose: [
      'Regular chat for quick questions. An assistant mode that turns a request into a task list and works through it. A researcher with configurable depth and time that produces a doc with its sources. And document chat backed by retrieval.',
    ],
    contribution: ['I contributed to the app with Vinayak Rai, whose repository it lives in. My BrainBox repository carries the same codebase.'],
    collaborators: 'Vinayak Rai (lead), Vivaan Sharma.',
    cover: {
      src: '/media/studies/centio.webp',
      ratio: 1.6,
      alt: 'Interface study: Centio.AI’s researcher writing a cited document, with its plan and sources beside it.',
    },
    study: 'centio',
    original: {
      src: '/media/work/centio.webp',
      alt: 'The 2024 Centio.AI home screen: “Research your favorite topic” with upload, convert and share options.',
    },
    facts: [],
    sections: [],
    links: [
      { label: 'Centio.AI on GitHub', href: 'https://github.com/VinayakRai5/Centio.AI' },
      { label: 'BrainBox', href: 'https://github.com/NVJKKartik/Brainbox' },
    ],
    sources: ['repoCentio', 'oldPortfolio'],
  },
  {
    slug: 'hivemind',
    name: 'Hivemind',
    years: '2023',
    place: 'IIIT Dharwad',
    medium: 'Node · EJS · Firebase',
    sort: '2023-02',
    kind: 'Full-stack',
    oneLiner: 'A web platform for studying together instead of side by side. Server-rendered with Node and EJS.',
    hard: 'An early full-stack build with four people committing to one codebase, and a landing page that had to sell the idea in one line.',
    purpose: ['Hivemind was built around the promise on its landing page: study smarter by collaborating with students around the world.'],
    contribution: [
      'Built with Priyesh Gupta, Aarsh Desai and Vinayak Rai. I built the document side: PDF uploads stored in Firebase and rendered back, an authenticated book reader, discussion-forum messaging, a notepad, and WebGazer eye tracking in the book finder.',
    ],
    collaborators: 'Priyesh Gupta, Aarsh Desai, Vinayak Rai.',
    cover: {
      src: '/media/work/hivemind.webp',
      ratio: 1400 / 766,
      alt: 'Hivemind landing page: “Study Smarter With HiveMind” over a dark background with a red light streak.',
    },
    facts: [],
    sections: [],
    links: [{ label: 'GitHub', href: 'https://github.com/NVJKKartik/Hivemind' }],
    sources: ['repoHivemind'],
  },
  {
    slug: 'alumni-connect',
    name: 'Alumni Connect',
    years: '2023',
    place: 'IIIT Dharwad',
    medium: 'Flutter',
    sort: '2023-12',
    kind: 'Full-stack',
    oneLiner: 'A Flutter app for IIIT Dharwad’s career centre: alumni profiles and search, chat, a social feed, and job and internship listings.',
    hard: 'A social network, a job board and messaging in one mobile app, for a community whose members only overlap for a few years at a time.',
    purpose: [
      'The goal was to make the alumni network something current students could actually use: find people, talk to them, and see the opportunities they post.',
    ],
    contribution: ['I worked on the app with Aarsh Desai, who led it, and with Vinayak Rai and Priyesh Gupta.'],
    collaborators: 'Aarsh Desai (lead), Vinayak Rai, Priyesh Gupta.',
    cover: {
      src: '/media/studies/alumni.webp',
      ratio: 1.6,
      alt: 'Interface study: three Alumni Connect screens: people search with filters, a profile with a referral request, and jobs posted by alumni.',
    },
    study: 'alumni',
    original: { src: '/media/work/alumni-feed.webp', alt: 'The 2023 Alumni Connect feed with a post from an alumnus.', tall: true },
    gallery: [
      { src: '/media/work/alumni-jobs.webp', alt: 'The 2023 Alumni Connect jobs screen listing internship and job opportunities.', tall: true },
    ],
    facts: [],
    sections: [],
    links: [{ label: 'GitHub', href: 'https://github.com/NVJKKartik/Alumni_connect' }],
    sources: ['repoAlumni', 'oldPortfolio'],
  },
  {
    slug: 'emotion-detector',
    name: 'Emotion detector for online classes',
    short: 'Emotion detector',
    years: '2023 · 48 hours',
    place: 'DRS hackathon',
    medium: 'Computer vision',
    sort: '2023-04',
    kind: 'Hackathon',
    oneLiner:
      'A facial-expression model that flags how students are doing during online classes, so teachers know who might need extra support. Built for students with disabilities, in 48 hours.',
    hard: 'The framing mattered as much as the model: the output is a prompt for a teacher to check in, not a grade for a student.',
    purpose: [
      'The team started from a hard number: according to UNICEF, only 61% of children with disabilities aged 5 to 19 in India attend school. The model watches for emotion and behaviour patterns during online classes and surfaces students who may be struggling.',
    ],
    contribution: ['Part of the hackathon team. We took first place.'],
    collaborators: 'AryanTN05, Vinayak Rai, Priyesh Gupta, Rohith Yadav, Aarsh Desai.',
    cover: {
      src: '/media/plates/emotion-detector.webp',
      alt: 'Plate: a grid of students in an online class, one marked for the teacher to check in with.',
    },
    facts: [],
    sections: [],
    links: [{ label: 'GitHub', href: 'https://github.com/PlatJack/DRS-Hackathon-2' }],
    sources: ['repoDRS', 'oldPortfolio'],
  },
  {
    slug: 'lung-nodules',
    name: 'Energy-efficient lung nodule analysis',
    short: 'Lung nodules',
    years: 'Dec 2023 — Jan 2024',
    place: 'NIT Puducherry',
    medium: 'LIDC-IDRI · pruning · quantization',
    sort: '2023-12',
    kind: 'Applied research',
    oneLiner:
      'Lung nodule classification and segmentation models on the LIDC-IDRI CT dataset, redesigned to use a fraction of the energy and memory without losing accuracy.',
    hard: 'In medical imaging the usual move is a bigger model. The interesting constraint was the opposite: the same answer, with far less compute.',
    purpose: [
      'Done during my internship at NIT Puducherry’s CSE department, using pruning, quantization and architecture changes to make the models practical for real-time analysis.',
    ],
    contribution: [
      'Designed models that were about 77% more energy-efficient, with an 86% cut in compute use and no loss in accuracy.',
      'Pruning, quantization and architecture changes cut memory and compute needs by up to 95%.',
    ],
    collaborators: 'NIT Puducherry, Department of CSE.',
    cover: { src: '/media/plates/lung-nodules.webp', alt: 'Plate: an illustrative CT slice with a nodule marked.' },
    facts: [],
    sections: [],
    links: [{ label: 'LIDC-IDRI dataset', href: 'https://www.cancerimagingarchive.net/collection/lidc-idri/' }],
    sources: ['oldPortfolio', 'lidc'],
  },
  // ——— Future AGI ———
  {
    slug: 'ai-evaluation',
    name: 'AI Evaluation 1.0',
    short: 'Evaluation',
    years: '2026',
    sort: '2026-02',
    kind: 'AI engineering',
    place: 'Future AGI',
    medium: 'Python · uv · OpenTelemetry',
    oneLiner:
      'One evaluate() call for every kind of check: local metrics in under a millisecond, cloud Turing models, or an LLM judge, routed automatically.',
    hard: 'Replacing every earlier API with one function without breaking the people already calling them, while opening the same call to images and audio.',
    purpose: [
      'Teams check AI output in very different ways: a string match, a similarity score, a hallucination check, a judge model reading a screenshot. The SDK had grown a different API for each.',
      'Version 1.0 puts them behind one call. evaluate() picks the engine (a local heuristic, a cloud model or an LLM-as-judge) and the same result shape comes back.',
    ],
    contribution: [
      'I rewrote the evaluation SDK for its 1.0 release: the unified evaluate() API with automatic engine routing, 72+ local metrics, and image and audio judging.',
      'The local metrics cover string, JSON and similarity checks, NLI hallucination detection, RAG retrieval and generation, function calling, agent trajectories, structured output and guardrails. The release also added grading criteria generated from a short description, a feedback loop that turns corrections into few-shot examples, streaming evaluation with early stopping, OpenTelemetry spans, distributed backends (Celery, Ray, Temporal, Kubernetes), nine cookbooks, and the move from Poetry to uv.',
    ],
    collaborators: 'Evaluation is Future AGI team work; nik13 also worked on the release.',
    cover: {
      src: '/media/plates/ai-evaluation.webp',
      alt: 'Plate: one evaluate() call branching to a local metric, a Turing model and an LLM judge.',
    },
    facts: [],
    sections: [
      {
        heading: 'What changed for people using it',
        body: [
          'One import, from fi.evals import evaluate, instead of a different class per check. Text-only calls kept working, and passing an image or audio URL sends the same call to a multimodal judge.',
        ],
      },
    ],
    links: [
      { label: 'Release PR #13', href: 'https://github.com/future-agi/agent-learning-kit/pull/13' },
      { label: 'Repository', href: 'https://github.com/future-agi/agent-learning-kit' },
    ],
    sources: ['prEvaluation'],
  },
  {
    slug: 'agent-optimizer',
    name: 'Agent Optimizer',
    years: '2025',
    sort: '2025-10',
    kind: 'Open source',
    place: 'Future AGI',
    medium: 'Python · LiteLLM · Pydantic',
    oneLiner: 'An open-source library that searches for better prompts and agent workflows, scored by whatever evaluator you plug in.',
    hard: 'Prompt optimizers each assume something different about data and scoring. Putting several behind one interface meant agreeing on what a candidate, a score and a dataset are.',
    purpose: [
      'Hand-tuning a prompt stops scaling after a few examples. agent-opt treats it as search: generate candidates, score them with an evaluator, keep what improves.',
      'It ships several strategies (random search, ProTeGi, meta-prompting, GEPA, Bayesian search and PromptWizard), and any Future AGI evaluation can be the score.',
    ],
    contribution: [
      'I built the working prototype and the Bayesian-search optimizer, simplified the optimisation loop, and merged the first release to main in October 2025.',
    ],
    caption: 'I built the working prototype and the Bayesian-search optimizer, and merged the first release to main in October 2025.',
    collaborators: 'azain-commits wrote most of the other optimizers (ProTeGi, meta-prompt, GEPA and PromptWizard) and the evaluator integration.',
    cover: { src: '/media/plates/agent-optimizer.webp', alt: 'Plate: candidate prompts per round, with the best path rising.' },
    facts: [],
    sections: [],
    links: [
      { label: 'First release, PR #6', href: 'https://github.com/future-agi/agent-opt/pull/6' },
      { label: 'Repository', href: 'https://github.com/future-agi/agent-opt' },
    ],
    sources: ['prAgentOpt'],
  },
  {
    slug: 'chat-simulation',
    name: 'Chat simulation',
    short: 'Simulation',
    years: '2025',
    sort: '2025-12',
    kind: 'AI engineering',
    place: 'Future AGI',
    medium: 'Python · LiveKit · provider SDKs',
    oneLiner: 'Testing chat agents against simulated customers, in the SDK that already tested voice agents.',
    hard: 'Every agent framework returns messages, tool calls and tool outputs in a different shape. A simulation has to read all of them the same way and still trace the conversation.',
    purpose: [
      'Simulate SDK runs scenarios against an agent: a simulated customer with a goal and a persona talks to it, and the conversation is evaluated. It started with voice.',
      'This release added chat, so the same scenarios can run against text agents built on OpenAI, LangChain, Anthropic or Gemini.',
    ],
    contribution: [
      'I added chat simulation to the SDK: agent wrappers for OpenAI, LangChain, Anthropic and Gemini, tool calls and tool outputs in responses, traced conversations, timeouts, and runs through the Future AGI platform.',
      'I also moved the LiveKit voice engine into its own module so voice and chat share one runner.',
    ],
    collaborators: 'The Future AGI team built the voice engine and the platform’s simulation product.',
    cover: { src: '/media/plates/chat-simulation.webp', alt: 'Plate: a conversation between a simulated customer and an agent.' },
    facts: [],
    sections: [],
    links: [
      { label: 'Chat simulation, PR #4', href: 'https://github.com/future-agi/simulate-sdk/pull/4' },
      { label: 'Repository', href: 'https://github.com/future-agi/simulate-sdk' },
    ],
    sources: ['prSimulate'],
  },
  {
    slug: 'agent-command-center',
    name: 'Agent Command Center',
    short: 'Gateway',
    years: '2026',
    sort: '2026-04',
    kind: 'Platform engineering',
    place: 'Future AGI',
    medium: 'Go · Python · TypeScript',
    oneLiner: 'One OpenAI-compatible door to many model providers, and the client SDKs people call it with.',
    hard: 'A gateway that translates between provider formats has to be lossless. A field it silently drops looks like the model getting worse, not like a gateway bug.',
    purpose: [
      'Agent Command Center sits between an application and its model providers. Callers speak the OpenAI wire format or a provider’s own, and the gateway translates, routes and records.',
    ],
    contribution: [
      'I published the client SDKs’ first public release: an OpenAI-compatible Python client, a TypeScript client (ESM and CJS), and packages for LangChain.js, LlamaIndex.TS, React chat UIs and the Vercel AI SDK.',
      'In the gateway, I fixed Claude’s server tools, such as web search, being silently dropped when callers used the OpenAI-format endpoint. Tools that aren’t plain functions now keep the caller’s original bytes and replay them, so they round-trip on every provider path.',
    ],
    collaborators: 'The Future AGI team built the gateway itself, in Go.',
    cover: {
      src: '/media/plates/agent-command-center.webp',
      alt: 'Plate: one request fanning out to several model providers, with a server tool kept byte for byte.',
    },
    facts: [],
    sections: [
      {
        heading: 'The bug that looked like a model problem',
        body: [
          'The Anthropic translator kept only tools of type “function”. A web search tool was discarded with no error and no drop header, so the model answered from its training data. To the caller it looked like a worse answer, not a failure.',
        ],
      },
    ],
    links: [
      { label: 'SDK 1.0, PR #1', href: 'https://github.com/future-agi/agent-command-center-sdk/pull/1' },
      { label: 'Server tools fix, PR #2302', href: 'https://github.com/future-agi/future-agi/pull/2302' },
    ],
    sources: ['prAgentcc', 'prGateway'],
  },
  {
    slug: 'error-feed',
    name: 'Error Feed: cluster root cause',
    short: 'Error Feed',
    years: '2026',
    sort: '2026-06',
    kind: 'AI engineering',
    place: 'Future AGI',
    medium: 'Python · Django · ClickHouse · React',
    oneLiner: 'An agent that investigates a cluster of failing traces and says what they have in common, what to fix, and how sure it is.',
    hard: 'Finding what is common to every failing trace, not just the first few, without reading thousands of traces with an expensive model.',
    purpose: [
      'Error Feed groups failing traces into clusters, so you can see what is breaking. It didn’t say why: someone still had to open traces, compare them and spot the pattern.',
      'The root-cause agent does that investigation and shows its work.',
    ],
    contribution: [
      'I built the investigation agent: it reads a cluster’s traces from ClickHouse, compares them across version, model and region, and returns a two-sentence cause, a one-sentence fix, a confidence level and the evidence.',
      'It reads individual trace summaries with a cheap model, streams its reasoning live into a new Fix tab, and caches the result so later visits are instant. The same PR included a performance pass that cut the feed’s API latencies by 65–92%, and the billing wiring for the agent.',
    ],
    collaborators:
      'Built with KarthikAvinashFI, velalagan-pixel, commitPirate and cdileep23, who worked on the same PR. Error Feed is a Future AGI team product.',
    cover: {
      src: '/media/plates/error-feed.webp',
      alt: 'Plate: failing traces with one cluster circled, and the cause, fix, confidence and evidence the agent returns.',
    },
    facts: [{ value: '65–92%', label: 'lower feed API latencies after the performance pass', source: 'prErrorFeed' }],
    sections: [],
    links: [{ label: 'PR #853', href: 'https://github.com/future-agi/future-agi/pull/853' }],
    sources: ['prErrorFeed'],
  },
  {
    slug: 'annotations-clickhouse',
    name: 'Annotations on ClickHouse',
    short: 'Platform',
    years: '2026',
    sort: '2026-07',
    kind: 'Platform engineering',
    place: 'Future AGI',
    medium: 'Django · ClickHouse · Postgres',
    oneLiner: 'Moving the annotation system’s reads of trace data to ClickHouse, ahead of the Postgres tracer tables being dropped.',
    hard: 'Removing a data source from under a live feature. Every read path had to move without leaking data between tenants or failing open.',
    purpose: [
      'Tracing at Future AGI was moving fully to ClickHouse, and the Postgres trace, span and session tables were going away. The annotation system (queues, scores, span notes) still read trace data from Postgres.',
    ],
    contribution: [
      'I moved the annotation subsystem’s reads of trace, span and session data to ClickHouse: resolution, previews, availability checks and scores. Reads are tenant-gated and fail closed.',
      'Trace roots are read in lean batches so large queues don’t run out of memory. The PR replaced an earlier draft that only guarded the Postgres reads, since removing them was the right end state once the tables were gone.',
    ],
    collaborators: 'One part of the team’s wider migration of tracing to ClickHouse.',
    cover: { src: '/media/plates/annotations-clickhouse.webp', alt: 'Plate: reads moving from Postgres to ClickHouse.' },
    facts: [],
    sections: [],
    links: [{ label: 'PR #1495', href: 'https://github.com/future-agi/future-agi/pull/1495' }],
    sources: ['prAnnotations'],
  },
  {
    slug: 'open-source',
    name: 'The open-source SDKs',
    short: 'Open source',
    years: '2025 — now',
    sort: '2025-06',
    kind: 'Open source',
    place: 'Future AGI',
    medium: 'Python · TypeScript · Java · C#',
    oneLiner: 'Agent Optimizer, AI Evaluation, Agent Learning Kit, the Future AGI SDK, Simulate SDK, the Agent Command Center SDK and traceAI.',
    hard: 'Libraries in four languages that have to agree on names, data shapes and versions, so a trace, an evaluation and a simulation can meet in one place.',
    purpose: [
      'Most of what Future AGI builds has an open-source edge: SDKs for tracing, evaluation, optimisation, simulation and the gateway. They are how developers meet the platform.',
    ],
    contribution: [
      'Releases I shipped or co-authored: AI Evaluation 1.0, Agent Optimizer’s first release, chat in Simulate SDK, the Agent Command Center SDK 1.0, and traceAI v1.0.0 in Python, TypeScript, Java and C#.',
    ],
    collaborators: 'Each of these repositories has several authors; the Future AGI team owns them all.',
    cover: { src: '/media/plates/open-source.webp', alt: 'Plate: the Future AGI open-source repositories.' },
    facts: [],
    sections: [],
    links: [
      { label: 'agent-opt', href: 'https://github.com/future-agi/agent-opt' },
      { label: 'agent-learning-kit', href: 'https://github.com/future-agi/agent-learning-kit' },
      { label: 'simulate-sdk', href: 'https://github.com/future-agi/simulate-sdk' },
      { label: 'agent-command-center-sdk', href: 'https://github.com/future-agi/agent-command-center-sdk' },
      { label: 'futureagi-sdk', href: 'https://github.com/future-agi/futureagi-sdk' },
      { label: 'traceAI', href: 'https://github.com/future-agi/traceAI' },
    ],
    sources: ['futureAgiOrg', 'prEvaluation', 'prAgentOpt', 'prSimulate', 'prAgentcc', 'traceaiV1'],
  },
  // ——— Before Future AGI: roles with a piece of work each ———
  {
    slug: 'affectbots',
    name: 'AffectBots',
    years: '2023 — 24',
    sort: '2023-09',
    kind: 'Research system',
    place: 'IIT Bombay',
    medium: 'Audio · video · text',
    oneLiner: 'A multimodal tutoring system that reads audio, video and text to recognise a student’s emotion while a lesson is happening.',
    hard: 'Three signals that arrive at different rates and disagree with each other, fused fast enough to matter during the lesson rather than after it.',
    purpose: [
      'Built during my research role in IIT Bombay’s Educational Technology group, alongside the classroom diarization and shared-regulation work.',
    ],
    contribution: ['I built AffectBots as part of the research group’s classroom AI work.'],
    collaborators: 'Educational Technology group, IIT Bombay.',
    cover: { src: '/media/plates/affectbots.webp', alt: 'Plate: audio, video and text signals over one lesson.' },
    facts: [],
    sections: [],
    links: [],
    sources: ['oldPortfolio'],
  },
  {
    slug: 'conversation-analytics',
    name: 'Conversation analytics',
    short: 'Vocab.AI',
    years: 'Aug 2023 — May 2024',
    sort: '2023-08',
    kind: 'Full-stack',
    place: 'Vocab.AI',
    medium: 'React · Llama 2 · GPT-3.5 Turbo',
    oneLiner: 'Customer-service calls turned into something a team can act on: who spoke, how they sounded, what it was about, and how it went.',
    hard: 'The models were only half of it. The analytics had to reach the people running support through an app and APIs they would actually use.',
    purpose: ['Vocab.AI builds conversation analytics for customer-service teams.'],
    contribution: [
      'As a full-stack developer intern I built speaker diarization and voice emotion recognition models and the React app people used to run them, fine-tuned Llama 2 and GPT-3.5 Turbo for sentiment, topic modelling and conversation scoring, and wired an automated QA system and REST APIs into customer-service workflows.',
    ],
    caption: 'I built speaker diarization and voice emotion recognition models and the React app people used to run them.',
    collaborators: 'The Vocab.AI team.',
    cover: { src: '/media/plates/conversation-analytics.webp', alt: 'Plate: a two-speaker call waveform with sentiment, topic and QA score.' },
    facts: [],
    sections: [],
    links: [],
    sources: ['oldPortfolio'],
  },
  {
    slug: 'market-sentiment',
    name: 'Market sentiment',
    short: 'Sentiment',
    years: 'Jun 2024 · 3 months',
    sort: '2024-06',
    kind: 'Applied research',
    place: 'IIT Madras · RBCDSAI',
    medium: 'Transformers · time series',
    oneLiner: 'Can the mood of the market help predict it? Transformer sentiment from news and social media, next to the usual technical signals.',
    hard: 'Sentiment is noisy and arrives on its own schedule. The question was whether it adds anything once price and fundamentals are already in the model.',
    purpose: ['A research internship at the Robert Bosch Centre for Data Science and AI, on swing trading in Indian equities.'],
    contribution: [
      'I ran transformer-based sentiment analysis over social media and financial news, combined it with technical indicators and fundamentals, and studied how feature selection and time-series models change prediction quality.',
    ],
    caption: 'I ran transformer-based sentiment analysis over social media and financial news.',
    collaborators: 'RBCDSAI, IIT Madras.',
    cover: { src: '/media/plates/market-sentiment.webp', alt: 'Plate: a price series above sentiment bars.' },
    facts: [],
    sections: [],
    links: [],
    sources: ['oldPortfolio'],
  },
];

export const workBySlug = (slug: string) => work.find(w => w.slug === slug);
