// Plates: one artwork per easel, drawn to canvas and saved to public/media/plates by render.mjs.
// Real artifacts are used instead wherever they exist (patent drawing, Hivemind screenshot, interface studies).
// Drawn plates illustrate an idea. They are never data.

const SANS = '"Archivo", "Helvetica Neue", Arial, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, Menlo, monospace';
function rnd(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}
function txt(g, s, x, y, { size = 28, font = SANS, weight = 500, color = '#fff', align = 'left', width = 100, track = 0, base = 'alphabetic' } = {}) {
  g.save();
  g.fillStyle = color;
  g.textAlign = align;
  g.textBaseline = base;
  g.font = `${weight} ${size}px ${font}`;
  try {
    g.fontStretch = width >= 110 ? 'expanded' : width <= 80 ? 'condensed' : 'normal';
  } catch {}
  if (track) {
    try {
      g.letterSpacing = `${track}px`;
    } catch {}
  }
  g.fillText(s, x, y);
  g.restore();
}
function wrap(g, s, x, y, maxW, lh, o) {
  g.save();
  g.font = `${o.weight || 500} ${o.size || 28}px ${o.font || SANS}`;
  const words = s.split(' ');
  let line = '',
    yy = y;
  for (const w of words) {
    const t = line ? line + ' ' + w : w;
    if (g.measureText(t).width > maxW && line) {
      txt(g, line, x, yy, o);
      line = w;
      yy += lh;
    } else line = t;
  }
  if (line) txt(g, line, x, yy, o);
  g.restore();
  return yy;
}
function caption(g, W, H, title, sub, ink = 'rgba(255,255,255,.86)', dim = 'rgba(255,255,255,.5)') {
  txt(g, title, 64, H - 92, { size: 30, weight: 600, color: ink, width: 112 });
  txt(g, sub, 64, H - 52, { size: 22, weight: 400, color: dim });
}
function grain(g, W, H, a = 0.05) {
  const r = rnd(3);
  for (let i = 0; i < 9000; i++) {
    g.fillStyle = `rgba(255,255,255,${r() * a})`;
    g.fillRect(r() * W, r() * H, 1.4, 1.4);
  }
}
function strands(g, x0, y0, ends, color, lw = 2.2) {
  ends.forEach(([x1, y1]) => {
    g.beginPath();
    g.moveTo(x0, y0);
    g.bezierCurveTo(x0 + (x1 - x0) * 0.55, y0, x0 + (x1 - x0) * 0.45, y1, x1, y1);
    g.strokeStyle = color;
    g.lineWidth = lw;
    g.stroke();
  });
}

