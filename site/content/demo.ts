// "Break the agent": a deterministic, illustrative demo. A fictional support agent, modelled on a
// real bug Kartik wrote about ("Every dashboard was green while my agent made things up").
// Nothing here is product output or benchmark data.

export type Scenario = 'healthy' | 'broken' | 'guarded';

export type DemoSpan = {
  id: string;
  name: string;
  depth: number;
  start: number; // ms
  end: number; // ms
  status: 'ok' | 'error' | 'skipped' | 'warn';
  attrs: [string, string][];
};

export const question = 'How do I reset two-factor auth?';

const docs = ['Sign-in & security › Two-factor authentication', 'Recovering access to your account', 'Changing your recovery email'];

const answers: Record<Scenario, string> = {
  healthy:
    'Open Settings → Sign-in & security → Two-factor authentication and choose Reset. You’ll confirm with your password and a code sent to your recovery email.',
  broken: 'Go to Settings → Security → 2FA and tap “Reset with backup phrase”, then enter the 12-word phrase we emailed you when you signed up.',
  guarded: 'I couldn’t find that in our help docs, so I won’t guess. Here’s how to reach account support, who can reset it for you safely.',
};

export const scenarios: Record<Scenario, { label: string; blurb: string; spans: DemoSpan[]; answer: string }> = {
  healthy: {
    label: 'Healthy run',
    blurb: 'Retrieval finds three help articles. The model answers from them.',
    answer: answers.healthy,
    spans: [
      {
        id: 'run',
        name: 'agent.run',
        depth: 0,
        start: 0,
        end: 1840,
        status: 'ok',
        attrs: [
          ['http.status_code', '200'],
          ['input', question],
          ['latency', '1.84 s'],
        ],
      },
      {
        id: 'intent',
        name: 'intent.classify',
        depth: 1,
        start: 0,
        end: 120,
        status: 'ok',
        attrs: [
          ['label', 'account_security'],
          ['confidence', '0.93'],
        ],
      },
      {
        id: 'retr',
        name: 'retriever.search',
        depth: 1,
        start: 120,
        end: 420,
        status: 'ok',
        attrs: [
          ['query', 'reset two-factor auth'],
          ['documents.count', '3'],
          ['top_document', docs[0]],
        ],
      },
      {
        id: 'llm',
        name: 'llm.generate',
        depth: 1,
        start: 430,
        end: 1720,
        status: 'ok',
        attrs: [
          ['context', `3 chunks · ${docs.slice(0, 2).join(' · ')}`],
          ['tokens', '812 in / 64 out'],
          ['output', answers.healthy],
        ],
      },
      { id: 'ans', name: 'respond', depth: 1, start: 1720, end: 1840, status: 'ok', attrs: [['channel', 'chat']] },
    ],
  },
  broken: {
    label: 'Break retrieval',
    blurb: 'Retrieval comes back empty. Nothing checks. The model fills the gap.',
    answer: answers.broken,
    spans: [
      {
        id: 'run',
        name: 'agent.run',
        depth: 0,
        start: 0,
        end: 1650,
        status: 'ok',
        attrs: [
          ['http.status_code', '200'],
          ['input', question],
          ['latency', '1.65 s'],
        ],
      },
      {
        id: 'intent',
        name: 'intent.classify',
        depth: 1,
        start: 0,
        end: 120,
        status: 'ok',
        attrs: [
          ['label', 'account_security'],
          ['confidence', '0.93'],
        ],
      },
      {
        id: 'retr',
        name: 'retriever.search',
        depth: 1,
        start: 120,
        end: 260,
        status: 'warn',
        attrs: [
          ['query', 'reset two-factor auth'],
          ['documents.count', '0'],
          ['note', 'No documentation matched. Not an exception, so nothing is marked as an error.'],
        ],
      },
      {
        id: 'llm',
        name: 'llm.generate',
        depth: 1,
        start: 270,
        end: 1540,
        status: 'ok',
        attrs: [
          ['context', '(empty)'],
          ['tokens', '231 in / 71 out'],
          ['output', answers.broken],
        ],
      },
      { id: 'ans', name: 'respond', depth: 1, start: 1540, end: 1650, status: 'ok', attrs: [['channel', 'chat']] },
    ],
  },
  guarded: {
    label: 'Add the guard',
    blurb: 'Empty retrieval short-circuits. The agent says it doesn’t know.',
    answer: answers.guarded,
    spans: [
      {
        id: 'run',
        name: 'agent.run',
        depth: 0,
        start: 0,
        end: 330,
        status: 'ok',
        attrs: [
          ['http.status_code', '200'],
          ['input', question],
          ['latency', '0.33 s'],
        ],
      },
      {
        id: 'intent',
        name: 'intent.classify',
        depth: 1,
        start: 0,
        end: 120,
        status: 'ok',
        attrs: [
          ['label', 'account_security'],
          ['confidence', '0.93'],
        ],
      },
      {
        id: 'retr',
        name: 'retriever.search',
        depth: 1,
        start: 120,
        end: 260,
        status: 'warn',
        attrs: [
          ['query', 'reset two-factor auth'],
          ['documents.count', '0'],
        ],
      },
      {
        id: 'guard',
        name: 'guard.empty_context',
        depth: 1,
        start: 262,
        end: 270,
        status: 'ok',
        attrs: [
          ['decision', 'short-circuit'],
          ['reason', 'documents.count == 0'],
        ],
      },
      { id: 'llm', name: 'llm.generate', depth: 1, start: 270, end: 270, status: 'skipped', attrs: [['skipped', 'no grounded context']] },
      { id: 'ans', name: 'respond', depth: 1, start: 270, end: 330, status: 'ok', attrs: [['template', 'handoff_to_support']] },
    ],
  },
};

