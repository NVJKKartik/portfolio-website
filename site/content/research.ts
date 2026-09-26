import type { SourceId } from './sources';

export type ResearchKind = 'Preprint' | 'Peer-reviewed paper' | 'Book chapter' | 'Granted patent';

export type Research = {
  slug: string;
  kind: ResearchKind;
  year: number;
  date: string; // ISO; what the date means is in `dateLabel`
  dateLabel: string;
  venue: string;
  /** Where the work was done, for the easel label. */
  place: string;
  title: string;
  shortTitle: string;
  /** A few words for the plan drawing. */
  short: string;
  badge?: string;
  question: string;
  role: string;
  /** What Kartik did, when the role alone doesn't say. Self-reported on his old portfolio. */
  did?: string;
  authors: { name: string; me?: boolean }[];
  plain: string[];
  technical: string[];
  established: string[];
  limits: string[];
  figure?: {
    caption: string;
    rows: { label: string; mine: number; other: number; better: 'mine' | 'other' | 'tie' }[];
    otherLabel: string;
    mineLabel: string;
  };
  links: { label: string; href: string }[];
  sources: SourceId[];
  relatedWork?: string;
};

export const research: Research[] = [
  {
    slug: 'agentcompass',
    kind: 'Preprint',
    year: 2025,
    date: '2025-09-18',
    dateLabel: 'arXiv v1, 18 Sep 2025',
    venue: 'arXiv · cs.AI, cs.CL',
    place: 'Future AGI',
    title: 'AgentCompass: Towards Reliable Evaluation of Agentic Workflows in Production',
    shortTitle: 'AgentCompass',
    short: 'AgentCompass',
    question: 'Once an agent is live, how do you find what went wrong across thousands of runs, and decide what to fix first?',
    role: 'First author, with Garvit Sapra, Rishav Hada and Nikhil Pareek at Future AGI.',
    authors: [{ name: 'NVJK Kartik', me: true }, { name: 'Garvit Sapra' }, { name: 'Rishav Hada' }, { name: 'Nikhil Pareek' }],
    plain: [
      'Most agent evaluation happens before launch, on test sets. The expensive failures show up after launch: a tool quietly returns the wrong shape, the agent drifts off its goal, or it answers confidently from nothing.',
      'AgentCompass reads a production trace the way an experienced debugger would. It finds the errors, groups them into themes, scores the run, and writes a summary that says what to fix first.',
    ],
    technical: [
      'A four-stage pipeline: error identification and categorisation → thematic clustering → quantitative scoring (e.g. factual grounding, safety, plan execution) → synthesis with a priority level.',
      'Errors are placed in a five-part taxonomy: Thinking & Response, Safety & Security, Tool & System, Workflow & Task Gaps, and Reflection Gaps.',
      'A dual memory: episodic (findings about one trace) and semantic (knowledge that generalises across traces, so recurring issues across a fleet of agents are recognised).',
    ],
    established: [
      'On the public TRAIL benchmark, AgentCompass had the best error-localisation accuracy (GAIA split: 0.657 vs 0.546 for Gemini-2.5-Pro) and the best joint accuracy (0.239 vs 0.183).',
      'The paper also reports issues it found that the human annotations missed, and use with design partners on real deployments.',
    ],
    limits: [
      'It is a preprint. It has not been peer-reviewed.',
      'Gemini-2.5-Pro beat it on category F1 (0.389 vs 0.309) and on correlation with human scores (0.462 vs 0.430). On the SWE split, joint accuracy was effectively a tie (0.051 vs 0.050).',
      'The design-partner results are described qualitatively, without public numbers.',
    ],
    figure: {
      caption: 'TRAIL benchmark, as reported in the paper. Higher is better.',
      mineLabel: 'AgentCompass',
      otherLabel: 'Gemini-2.5-Pro',
      rows: [
        { label: 'GAIA · localisation acc.', mine: 0.657, other: 0.546, better: 'mine' },
        { label: 'GAIA · joint acc.', mine: 0.239, other: 0.183, better: 'mine' },
        { label: 'GAIA · category F1', mine: 0.309, other: 0.389, better: 'other' },
        { label: 'GAIA · ρ with humans', mine: 0.43, other: 0.462, better: 'other' },
        { label: 'SWE · localisation acc.', mine: 0.25, other: 0.238, better: 'mine' },
        { label: 'SWE · joint acc.', mine: 0.051, other: 0.05, better: 'tie' },
      ],
    },
    links: [
      { label: 'arXiv abstract', href: 'https://arxiv.org/abs/2509.14647' },
      { label: 'Full text', href: 'https://arxiv.org/html/2509.14647v1' },
    ],
    sources: ['arxivAgentCompass', 'arxivAgentCompassHtml'],
    relatedWork: 'agentcompass',
  },
  {
    slug: 'speaker-diarization-tale-2024',
    kind: 'Peer-reviewed paper',
    year: 2024,
    date: '2024-12-01',
    dateLabel: 'IEEE TALE 2024',
    venue: 'IEEE TALE 2024',
    place: 'IIT Bombay',
    badge: 'Best Student Paper',
    title: 'Advancing Speaker Diarization With Whisper Speech Recognition for Different Learning Environments',
    shortTitle: 'Speaker diarization in classrooms',
    short: 'Diarization',
    question: 'Who said what, in a classroom where people switch between English and local languages mid-sentence?',
    role: 'Co-author, second of seven. My part was the diarization pipeline work.',
    did: 'I implemented speaker diarization for code-switched classroom audio, with pyannote and Whisper.',
    authors: [
      { name: 'Aarsh Desai' },
      { name: 'N.V.J.K Kartik', me: true },
      { name: 'Priyesh Gupta' },
      { name: 'Vinayak' },
      { name: 'Ashwin T S' },
      { name: 'Manjunath K. Vanahalli' },
      { name: 'Ramkumar Rajendran' },
    ],
    plain: [
      'Speaker diarization splits a recording by speaker: this stretch is the teacher, this one is student two. It is the first step before you can study how a class actually talks.',
      'Off-the-shelf systems struggle with Indian classrooms, where speech moves between English and local languages. The paper tests whether a combined pipeline does better.',
    ],
    technical: [
      'The pipeline combines pyannote.audio diarization with OpenAI Whisper transcription, a custom voice-activity detector, and an embedding-clustering step.',
      'Evaluation used 137 recordings from an online HCI course and an augmented-reality classroom.',
    ],
    established: [
      'The pyannote + Whisper pipeline had the lowest Diarization Error Rate of the systems compared (DER 0.26), ahead of commercial options including Deepgram and Otter.',
      'It won the Best Student Paper award at IEEE TALE 2024.',
    ],
    limits: [
      'A DER of 0.26 still means roughly a quarter of speaking time is attributed to the wrong speaker, or missed. Better than the alternatives is not the same as solved.',
      'Two learning settings. How well it transfers to other classrooms and languages is open.',
    ],
    links: [
      { label: 'IEEE Xplore', href: 'https://ieeexplore.ieee.org/document/10834319/' },
      { label: 'TALE 2024 awards', href: 'https://2024.tale-conference.org/awards/' },
      { label: 'IIT Bombay ET awards', href: 'https://www.et.iitb.ac.in/about-us/awards' },
    ],
    sources: ['ieeeTale', 'taleAwards', 'iitbAwards', 'oldPortfolio'],
  },
  {
    slug: 'ssmr-triggers-t4e',
    kind: 'Book chapter',
    year: 2025,
    date: '2025-10-23',
    dateLabel: 'Published online 23 Oct 2025',
    venue: 'T4E 2024 · Springer Lecture Notes in Educational Technology',
    place: 'IIT Bombay',
    title:
      'Unlocking the Triggers: Automating the Identification of Triggers of Socially Shared Metacognitive Regulation in Collaborative Problem-Solving',
    shortTitle: 'Triggers of shared regulation',
    short: 'Shared regulation',
    question: 'When a group stops and asks “wait, is this working?”, what set it off? Could a model spot that moment in the conversation?',
    role: 'First author, with seven co-authors from the same research group.',
    did: 'I applied Conditional Random Fields to detect the triggers of socially shared regulation in group problem-solving.',
    authors: [
      { name: 'N.V.J.K Kartik', me: true },
      { name: 'Priyesh Gupta' },
      { name: 'Vinayak' },
      { name: 'Aarsh Desai' },
      { name: 'Vishwas Badhe' },
      { name: 'T S Ashwin' },
      { name: 'Manjunath Vanahalli' },
      { name: 'Ramkumar Rajendran' },
    ],
    plain: [
      'Socially shared metacognitive regulation (SSMR) is a group jointly checking and steering its own thinking. “Hold on, are we even solving the right problem?” is a small example.',
      'Researchers usually find these moments by hand-coding transcripts, which is slow. This paper works on detecting what triggers them automatically, from the group’s conversation.',
    ],
    technical: [
      'The approach treats the conversation as a sequence and labels trigger moments. It uses Conditional Random Fields over collaborative problem-solving discourse.',
      'Published in the T4E 2024 proceedings (Vol. 2), pp. 43–51.',
    ],
    established: [
      'It frames trigger detection as an automatable sequence-labelling task, a step toward analysing collaboration at a scale hand-coding can’t reach.',
    ],
    limits: [
      'It works from what people said. Tone, posture and gaze are not in the model. Later work from the group proposes a multimodal extension.',
      'I haven’t reproduced the paper’s headline numbers here. Read the chapter for them.',
    ],
    links: [
      { label: 'Springer', href: 'https://link.springer.com/chapter/10.1007/978-981-95-1734-3_6' },
      { label: 'DOI 10.1007/978-981-95-1734-3_6', href: 'https://doi.org/10.1007/978-981-95-1734-3_6' },
    ],
    sources: ['springerT4E', 'crossrefT4E', 'oldPortfolio', 'badheFollowup'],
  },
  {
    slug: 'synthetic-data-patent',
    kind: 'Granted patent',
    year: 2026,
    date: '2026-04-21',
    dateLabel: 'Issued 21 Apr 2026 · filed 27 May 2025',
    venue: 'USPTO · US 12,608,610 B1',
    place: 'Future AGI',
    title: 'Synthetic data generation system and method',
    shortTitle: 'Synthetic data generation',
    short: 'Patent',
    question: 'How do you produce realistic data for training and testing AI systems when the real data is scarce, or off-limits?',
    role: 'Co-inventor, with Nikhil Pareek, Rishav Hada and Srikanth Malyala. Assigned to Future AGI Inc.',
    authors: [{ name: 'Nikhil Pareek' }, { name: 'Rishav Hada' }, { name: 'Srikanth Malyala' }, { name: 'N.V.J.K Kartik', me: true }],
    plain: [
      'You describe the data you need. The system turns that into a schema and generates samples that follow it: the fields, how they relate, and how values should be distributed.',
      'It supports three starting points: nothing at all (seedless), a few real examples (seeded), or examples plus a knowledge base.',
    ],
    technical: [
      'Claim 1: receive domain requirements and a scenario type (Seedless, Seeded, or Seeded + Knowledge Base); define a structured schema with data fields, relationships and distributional targets; generate an initial sample set with a neural template-driven model trained on domain-specific data; and continue from there.',
    ],
    established: ['A granted US patent, application 19/219,261.'],
    limits: [
      'A patent is a legal record of an invention. It is not evidence that the method beats alternatives. There are no benchmark claims here.',
    ],
    links: [{ label: 'USPTO Official Gazette entry', href: 'https://patentsgazette.uspto.gov/week16/OG/html/1545-3/US12608610-20260421.html' }],
    sources: ['patent'],
  },
];

export const researchBySlug = (slug: string) => research.find(r => r.slug === slug);