const DRAW = {
  traceai(g, W, H) {
    g.fillStyle = '#15171c';
    g.fillRect(0, 0, W, H);
    txt(g, 'traceAI', 64, 180, { size: 92, weight: 700, color: '#eef0f4', width: 112 });
    txt(g, 'v1.0.0', 64, 240, { size: 30, font: MONO, color: '#8d97a8' });
    const langs = ['python', 'typescript', 'java', 'c#'],
      segs = [
        ['llm', 0.34, '#e8b86a'],
        ['retriever', 0.22, '#7fb8d8'],
        ['tool', 0.18, '#a6d38c'],
        ['agent', 0.26, '#d59ac6'],
      ];
    langs.forEach((l, k) => {
      const y = 380 + k * 130;
      txt(g, l, 64, y + 12, { size: 26, font: MONO, color: '#aab3c2' });
      let x = 330;
      segs.forEach(([n, w, c]) => {
        const ww = (W - 394) * w;
        g.fillStyle = c;
        g.fillRect(x, y - 22, ww - 8, 40);
        if (k === 0) txt(g, n, x, y - 40, { size: 18, font: MONO, color: '#8d97a8' });
        x += ww;
      });
    });
    txt(g, 'one vocabulary for every span', 64, 960, { size: 34, weight: 600, color: '#eef0f4' });
    caption(g, W, H, 'OpenTelemetry-native tracing', 'Four languages · 2025', '#eef0f4', '#8d97a8');
  },
  'ai-evaluation'(g, W, H) {
    g.fillStyle = '#1b2440';
    g.fillRect(0, 0, W, H);
    txt(g, 'from fi.evals import evaluate', 64, 150, { size: 30, font: MONO, color: '#9fb2e8' });
    txt(g, 'evaluate(…)', 64, 330, { size: 74, font: MONO, weight: 600, color: '#f1eee6' });
    const routes = [
      ['local metric', '< 1 ms', 470],
      ['Turing model', 'cloud', 640],
      ['LLM as judge', 'image · audio · text', 810],
    ];
    strands(
      g,
      470,
      305,
      routes.map(r => [610, r[2] - 10]),
      'rgba(241,238,230,.75)',
      2.6,
    );
    routes.forEach(([a, b, y]) => {
      g.fillStyle = '#f1eee6';
      g.beginPath();
      g.arc(610, y - 10, 7, 0, 7);
      g.fill();
      txt(g, a, 640, y, { size: 36, weight: 600, color: '#f1eee6' });
      txt(g, b, 640, y + 38, { size: 22, color: '#9fb2e8' });
    });
    txt(g, '72+ local metrics', 64, 1000, { size: 26, color: '#9fb2e8' });
    caption(g, W, H, 'AI Evaluation 1.0', 'One call, routed to the right engine · 2026');
  },
  'agent-optimizer'(g, W, H) {
    g.fillStyle = '#e8e2d4';
    g.fillRect(0, 0, W, H);
    const r = rnd(11),
      rounds = 8,
      x0 = 110,
      x1 = W - 90,
      y0 = 880,
      y1 = 190;
    g.strokeStyle = '#c9c1af';
    g.lineWidth = 1.5;
    for (let k = 0; k < 5; k++) {
      const y = y0 - (k / 4) * (y0 - y1);
      g.beginPath();
      g.moveTo(x0, y);
      g.lineTo(x1, y);
      g.stroke();
    }
    let best = [];
    for (let k = 0; k < rounds; k++) {
      const x = x0 + (k / (rounds - 1)) * (x1 - x0);
      let top = 0;
      for (let j = 0; j < 9; j++) {
        const sc = Math.min(0.97, 0.22 + k * 0.08 + r() * 0.28);
        top = Math.max(top, sc);
        g.fillStyle = 'rgba(40,36,30,.35)';
        g.beginPath();
        g.arc(x + (r() - 0.5) * 30, y0 - sc * (y0 - y1), 7, 0, 7);
        g.fill();
      }
      best.push([x, y0 - top * (y0 - y1)]);
    }
    g.beginPath();
    best.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.strokeStyle = '#b3401f';
    g.lineWidth = 4;
    g.stroke();
    best.forEach(([x, y]) => {
      g.fillStyle = '#b3401f';
      g.beginPath();
      g.arc(x, y, 10, 0, 7);
      g.fill();
    });
    txt(g, 'score', x0, 160, { size: 22, color: '#6f6757' });
    txt(g, 'round →', x1, 925, { size: 22, color: '#6f6757', align: 'right' });
    txt(g, 'Random search · ProTeGi · Meta-prompt · GEPA · Bayesian · PromptWizard', 64, 1010, { size: 21, color: '#4e483d' });
    caption(g, W, H, 'Agent Optimizer', 'Candidate prompts per round, best path in red · illustrative', '#211e19', '#6f6757');
  },
  'chat-simulation'(g, W, H) {
    g.fillStyle = '#20302b';
    g.fillRect(0, 0, W, H);
    const rows = [
      [0, 'Hi, my order arrived damaged.', 0.62],
      [1, 'Sorry to hear that. Can you share the order number?', 0.78],
      [0, 'It’s on the email. Why do you need it again?', 0.7],
      [1, 'I can look it up by phone. Is this 98… correct?', 0.72],
      [0, 'Fine. I want a refund, not a replacement.', 0.66],
    ];
    rows.forEach(([who, s, w], k) => {
      const y = 150 + k * 150,
        bw = (W - 180) * w,
        x = who ? W - 64 - bw : 64;
      g.fillStyle = who ? '#e7efe9' : '#34493f';
      g.beginPath();
      g.roundRect(x, y, bw, 104, 26);
      g.fill();
      wrap(g, s, x + 28, y + 44, bw - 56, 32, { size: 25, color: who ? '#1d2b25' : '#e7efe9', weight: 500 });
      txt(g, who ? 'your agent' : 'simulated customer', who ? W - 64 : 64, y - 14, { size: 18, color: '#8fb3a3', align: who ? 'right' : 'left' });
    });
    caption(g, W, H, 'Chat simulation', 'Personas and scenarios before real customers · 2025', '#e7efe9', '#8fb3a3');
  },
  'agent-command-center'(g, W, H) {
    g.fillStyle = '#121416';
    g.fillRect(0, 0, W, H);
    txt(g, 'POST /v1/chat/completions', 64, 150, { size: 28, font: MONO, color: '#e9e4da' });
    const P = ['OpenAI', 'Anthropic', 'Gemini', 'Bedrock', 'Mistral', 'Groq'];
    strands(
      g,
      200,
      190,
      P.map((_, k) => [620, 300 + k * 88]),
      'rgba(233,228,218,.45)',
      2,
    );
    P.forEach((p, k) => txt(g, p, 650, 310 + k * 88, { size: 34, weight: 600, color: k === 1 ? '#ffb547' : '#e9e4da' }));
    g.strokeStyle = '#ffb547';
    g.lineWidth = 2;
    g.setLineDash([8, 8]);
    g.strokeRect(64, 850, W - 128, 120);
    g.setLineDash([]);
    txt(g, '{"type": "web_search_20250305", "max_uses": 5}', 92, 902, { size: 23, font: MONO, color: '#ffb547' });
    txt(g, 'kept byte for byte, instead of dropped', 92, 946, { size: 21, color: '#b9b3a8' });
    caption(g, W, H, 'Agent Command Center', 'One OpenAI-compatible door, many providers · 2026', '#e9e4da', '#8f8a80');
  },
  'error-feed'(g, W, H) {
    g.fillStyle = '#2b1714';
    g.fillRect(0, 0, W, H);
    const r = rnd(5);
    for (let i = 0; i < 260; i++) {
      const cl = i % 5 === 0;
      const x = cl ? 330 + (r() - 0.5) * 170 : 80 + r() * (W - 160),
        y = cl ? 360 + (r() - 0.5) * 170 : 120 + r() * 520;
      g.fillStyle = cl ? '#ff8a6e' : 'rgba(255,220,210,.22)';
      g.beginPath();
      g.arc(x, y, cl ? 6 : 4.5, 0, 7);
      g.fill();
    }
    g.strokeStyle = '#ff8a6e';
    g.lineWidth = 2.5;
    g.beginPath();
    g.ellipse(330, 360, 150, 138, 0, 0, 7);
    g.stroke();
    const lines = [
      ['cause', 'what every trace in the cluster shares'],
      ['fix', 'one sentence, specific'],
      ['confidence', 'high · medium · low'],
      ['evidence', 'the traces and fields it used'],
    ];
    lines.forEach(([a, b], k) => {
      txt(g, a, 64, 760 + k * 62, { size: 20, font: MONO, color: '#ff8a6e' });
      txt(g, b, 250, 760 + k * 62, { size: 28, color: '#f5e6e1' });
    });
    caption(g, W, H, 'Error Feed: cluster root cause', 'An agent that investigates a cluster · 2026', '#f5e6e1', '#c49a90');
  },
  'annotations-clickhouse'(g, W, H) {
    g.fillStyle = '#d9d6ce';
    g.fillRect(0, 0, W, H);
    const slab = (y, label, c) => {
      g.fillStyle = c;
      g.fillRect(64, y, W - 128, 190);
      txt(g, label, 96, y + 116, { size: 52, weight: 700, color: '#f4f2ed', width: 112 });
    };
    slab(170, 'Postgres', '#8b8578');
    slab(640, 'ClickHouse', '#23302f');
    for (let k = 0; k < 4; k++) {
      const x = 250 + k * 170;
      g.strokeStyle = '#23302f';
      g.lineWidth = 3;
      g.setLineDash(k === 0 ? [] : [10, 10]);
      g.beginPath();
      g.moveTo(x, 380);
      g.lineTo(x, 620);
      g.stroke();
      g.setLineDash([]);
      g.beginPath();
      g.moveTo(x - 12, 604);
      g.lineTo(x, 626);
      g.lineTo(x + 12, 604);
      g.fillStyle = '#23302f';
      g.fill();
    }
    txt(g, 'trace · span · session reads', 96, 505, { size: 26, color: '#3a3f3c', weight: 500 });
    txt(g, 'tenant-gated, fail-closed', 96, 900, { size: 24, color: '#3a3f3c' });
    caption(g, W, H, 'Annotations on ClickHouse', 'Moving reads across a boundary · 2026', '#1f2220', '#5c605a');
  },
  'open-source'(g, W, H) {
    g.fillStyle = '#101820';
    g.fillRect(0, 0, W, H);
    const rp = ['agent-opt', 'agent-learning-kit', 'simulate-sdk', 'agent-command-center-sdk', 'futureagi-sdk', 'traceAI'];
    txt(g, 'github.com/future-agi/', 64, 150, { size: 26, font: MONO, color: '#5f7d95' });
    rp.forEach((b, k) => txt(g, b, 64, 270 + k * 110, { size: b.length > 20 ? 44 : 54, font: MONO, weight: 600, color: '#e3edf5' }));
    caption(g, W, H, 'The open-source SDKs', 'Python · TypeScript · Java · C# · with the Future AGI team', '#e3edf5', '#5f7d95');
  },
  agentcompass(g, W, H) {
    g.fillStyle = '#f0ede6';
    g.fillRect(0, 0, W, H);
    txt(g, 'AgentCompass', 64, 170, { size: 70, weight: 700, color: '#1c1b19', width: 118 });
    txt(g, 'identify → cluster → score → summarise', 64, 240, { size: 26, color: '#6b665c' });
    const cats = ['Thinking & Response', 'Safety & Security', 'Tool & System', 'Workflow & Task Gaps', 'Reflection Gaps'];
    cats.forEach((c, k) => {
      const y = 350 + k * 118;
      g.fillStyle = '#1c1b19';
      g.fillRect(64, y, 6, 78);
      txt(g, c, 100, y + 52, { size: 40, weight: 600, color: '#1c1b19' });
    });
    caption(g, W, H, 'arXiv 2509.14647', 'First author · preprint · 2025', '#1c1b19', '#6b665c');
  },
  writing(g, W, H) {
    g.fillStyle = '#f4f1ea';
    g.fillRect(0, 0, W, H);
    txt(g, 'My CI evals', 64, 300, { size: 104, weight: 700, color: '#1d1c1a', width: 76 });
    txt(g, 'were green.', 64, 410, { size: 104, weight: 700, color: '#1d1c1a', width: 76 });
    txt(g, 'A regression still', 64, 560, { size: 104, weight: 300, color: '#9a4a2f', width: 76 });
    txt(g, 'paged me at 3 AM.', 64, 670, { size: 104, weight: 300, color: '#9a4a2f', width: 76 });
    caption(g, W, H, 'Posts about what broke', 'DEV and Medium · 2026 —', '#1d1c1a', '#77726a');
  },
  'harness-engineering-btw-2026'(g, W, H) {
    g.fillStyle = '#0d2a52';
    g.fillRect(0, 0, W, H);
    txt(g, 'HARNESS', 64, 330, { size: 150, weight: 800, color: '#f2eee4', width: 70 });
    txt(g, 'ENGINEERING', 64, 480, { size: 150, weight: 800, color: '#f2eee4', width: 70 });
    wrap(g, 'Build the loop around agents you can trust. A live build, from a failing model call.', 64, 600, W - 128, 42, {
      size: 30,
      color: '#b9c8e0',
    });
    caption(g, W, H, 'Bengaluru Tech Week', '6 Sep 2026 · co-host', '#f2eee4', '#b9c8e0');
  },
  'speaker-diarization-tale-2024'(g, W, H) {
    g.fillStyle = '#1d1a26';
    g.fillRect(0, 0, W, H);
    const r = rnd(2),
      lanes = ['teacher', 'student 1', 'student 2', 'student 3'],
      cols = ['#ffd27a', '#8fd3ff', '#ff9ec0', '#b6f09c'];
    lanes.forEach((l, k) => {
      const y = 180 + k * 150;
      txt(g, l, 64, y + 8, { size: 22, font: MONO, color: '#a8a2b8' });
      g.fillStyle = 'rgba(255,255,255,.07)';
      g.fillRect(250, y - 20, W - 314, 40);
      let x = 250;
      while (x < W - 80) {
        const len = 20 + r() * 110;
        if (r() < (k === 0 ? 0.55 : 0.28)) {
          g.fillStyle = cols[k];
          g.fillRect(x, y - 16, len, 32);
        }
        x += len + 6;
      }
    });
    txt(g, 'Best Student Paper', 64, 860, { size: 44, weight: 700, color: '#ffd27a' });
    txt(g, 'IEEE TALE 2024 · pyannote + Whisper · DER 0.26', 64, 910, { size: 24, color: '#a8a2b8' });
    caption(g, W, H, 'Who spoke when', 'Speaker diarization in classrooms · segments illustrative', '#f1eef7', '#a8a2b8');
  },
  affectbots(g, W, H) {
    g.fillStyle = '#2b2233';
    g.fillRect(0, 0, W, H);
    ['audio', 'video', 'text'].forEach((m, k) => {
      const y = 220 + k * 190;
      txt(g, m, 64, y + 8, { size: 24, font: MONO, color: '#c8b8d8' });
      g.beginPath();
      for (let x = 200; x < W - 64; x += 4) {
        const a = Math.sin(x * (0.02 + k * 0.013)) * (26 + 18 * Math.sin(x * 0.004 + k));
        if (x === 200) g.moveTo(x, y + a);
        else g.lineTo(x, y + a);
      }
      g.strokeStyle = ['#ffb4a2', '#a2d2ff', '#e0c3fc'][k];
      g.lineWidth = 3;
      g.stroke();
    });
    strands(g, W - 64, 520, [], '#fff');
    txt(g, 'emotion, as the lesson happens', 64, 860, { size: 38, weight: 600, color: '#f3ecf8' });
    caption(g, W, H, 'AffectBots', 'Multimodal tutoring · IIT Bombay 2023–24', '#f3ecf8', '#c8b8d8');
  },
  'ssmr-triggers-t4e'(g, W, H) {
    g.fillStyle = '#e9e5dc';
    g.fillRect(0, 0, W, H);
    const turns = [
      ['A', 'So we multiply both sides…', 0],
      ['B', 'Wait. Is that what the question asks?', 1],
      ['C', 'Let’s reread it.', 0],
      ['A', 'Okay, it wants the rate, not the total.', 0],
    ];
    turns.forEach(([w, s, trig], k) => {
      const y = 200 + k * 150;
      txt(g, w, 64, y, { size: 30, font: MONO, weight: 600, color: '#6b665c' });
      txt(g, s, 130, y, { size: 36, weight: trig ? 700 : 400, color: '#1c1b19' });
      if (trig) {
        g.strokeStyle = '#a3361d';
        g.lineWidth = 3;
        g.strokeRect(118, y - 50, W - 190, 74);
        txt(g, 'TRIGGER', W - 80, y - 60, { size: 18, font: MONO, color: '#a3361d', align: 'right' });
      }
    });
    txt(g, 'Conditional Random Fields over the conversation', 64, 870, { size: 28, color: '#4e493f' });
    caption(g, W, H, 'Triggers of shared regulation', 'First author · T4E 2024, Springer · dialogue illustrative', '#1c1b19', '#6b665c');
  },
  'conversation-analytics'(g, W, H) {
    g.fillStyle = '#152321';
    g.fillRect(0, 0, W, H);
    const r = rnd(9);
    for (let x = 64; x < W - 64; x += 7) {
      const who = Math.sin(x * 0.011) > 0;
      const a = 20 + r() * 150 * (0.4 + 0.6 * Math.abs(Math.sin(x * 0.03)));
      g.fillStyle = who ? '#7fd1b9' : '#f6c28b';
      g.fillRect(x, 420 - a / 2, 4, a);
    }
    txt(g, 'agent', 64, 180, { size: 22, font: MONO, color: '#7fd1b9' });
    txt(g, 'customer', 200, 180, { size: 22, font: MONO, color: '#f6c28b' });
    [
      ['sentiment', '—'],
      ['topic', '—'],
      ['QA score', '—'],
    ].forEach(([a], k) => txt(g, a, 64 + k * 300, 760, { size: 30, weight: 600, color: '#e6f2ee' }));
    txt(g, 'diarization · voice emotion · LLM scoring', 64, 830, { size: 24, color: '#8ab0a6' });
    caption(g, W, H, 'Conversation analytics', 'Vocab.AI 2023–24 · waveform illustrative', '#e6f2ee', '#8ab0a6');
  },
  'lung-nodules'(g, W, H) {
    g.fillStyle = '#0b0c0d';
    g.fillRect(0, 0, W, H);
    const cx = W / 2,
      cy = 470;
    const gr = g.createRadialGradient(cx, cy, 20, cx, cy, 380);
    gr.addColorStop(0, '#5a5f63');
    gr.addColorStop(0.7, '#2a2d30');
    gr.addColorStop(1, '#0b0c0d');
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(cx, cy, 390, 330, 0, 0, 7);
    g.fill();
    g.fillStyle = '#0d0e10';
    [
      [-150, 0],
      [150, 0],
    ].forEach(([dx]) => {
      g.beginPath();
      g.ellipse(cx + dx, cy, 130, 210, dx > 0 ? 0.15 : -0.15, 0, 7);
      g.fill();
    });
    g.fillStyle = '#c9ccce';
    g.beginPath();
    g.arc(cx + 190, cy - 60, 16, 0, 7);
    g.fill();
    g.strokeStyle = '#ffb547';
    g.lineWidth = 3;
    g.strokeRect(cx + 150, cy - 100, 80, 80);
    txt(g, 'same answer, far less compute', 64, 900, { size: 38, weight: 600, color: '#e8e8e6' });
    caption(g, W, H, 'Lung-nodule analysis', 'LIDC-IDRI · NIT Puducherry 2023–24 · slice illustrative', '#e8e8e6', '#8a8d90');
  },
  'market-sentiment'(g, W, H) {
    g.fillStyle = '#e6e1d5';
    g.fillRect(0, 0, W, H);
    const r = rnd(4);
    let v = 480;
    g.beginPath();
    for (let x = 64; x < W - 64; x += 8) {
      v += (r() - 0.5) * 26;
      if (x === 64) g.moveTo(x, v);
      else g.lineTo(x, v);
    }
    g.strokeStyle = '#1d1c1a';
    g.lineWidth = 3;
    g.stroke();
    for (let x = 64; x < W - 64; x += 22) {
      const s = Math.sin(x * 0.015) + (r() - 0.5);
      g.fillStyle = s > 0 ? '#3f7a52' : '#a3361d';
      g.fillRect(x, 760, 14, -s * 70);
    }
    txt(g, 'price', 64, 200, { size: 22, font: MONO, color: '#6b665c' });
    txt(g, 'sentiment from news and posts', 64, 690, { size: 22, font: MONO, color: '#6b665c' });
    caption(g, W, H, 'Market sentiment', 'RBCDSAI, IIT Madras · 2024 · series illustrative', '#1d1c1a', '#6b665c');
  },
  'emotion-detector'(g, W, H) {
    g.fillStyle = '#1a2230';
    g.fillRect(0, 0, W, H);
    for (let k = 0; k < 20; k++) {
      const x = 120 + (k % 5) * 190,
        y = 170 + Math.floor(k / 5) * 170;
      g.fillStyle = '#2a3547';
      g.beginPath();
      g.roundRect(x - 80, y - 70, 160, 130, 14);
      g.fill();
      g.fillStyle = '#44536b';
      g.beginPath();
      g.arc(x, y - 12, 30, 0, 7);
      g.fill();
      g.beginPath();
      g.ellipse(x, y + 50, 54, 30, 0, Math.PI, 0);
      g.fill();
      if (k === 13) {
        g.strokeStyle = '#ffd27a';
        g.lineWidth = 4;
        g.beginPath();
        g.roundRect(x - 84, y - 74, 168, 138, 16);
        g.stroke();
        txt(g, 'check in', x, y + 96, { size: 22, color: '#ffd27a', align: 'center', font: MONO });
      }
    }
    txt(g, 'a prompt for the teacher, not a grade', 64, 900, { size: 34, weight: 600, color: '#e8edf5' });
    caption(g, W, H, 'Emotion detector for online classes', '48 hours · first place · 2023', '#e8edf5', '#93a2b8');
  },
};

export const ids = Object.keys(DRAW);
export function drawPlate(id) {
  const [c, g] = canvas(1000, 1250);
  DRAW[id](g, 1000, 1250);
  grain(g, 1000, 1250, 0.035);
  return c;
}
export async function fontsReady() {
  await Promise.all(
    [
      '500 20px Archivo',
      '600 20px Archivo',
      '700 20px Archivo',
      '300 20px Archivo',
      '800 20px Archivo',
      '400 20px "JetBrains Mono"',
      '600 20px "JetBrains Mono"',
    ].map(f => document.fonts.load(f)),
  );
}