// What an AgentCompass-style pass says about each run. Four stages, as in the paper.
export type Finding = {
  verdict: 'pass' | 'fail';
  identify: string;
  category: string;
  rootCause?: { span: string; text: string };
  cluster: string;
  scores: { label: string; value: number }[];
  summary: string;
  priority: 'None' | 'Low' | 'High';
};

export const findings: Record<Scenario, Finding> = {
  healthy: {
    verdict: 'pass',
    identify: 'No errors found. The answer’s steps match the retrieved article.',
    category: '—',
    cluster: 'No new clusters.',
    scores: [
      { label: 'Factual grounding', value: 5 },
      { label: 'Plan execution', value: 5 },
      { label: 'Safety', value: 5 },
    ],
    summary: 'Nothing to fix.',
    priority: 'None',
  },
  broken: {
    verdict: 'fail',
    identify: 'llm.generate asserts a “backup phrase” reset flow that appears in no retrieved document.',
    category: 'Thinking & Response › Hallucination',
    rootCause: {
      span: 'retr',
      text: 'retriever.search returned 0 documents and the run continued with an empty context. Workflow gap: no guard between retrieval and generation.',
    },
    cluster: 'Ungrounded answers after empty retrieval',
    scores: [
      { label: 'Factual grounding', value: 1 },
      { label: 'Plan execution', value: 3 },
      { label: 'Safety', value: 2 },
    ],
    summary: 'Short-circuit when retrieval is empty. Add a grounding check to CI so this can’t quietly come back.',
    priority: 'High',
  },
  guarded: {
    verdict: 'pass',
    identify: 'Retrieval still returned 0 documents, but the agent declined to guess and handed off.',
    category: '—',
    rootCause: { span: 'retr', text: 'Still worth a look: why does the help centre have nothing on 2FA resets?' },
    cluster: 'Joins “Coverage gaps in help docs” (low priority).',
    scores: [
      { label: 'Factual grounding', value: 5 },
      { label: 'Plan execution', value: 4 },
      { label: 'Safety', value: 5 },
    ],
    summary: 'The bug is fixed. The docs gap is a content problem, not an agent problem.',
    priority: 'Low',
  },
};
