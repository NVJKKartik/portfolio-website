// Centio.AI: a redesigned interface study (2026). Not the 2024 app.
// Idea: the researcher mode is a document that writes itself in front of you, with its plan and sources in view.
// The sample topic and sources are real (Kartik's own research area); the uploaded files are samples.
const W = 1440,
  H = 900;
const CSS = `
.ce-fit{position:absolute;inset:0;overflow:hidden;background:#e6e8e1}
.ce{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;background:#eceee7;color:#1d211c;font-family:var(--font-albert),system-ui,sans-serif;font-size:14px;-webkit-font-smoothing:antialiased;display:grid;grid-template-columns:268px 1fr 392px;overflow:hidden}
.ce *{box-sizing:border-box}.ce button{font:inherit;color:inherit;cursor:pointer}
.ce-rail{padding:26px 20px;border-right:1px solid #d9dcd2;display:flex;flex-direction:column;gap:22px;position:relative;overflow:hidden}
.ce-rail:after{content:"";position:absolute;left:-60px;right:-60px;bottom:-40px;height:240px;background:repeating-radial-gradient(circle at 20% 120%,transparent 0 9px,rgba(47,93,39,.16) 9px 10px);pointer-events:none}
.ce-brand{font-family:var(--font-literata),Georgia,serif;font-size:27px;letter-spacing:-.01em}
.ce-nb{font-size:12px;color:#6b7068;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.ce-nbt{font-size:15px;font-weight:600}
.ce-modes{display:grid;gap:2px}
.ce-modes span{padding:8px 10px;border-radius:7px;color:#51564f;display:flex;justify-content:space-between}
.ce-modes span.on{background:#dfe8d6;color:#1d3a17;font-weight:600}
.ce-modes small{color:#8a8f86;font-weight:400}
.ce-src h4{margin:0 0 8px;font-size:12px;color:#6b7068;text-transform:uppercase;letter-spacing:.08em;font-weight:500;display:flex;justify-content:space-between}
.ce-src ul{list-style:none;margin:0;padding:0;display:grid;gap:4px}
.ce-src li{display:grid;grid-template-columns:34px 1fr;gap:8px;align-items:center;padding:6px 6px;border-radius:7px;font-size:13px;line-height:1.3;opacity:.35;transition:opacity .5s,background .3s}
.ce-src li.in{opacity:1}.ce-src li.hot{background:#fff}
.ce-src li b{font-size:10px;font-weight:600;letter-spacing:.06em;color:#2f5d27;border:1px solid #bcd0b0;border-radius:4px;text-align:center;padding:2px 0}
.ce-src li b.u{color:#7a5a12;border-color:#dccb9e}
.ce-src li span small{display:block;color:#7a7f76;font-size:11.5px;margin-top:1px}
.ce-docw{overflow:hidden;padding:30px 0 0;display:flex;justify-content:center;position:relative}
.ce-doc{width:700px;background:#fbfbf7;border:1px solid #dcdfd6;border-radius:4px 4px 0 0;padding:54px 64px 80px;box-shadow:0 1px 0 #fff inset,0 30px 60px -30px rgba(40,50,30,.25);font-family:var(--font-literata),Georgia,serif}
.ce-meta{font-family:var(--font-albert),sans-serif;font-size:12.5px;color:#6b7068;display:flex;gap:14px;margin-bottom:22px}
.ce-meta .dot{width:7px;height:7px;border-radius:50%;background:#3c7a31;display:inline-block;margin-right:6px;animation:ce-pulse 1.4s infinite}
@keyframes ce-pulse{50%{opacity:.25}}
.ce-doc h1{font-size:34px;line-height:1.12;font-weight:600;letter-spacing:-.015em;margin:0 0 22px;text-wrap:balance}
.ce-doc h2{font-size:19px;font-weight:600;margin:26px 0 8px}
.ce-doc p{font-size:16.5px;line-height:1.66;margin:0 0 14px;color:#2a2e28}
.ce-doc .w{opacity:0;transition:opacity .25s}.ce-doc .w.in{opacity:1}
.ce-cite{font-family:var(--font-albert),sans-serif;font-size:11px;font-weight:600;color:#2f5d27;background:#e3edd5;border-radius:4px;padding:1px 5px;margin-left:2px;vertical-align:2px;cursor:pointer}
.ce-cite.hot{background:#2f5d27;color:#fff}
.ce-caret{display:inline-block;width:2px;height:1.05em;background:#3c7a31;vertical-align:-2px;margin-left:1px;animation:ce-pulse .9s infinite}
.ce-pop{position:absolute;width:330px;background:#fff;border:1px solid #d4d8cc;border-radius:10px;padding:14px 16px;box-shadow:0 20px 40px -12px rgba(30,40,20,.3);font-size:13px;line-height:1.5;color:#3a3f37;opacity:0;transform:translateY(6px);transition:.25s;pointer-events:none;z-index:4}
.ce-pop.on{opacity:1;transform:none}
.ce-pop b{display:block;color:#1d211c;margin-bottom:2px}.ce-pop small{display:block;color:#7a7f76;margin-bottom:8px}
.ce-pop p{margin:0;font-family:var(--font-literata),serif;font-size:13.5px;border-left:2px solid #bcd0b0;padding-left:10px}.ce-pop em{display:block;font-style:normal;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#6b7068;margin-bottom:4px}
.ce-side{border-left:1px solid #d9dcd2;padding:26px 24px;display:flex;flex-direction:column;gap:20px;background:#f3f4ef}
.ce-q{background:#fff;border:1px solid #dcdfd6;border-radius:10px;padding:14px 16px;font-size:15px;line-height:1.45}
.ce-q small{display:block;font-size:12px;color:#6b7068;margin-bottom:6px;text-transform:uppercase;letter-spacing:.08em}
.ce-ctl{display:grid;gap:12px}
.ce-ctl label{font-size:12px;color:#6b7068;text-transform:uppercase;letter-spacing:.08em;display:block;margin-bottom:6px}
.ce-seg{display:grid;grid-template-columns:repeat(3,1fr);background:#e5e8df;border-radius:8px;padding:3px}
.ce-seg b{text-align:center;padding:7px 0;border-radius:6px;font-weight:500;color:#5b6058;font-size:13px}.ce-seg b.on{background:#fff;color:#1d211c;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.ce-plan h4{margin:0 0 10px;font-size:12px;color:#6b7068;text-transform:uppercase;letter-spacing:.08em;font-weight:500;display:flex;justify-content:space-between}
.ce-plan ol{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.ce-plan li{display:grid;grid-template-columns:22px 1fr auto;gap:10px;align-items:start;padding:9px 8px;border-radius:8px;font-size:13.5px;line-height:1.4;color:#8a8f86}
.ce-plan li i{width:16px;height:16px;border-radius:50%;border:1.5px solid #c5c9bf;margin-top:1px;display:block;position:relative}
.ce-plan li.done{color:#3a3f37}.ce-plan li.done i{background:#3c7a31;border-color:#3c7a31}
.ce-plan li.done i:after{content:"";position:absolute;left:4.5px;top:2px;width:4px;height:7px;border:solid #fff;border-width:0 1.5px 1.5px 0;transform:rotate(45deg)}
.ce-plan li.now{background:#fff;color:#1d211c;box-shadow:0 1px 0 #e3e6dd}.ce-plan li.now i{border-color:#3c7a31;border-top-color:transparent;animation:ce-spin 1s linear infinite}
@keyframes ce-spin{to{transform:rotate(360deg)}}
.ce-plan li small{color:#8a8f86;font-size:12px}
.ce-prog{height:4px;background:#e1e4db;border-radius:2px;overflow:hidden}.ce-prog i{display:block;height:100%;background:#3c7a31;transition:width .4s}
.ce-foot{margin-top:auto;display:flex;gap:8px}
.ce-foot button{flex:1;height:42px;border-radius:9px;border:1px solid #cfd3c8;background:#fff;font-weight:500}
.ce-foot button.p{background:#1d3a17;color:#f3f7ef;border:0}
.ce-tag{position:absolute;left:268px;right:392px;bottom:0;height:30px;display:flex;align-items:center;justify-content:center;font-size:11.5px;color:#7a7f76;background:linear-gradient(transparent,#eceee7 40%)}
.ce-tag b{font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:10.5px;color:#51564f;margin-right:8px}
`;

const SOURCES = [
  {
    k: 'PDF',
    t: 'Speaker Diarization: A Review of Recent Research',
    m: 'Anguera et al. · IEEE TASLP 2012',
    q: 'Defines diarization as determining “who spoke when?” in an audio or video recording with an unknown number of speakers.',
  },
  {
    k: 'PDF',
    t: 'Advancing Speaker Diarization With Whisper Speech Recognition for Different Learning Environments',
    m: 'Desai, Kartik et al. · IEEE TALE 2024',
    q: 'Reports DER 0.26 for a pyannote + Whisper pipeline on 137 classroom recordings, the lowest of the systems compared.',
  },
  {
    k: 'PDF',
    t: 'pyannote.audio: neural building blocks for speaker diarization',
    m: 'Bredin et al. · ICASSP 2020',
    q: 'An open-source Python toolkit with trainable neural building blocks for speaker diarization.',
  },
  {
    k: 'PDF',
    t: 'Robust Speech Recognition via Large-Scale Weak Supervision',
    m: 'Radford et al. · 2022 (Whisper)',
    q: 'Speech recognition trained on 680,000 hours of multilingual, multitask audio.',
  },
  {
    k: 'NOTE',
    u: true,
    t: 'lecture-audio-notes.md',
    m: 'Uploaded · sample file',
    q: 'Mic on the teacher’s desk. Group work from minute 18. Two students switch languages mid-sentence.',
  },
  { k: 'WAV', u: true, t: 'class-recording-03.wav', m: 'Uploaded · sample file · 41 min', q: 'Transcript attached. 6 speakers detected.' },
];
const DOC = [
  ['h1', 'Speaker diarization in multilingual classrooms'],
  [
    'p',
    'Speaker diarization answers who spoke when in a recording. In a classroom it comes before any analysis of how the class talks: teacher talk time, student turns, group discussion.',
    [1],
  ],
  [
    'p',
    'Most pipelines are built on meetings and broadcast speech. Classroom audio adds overlapping speakers and distant microphones, and in many Indian classrooms speech moves between English and a local language mid-sentence.',
    [2, 5],
  ],
  ['h2', 'What has worked'],
  [
    'p',
    'A common pattern pairs a neural diarization toolkit with a strong recogniser: pyannote.audio for segmentation and speaker embeddings, Whisper for the transcript. On online and augmented-reality classes, that pipeline reached a diarization error rate of 0.26, lower than the commercial systems it was compared with.',
    [3, 4, 2],
  ],
  ['h2', 'Still uncertain'],
  [
    'p',
    'A DER of 0.26 still misattributes about a quarter of speaking time. Whether the result holds for other classrooms and languages has not been shown.',
    [2],
  ],
];
const PLAN = [
  ['Find work on diarization for classroom audio', '4 papers'],
  ['Read them and pull out claims', '11 claims'],
  ['Check the claims against your uploads', '2 files'],
  ['Outline'],
  ['Write the draft with citations'],
  ['List what’s still uncertain'],
];

export async function mount(el, opts = {}) {
  if (!document.getElementById('ce-css')) {
    const s = document.createElement('style');
    s.id = 'ce-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  const fit = document.createElement('div');
  fit.className = 'ce-fit';
  const r = document.createElement('div');
  r.className = 'ce';
  fit.appendChild(r);
  el.appendChild(fit);
  let wi = 0;
  const docHtml = DOC.map(([tag, text, cites]) => {
    const words = text
      .split(' ')
      .map(w => `<span class="w" data-i="${wi++}">${w} </span>`)
      .join('');
    const c = (cites || []).map(n => `<span class="ce-cite w" data-i="${wi++}" data-src="${n}">${n}</span>`).join('');
    return `<${tag}>${words}${c}</${tag}>`;
  }).join('');
  const WORDS = wi;
  r.innerHTML = `
  <aside class="ce-rail"><div class="ce-brand">Centio.Ai</div>
    <div><div class="ce-nb">Notebook</div><div class="ce-nbt">Classroom audio</div></div>
    <div class="ce-modes"><span>Chat</span><span>Assistant <small>tasks</small></span><span class="on">Researcher <small>sourced docs</small></span><span>Documents <small>6 files</small></span></div>
    <div class="ce-src"><h4>Sources <span class="ce-sc">0 of 6</span></h4><ul>${SOURCES.map((s, i) => `<li data-i="${i + 1}"><b class="${s.u ? 'u' : ''}">${s.k}</b><span>${s.t.length > 52 ? s.t.slice(0, 50) + '…' : s.t}<small>${s.m}</small></span></li>`).join('')}</ul></div>
  </aside>
  <div class="ce-docw"><article class="ce-doc"><div class="ce-meta"><span><i class="dot"></i><span class="ce-status">Researching</span></span><span>Standard depth</span><span class="ce-wc">0 words</span></div>${docHtml}</article><div class="ce-pop"></div></div>
  <aside class="ce-side">
    <div class="ce-q"><small>Question</small>How well does speaker diarization work on multilingual classroom recordings, and what is still open?</div>
    <div class="ce-ctl"><div><label>Depth</label><div class="ce-seg"><b>Quick</b><b class="on">Standard</b><b>Deep</b></div></div>
      <div><label>Time budget</label><div class="ce-seg"><b>5 min</b><b class="on">15 min</b><b>30 min</b></div></div></div>
    <div class="ce-plan"><h4>Plan <span class="ce-step">0 / 6</span></h4><ol>${PLAN.map(([a, b]) => `<li><i></i><span>${a}</span><small>${b || ''}</small></li>`).join('')}</ol></div>
    <div class="ce-prog"><i style="width:0"></i></div>
    <div class="ce-foot"><button type="button">Stop</button><button type="button" class="p">Open as document</button></div>
  </aside>
  <div class="ce-tag"><b>Interface study, 2026</b> Redesign of Centio.AI (2024, Vinayak Rai’s repo). Uploaded files are samples.</div>`;

  const words = [...r.querySelectorAll('.ce-doc .w')];
  const srcLis = [...r.querySelectorAll('.ce-src li')];
  const planLis = [...r.querySelectorAll('.ce-plan li')];
  const pop = r.querySelector('.ce-pop');
  const DUR = 12;
  function at(tt) {
    // plan: 0–4.5s research steps, then writing 4.5–11s
    const step = tt < 0.6 ? 0 : tt < 2.2 ? 1 : tt < 3.4 ? 2 : tt < 4.4 ? 3 : tt < 10.6 ? 4 : tt < 11.4 ? 5 : 6;
    planLis.forEach((li, i) => {
      li.className = i < step ? 'done' : i === step ? 'now' : '';
    });
    r.querySelector('.ce-step').textContent = `${Math.min(step, 6)} / 6`;
    r.querySelector('.ce-prog i').style.width = `${(Math.min(tt, DUR - 1) / (DUR - 1)) * 100}%`;
    const nSrc = Math.min(6, Math.floor(Math.max(0, tt - 0.5) / 0.45));
    srcLis.forEach((li, i) => li.classList.toggle('in', i < nSrc));
    r.querySelector('.ce-sc').textContent = `${nSrc} of 6`;
    const nW = Math.floor(Math.max(0, Math.min(1, (tt - 4.4) / 6.2)) * WORDS);
    words.forEach((w, i) => w.classList.toggle('in', i < nW));
    r.querySelectorAll('.ce-caret').forEach(c => c.remove());
    if (nW > 0 && nW < WORDS) {
      const c = document.createElement('span');
      c.className = 'ce-caret';
      words[nW - 1].after(c);
    }
    r.querySelector('.ce-wc').textContent = `${words.slice(0, nW).filter(w => !w.classList.contains('ce-cite')).length} words`;
    r.querySelector('.ce-status').textContent = nW >= WORDS ? 'Draft ready' : step < 4 ? 'Researching' : 'Writing';
    // after the draft lands, show a citation being checked
    const show = tt > 11.2 ? r.querySelector('.ce-cite[data-src="2"]:not(:first-of-type), .ce-doc p:nth-of-type(3) .ce-cite[data-src="2"]') : null;
    hot(show);
  }
  function hot(c) {
    r.querySelectorAll('.ce-cite.hot').forEach(e => e.classList.remove('hot'));
    srcLis.forEach(l => l.classList.remove('hot'));
    if (!c) {
      pop.classList.remove('on');
      return;
    }
    const n = +c.dataset.src,
      s = SOURCES[n - 1];
    c.classList.add('hot');
    srcLis[n - 1].classList.add('hot');
    pop.innerHTML = `<b>${s.t}</b><small>${s.m}</small><em>Supports this sentence</em><p>${s.q}</p>`;
    const b = c.getBoundingClientRect(),
      wb = r.querySelector('.ce-docw').getBoundingClientRect();
    const sc = b.width / c.offsetWidth || 1;
    pop.style.left = `${Math.max(24, Math.min((b.left - wb.left) / sc - 150, wb.width / sc - 350))}px`;
    pop.style.top = `${(b.bottom - wb.top) / sc + 10}px`;
    pop.classList.add('on');
  }
  r.addEventListener('mouseover', e => {
    const c = e.target.closest('.ce-cite.in');
    if (c) hot(c);
  });
  r.addEventListener('mouseout', e => {
    if (e.target.closest('.ce-cite')) hot(null);
  });

  let t = 0,
    raf = 0,
    last = 0;
  function resize() {
    const b = fit.getBoundingClientRect();
    const s = Math.min(b.width / W, b.height / H);
    r.style.transform = `translate(${(b.width - W * s) / 2}px,${(b.height - H * s) / 2}px) scale(${s})`;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(fit);
  resize();
  function loop(now) {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    t += dt;
    if (t >= DUR) {
      t = DUR;
      cancelAnimationFrame(raf);
    }
    at(t);
  }
  const ctrl = {
    duration: DUR,
    play() {
      t = 0;
      last = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    },
    pause() {
      cancelAnimationFrame(raf);
    },
    seek(v) {
      cancelAnimationFrame(raf);
      t = v;
      at(v);
    },
    async setState(n) {
      this.seek({ research: 2.6, writing: 7.6, done: 11.8 }[n] ?? 11.8);
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      fit.remove();
    },
  };
  at(opts.t ?? 11.8);
  return ctrl;
}
