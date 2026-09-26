// Nexus: a redesigned interface study (2026) with sample data. Not the 2024 hackathon UI.
// Idea: the market and the trader on one time axis. When the session turns into loss-chasing, Nexus says so.
const W = 1440,
  H = 900;
const CSS = `
.nx-fit{position:absolute;inset:0;overflow:hidden;background:#07080a}
.nx{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;background:#0b0d0f;color:#e8ebee;font-family:var(--font-chivo),system-ui,sans-serif;font-size:14px;-webkit-font-smoothing:antialiased;overflow:hidden}
.nx *{box-sizing:border-box}.nx button{font:inherit;color:inherit;cursor:pointer}
.nx .mono{font-family:var(--font-chivo-mono),ui-monospace,monospace;font-variant-numeric:tabular-nums}
.nx-top{height:60px;display:flex;align-items:center;gap:36px;padding:0 28px;border-bottom:1px solid #1b1f23}
.nx-logo{display:flex;align-items:center;gap:10px;font-weight:700;font-size:17px;letter-spacing:-.01em}
.nx-logo i{width:22px;height:22px;display:block;background:conic-gradient(from 30deg,#5cc8c2,#3a7bd5,#5cc8c2);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)}
.nx-tabs{display:flex;gap:26px;color:#8a939b}.nx-tabs b{color:#e8ebee;font-weight:500;position:relative}.nx-tabs b:after{content:"";position:absolute;left:0;right:0;bottom:-21px;height:2px;background:#5cc8c2}
.nx-top .sp{flex:1}
.nx-chip{display:flex;align-items:center;gap:8px;height:32px;padding:0 12px;border:1px solid #232830;border-radius:8px;color:#aeb6bd;font-size:13px;background:none}
.nx-chip em{font-style:normal;color:#e8ebee}
.nx-dot{width:8px;height:8px;border-radius:50%;background:var(--c,#5cc8c2)}
.nx-body{position:absolute;top:60px;left:0;right:0;bottom:36px;display:grid;grid-template-columns:1fr 396px}
.nx-main{padding:22px 26px 18px 28px;display:grid;grid-template-rows:auto 1fr 196px;gap:14px;min-height:0}
.nx-pair{display:flex;align-items:baseline;gap:18px}
.nx-pair h1{margin:0;font-size:22px;font-weight:600;letter-spacing:-.01em}.nx-pair h1 span{color:#6f7880;font-weight:400}
.nx-price{font-size:30px;font-weight:500;letter-spacing:-.02em}
.nx-chg{font-size:14px}.nx-pair .sp{flex:1}
.nx-range{display:flex;gap:4px}.nx-range b{font-weight:400;font-size:12px;color:#7d868e;padding:5px 9px;border-radius:6px}.nx-range b.on{background:#161a1e;color:#e8ebee}
.nx-panel{position:relative;background:#0f1215;border:1px solid #1a1e22;border-radius:10px;overflow:hidden;min-height:0}
.nx-panel svg{position:absolute;inset:0;width:100%;height:100%}
.nx-lbl{position:absolute;left:16px;top:12px;font-size:12px;color:#7d868e;letter-spacing:.02em;display:flex;gap:14px;align-items:center;z-index:2}
.nx-lbl strong{color:#cfd5da;font-weight:500}
.nx-legend{display:flex;gap:14px}.nx-legend span{display:flex;gap:6px;align-items:center}
.nx-side{border-left:1px solid #1b1f23;padding:22px 24px;display:flex;flex-direction:column;gap:18px;position:relative;overflow:hidden}
.nx-ticket{background:#0f1215;border:1px solid #1a1e22;border-radius:10px;padding:16px}
.nx-bs{display:grid;grid-template-columns:1fr 1fr;background:#0b0d0f;border-radius:8px;padding:3px;margin-bottom:14px}
.nx-bs b{text-align:center;padding:8px;border-radius:6px;font-weight:500;color:#7d868e}.nx-bs b.on{background:#16322b;color:#6be3b0}
.nx-field{display:flex;justify-content:space-between;align-items:center;height:42px;border:1px solid #20252a;border-radius:8px;padding:0 12px;margin-bottom:10px;color:#7d868e;font-size:13px}
.nx-field .mono{color:#e8ebee;font-size:14px}
.nx-go{width:100%;height:44px;border:0;border-radius:8px;background:#1f8a64;color:#f2fffa;font-weight:600;margin-top:4px}
.nx-health{background:#0f1215;border:1px solid #1a1e22;border-radius:10px;padding:16px;flex:1;display:flex;flex-direction:column}
.nx-health h3{margin:0 0 2px;font-size:14px;font-weight:600}.nx-health p.s{margin:0 0 14px;color:#7d868e;font-size:12.5px}
.nx-gauge{display:flex;align-items:flex-end;gap:14px;margin-bottom:16px}
.nx-gauge .n{font-size:44px;line-height:.9;font-weight:500;letter-spacing:-.03em}
.nx-gauge .w{font-size:13px;color:var(--gc);padding-bottom:4px}
.nx-bar{height:6px;background:#1a1f23;border-radius:3px;position:relative;overflow:hidden;margin-bottom:16px}
.nx-bar i{position:absolute;left:0;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,#5cc8c2,#e7b54a 60%,#f06a5f)}
.nx-sig{display:grid;grid-template-columns:1fr auto;row-gap:11px;font-size:13px;color:#aeb6bd}
.nx-sig .mono{color:#e8ebee}
.nx-sig small{grid-column:1/-1;margin-top:-7px;height:3px;background:#181c20;border-radius:2px;overflow:hidden}.nx-sig small i{display:block;height:100%;background:#8a939b}
.nx-why{margin-top:auto;padding-top:14px;font-size:12.5px;color:#8a939b;border-top:1px solid #1a1e22}.nx-why u{text-decoration:none;color:#5cc8c2}
.nx-nudge{position:absolute;left:16px;right:16px;top:22px;background:#12181a;border:1px solid #28413f;border-radius:12px;padding:22px;box-shadow:0 30px 80px rgba(0,0,0,.6);transform:translateX(110%);transition:transform .7s cubic-bezier(.2,.8,.2,1);z-index:5}
.nx-nudge.on{transform:none}
.nx-nudge .k{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5cc8c2}
.nx-nudge h2{margin:10px 0 10px;font-size:26px;font-weight:600;letter-spacing:-.02em}
.nx-nudge p{margin:0 0 18px;color:#c3cacf;line-height:1.55;font-size:14.5px}
.nx-nudge .acts{display:grid;gap:8px}
.nx-nudge .acts button{height:44px;border-radius:8px;border:1px solid #2a3035;background:#151a1d;text-align:left;padding:0 14px;display:flex;justify-content:space-between;align-items:center}
.nx-nudge .acts button.p{background:#5cc8c2;color:#062422;border:0;font-weight:600}
.nx-nudge .fine{margin:14px 0 0;font-size:12px;color:#7d868e}
.nx-cool{position:absolute;inset:60px 0 36px 0;background:rgba(7,9,10,.78);backdrop-filter:blur(6px);display:grid;place-items:center;opacity:0;pointer-events:none;transition:opacity .8s;z-index:6}
.nx-cool.on{opacity:1;pointer-events:auto}
.nx-cool .in{display:grid;grid-template-columns:auto 420px;gap:64px;align-items:center}
.nx-ring{width:300px;height:300px;border-radius:50%;display:grid;place-items:center;position:relative}
.nx-ring:before{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid #2a4d4a;animation:nx-breathe 8s ease-in-out infinite}
.nx-ring:after{content:"";position:absolute;inset:38px;border-radius:50%;background:radial-gradient(circle,#15302e,#0c1314 70%);animation:nx-breathe 8s ease-in-out infinite}
@keyframes nx-breathe{0%,100%{transform:scale(.86)}50%{transform:scale(1)}}
.nx-ring .t{position:relative;z-index:2;text-align:center}.nx-ring .t .mono{font-size:48px;letter-spacing:-.02em}.nx-ring .t span{display:block;color:#8fb9b5;font-size:13px;margin-top:6px}
.nx-cool h2{margin:0 0 12px;font-size:28px;font-weight:600;letter-spacing:-.02em}.nx-cool p{margin:0 0 22px;color:#b9c1c6;line-height:1.6}
.nx-learn{border:1px solid #23302f;border-radius:10px;padding:16px;display:grid;grid-template-columns:74px 1fr;gap:14px;align-items:center;background:#0e1415}
.nx-learn i{display:block;height:54px;border-radius:6px;background:linear-gradient(135deg,#1d3b39,#0f1c1c)}
.nx-learn b{display:block;font-weight:600;margin-bottom:4px}.nx-learn span{color:#8a939b;font-size:13px}
.nx-cool .back{margin-top:18px;background:none;border:0;color:#8a939b;font-size:13px;padding:0}
.nx-foot{position:absolute;left:0;right:0;bottom:0;height:36px;border-top:1px solid #1b1f23;display:flex;align-items:center;justify-content:space-between;padding:0 28px;color:#646d75;font-size:12px}
.nx-foot b{font-weight:500;color:#aeb6bd;letter-spacing:.06em;text-transform:uppercase;font-size:11px}
`;

function rnd(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

export async function mount(el, opts = {}) {
  if (!document.getElementById('nx-css')) {
    const s = document.createElement('style');
    s.id = 'nx-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  const fit = document.createElement('div');
  fit.className = 'nx-fit';
  const r = document.createElement('div');
  r.className = 'nx';
  fit.appendChild(r);
  el.appendChild(fit);
  r.innerHTML = `
  <header class="nx-top"><div class="nx-logo"><i></i>Nexus</div>
    <nav class="nx-tabs"><span>Markets</span><b>Trade</b><span>Portfolio</span><span>Learn</span></nav><div class="sp"></div>
    <button class="nx-chip" type="button"><span class="nx-dot" style="--c:#e7b54a"></span>Session <em class="mono nx-sess">38 min</em></button>
    <button class="nx-chip nx-mood" type="button">How are you feeling? <em>Check in</em></button>
    <button class="nx-chip" type="button"><em>You</em></button></header>
  <div class="nx-body">
    <main class="nx-main">
      <div class="nx-pair"><h1>BTC <span>/ USDT</span></h1><div class="nx-price mono">67,412.50</div><div class="nx-chg mono" style="color:#f0656b">−2.84% · 40 min</div><div class="sp"></div>
        <div class="nx-range"><b>15m</b><b class="on">1h</b><b>4h</b><b>1d</b></div></div>
      <div class="nx-panel nx-mkt"><div class="nx-lbl"><strong>Market</strong><span class="mono">09:40 — 10:20</span><div class="nx-legend"><span><i class="nx-dot" style="--c:#6be3b0"></i>your buys</span><span><i class="nx-dot" style="--c:#f0656b"></i>your sells</span></div></div><svg class="nx-chart" viewBox="0 0 1000 400" preserveAspectRatio="none"></svg></div>
      <div class="nx-panel nx-you"><div class="nx-lbl"><strong>You</strong><span>Stress, estimated from how you trade</span><div class="nx-legend"><span><i class="nx-dot" style="--c:#e7b54a"></i>mood check-in</span></div></div><svg class="nx-stress" viewBox="0 0 1000 196" preserveAspectRatio="none"></svg></div>
    </main>
    <aside class="nx-side">
      <div class="nx-ticket"><div class="nx-bs"><b class="on">Buy</b><b>Sell</b></div>
        <div class="nx-field">Price<span class="mono">Market</span></div><div class="nx-field">Amount<span class="mono">0.050 BTC</span></div><div class="nx-field">Total<span class="mono">3,370.63 USDT</span></div>
        <button class="nx-go" type="button">Buy BTC</button></div>
      <section class="nx-health"><h3>This session</h3><p class="s">Three signals from your own trades. Nothing else.</p>
        <div class="nx-gauge"><div class="n mono nx-sv">28</div><div class="w nx-sw" style="--gc:#5cc8c2">steady</div></div>
        <div class="nx-bar"><i class="nx-sb" style="width:28%"></i></div>
        <div class="nx-sig">
          <span>Trades in the last 20 min</span><span class="mono nx-s1">3</span><small><i class="nx-b1" style="width:15%"></i></small>
          <span>Placed within 60 s of a loss</span><span class="mono nx-s2">0</span><small><i class="nx-b2" style="width:0%"></i></small>
          <span>Position size vs. your usual</span><span class="mono nx-s3">1.0×</span><small><i class="nx-b3" style="width:25%"></i></small>
        </div>
        <div class="nx-why">How is this calculated? <u>Read the formula</u></div></section>
      <div class="nx-nudge" role="dialog" aria-label="Take ten"><div class="k">Nexus noticed a pattern</div><h2>Take ten?</h2>
        <p>You’ve placed <b class="mono nx-n1">14</b> trades in 20 minutes, and <b class="mono nx-n2">9</b> came within a minute of a loss. People often trade bigger right after this.</p>
        <div class="acts"><button class="p nx-pause" type="button">Pause trading for 10 minutes<span>→</span></button><button type="button">Set today’s loss limit<span class="mono">−500 USDT</span></button><button type="button" class="nx-keep">Keep trading</button></div>
        <p class="fine">Nexus never blocks a trade. Turn nudges off in Settings.</p></div>
    </aside>
  </div>
  <div class="nx-cool" aria-hidden="true"><div class="in"><div class="nx-ring"><div class="t"><div class="mono nx-timer">9:58</div><span>breathe in as it grows</span></div></div>
    <div><h2>Trading paused.</h2><p>Your open orders stay open. The market will still be there in ten minutes, and so will your plan.</p>
      <div class="nx-learn"><i></i><div><b>Reading volatility</b><span>What a 4% hourly range means, and what it doesn’t. 3 min.</span></div></div>
      <button class="back" type="button">End pause early</button></div></div></div>
  <footer class="nx-foot"><span><b>Interface study, 2026</b> · Redesign of Nexus (Hackfest ’24). Sample data.</span><span>Built in 2024 with Vinayak Rai, Priyesh Gupta and PlatJack</span></footer>`;

  // sample session: a drop, then a run of trades chasing it
  const rand = rnd(7),
    n = 124,
    px = [],
    trades = [];
  let v = 69380;
  for (let i = 0; i < n; i++) {
    const drift = i > 52 && i < 104 ? -24 : i >= 104 ? 9 : 3;
    v += drift + (rand() - 0.5) * 120;
    px.push(v);
  }
  const tIdx = [20, 44, 60, 65, 70, 74, 78, 82, 85, 89, 92, 96, 99, 103, 106, 110, 114, 118];
  tIdx.forEach((i, k) => trades.push({ i, buy: k % 3 !== 1, loss: i > 64 }));
  const lo = Math.min(...px) - 150,
    hi = Math.max(...px) + 150;
  const X = i => (i / (n - 1)) * 1000,
    Y = p => 380 - ((p - lo) / (hi - lo)) * 330;
  const chart = r.querySelector('.nx-chart'),
    stressSvg = r.querySelector('.nx-stress');
  const grid = Array.from(
    { length: 5 },
    (_, k) => `<line x1="0" x2="1000" y1="${60 + k * 80}" y2="${60 + k * 80}" stroke="#171b1f" vector-effect="non-scaling-stroke"/>`,
  ).join('');
  // stress: a function of trade frequency and trades after losses
  const stress = px.map((_, i) => {
    const recent = trades.filter(t => t.i <= i && t.i > i - 40);
    const chase = recent.filter(t => t.loss).length;
    return Math.min(96, 22 + recent.length * 4.2 + chase * 3.6);
  });

  let t = 0,
    raf = 0,
    last = 0,
    cooled = false,
    dismissed = false;
  const DUR = 11;
  function draw(frac) {
    const k = Math.max(2, Math.floor(frac * (n - 1)));
    const pts = px
      .slice(0, k + 1)
      .map((p, i) => `${X(i).toFixed(1)},${Y(p).toFixed(1)}`)
      .join(' ');
    const area = `0,400 ${pts} ${X(k).toFixed(1)},400`;
    const tr = trades
      .filter(q => q.i <= k)
      .map(
        q =>
          `<circle cx="${X(q.i)}" cy="${Y(px[q.i])}" r="4.5" fill="${q.buy ? '#6be3b0' : '#f0656b'}" stroke="#0f1215" stroke-width="2" vector-effect="non-scaling-stroke"/>`,
      )
      .join('');
    chart.innerHTML = `<defs><linearGradient id="nxg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5cc8c2" stop-opacity=".18"/><stop offset="1" stop-color="#5cc8c2" stop-opacity="0"/></linearGradient></defs>${grid}
      <polygon points="${area}" fill="url(#nxg)"/><polyline points="${pts}" fill="none" stroke="#9fe3df" stroke-width="1.6" vector-effect="non-scaling-stroke"/>${tr}
      <line x1="${X(k)}" x2="${X(k)}" y1="30" y2="400" stroke="#2a3136" stroke-dasharray="3 4" vector-effect="non-scaling-stroke"/>`;
    const sp = stress
      .slice(0, k + 1)
      .map((s, i) => `${X(i).toFixed(1)},${(186 - s * 1.5).toFixed(1)}`)
      .join(' ');
    const ticks = trades
      .filter(q => q.i <= k)
      .map(
        q =>
          `<line x1="${X(q.i)}" x2="${X(q.i)}" y1="176" y2="190" stroke="${q.loss ? '#f06a5f' : '#5d676f'}" stroke-width="2" vector-effect="non-scaling-stroke"/>`,
      )
      .join('');
    const mood = '';
    stressSvg.innerHTML = `<defs><linearGradient id="nxs" x1="0" x2="0" y1="1" y2="0"><stop offset="0" stop-color="#5cc8c2"/><stop offset=".55" stop-color="#e7b54a"/><stop offset="1" stop-color="#f06a5f"/></linearGradient></defs>
      <line x1="0" x2="1000" y1="${186 - 70 * 1.5}" y2="${186 - 70 * 1.5}" stroke="#3a2f22" stroke-dasharray="4 5" vector-effect="non-scaling-stroke"/>
      <polyline points="${sp}" fill="none" stroke="url(#nxs)" stroke-width="2.4" vector-effect="non-scaling-stroke"/>${ticks}${mood}`;
    // mood pill labels as HTML (svg text would stretch)
    r.querySelectorAll('.nx-mp').forEach(e => e.remove());
    [
      [30, 'calm'],
      [92, 'anxious'],
    ]
      .filter(m => m[0] <= k)
      .forEach(([i, w]) => {
        const e = document.createElement('span');
        e.className = 'nx-mp mono';
        e.textContent = w;
        const box = r.querySelector('.nx-you');
        e.style.cssText = `position:absolute;left:${(X(i) / 1000) * 100}%;top:${((186 - stress[i] * 1.5 - 26) / 196) * 100}%;transform:translate(-50%,-50%);font-size:11px;color:#e7b54a;z-index:2;background:#1d1a12;border:1px solid #5a4a22;border-radius:99px;padding:3px 10px`;
        box.appendChild(e);
      });
    const s = Math.round(stress[k]);
    r.querySelector('.nx-sv').textContent = s;
    const w = s < 45 ? ['steady', '#5cc8c2'] : s < 70 ? ['rising', '#e7b54a'] : ['high', '#f06a5f'];
    const sw = r.querySelector('.nx-sw');
    sw.textContent = w[0];
    sw.style.setProperty('--gc', w[1]);
    r.querySelector('.nx-sb').style.width = s + '%';
    const recent = trades.filter(q => q.i <= k && q.i > k - 40),
      chase = recent.filter(q => q.loss).length;
    const s1 = Math.round((recent.length * 14) / 11),
      s3 = (1 + chase * 0.16).toFixed(1);
    r.querySelector('.nx-s1').textContent = s1;
    r.querySelector('.nx-b1').style.width = Math.min(100, s1 * 6) + '%';
    r.querySelector('.nx-s2').textContent = Math.min(9, chase);
    r.querySelector('.nx-n1').textContent = s1;
    r.querySelector('.nx-n2').textContent = Math.min(9, chase);
    r.querySelector('.nx-b2').style.width = Math.min(100, chase * 11) + '%';
    r.querySelector('.nx-s3').textContent = s3 + '×';
    r.querySelector('.nx-b3').style.width = Math.min(100, s3 * 30) + '%';
    r.querySelector('.nx-price').textContent = px[k].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const chg = ((px[k] - px[0]) / px[0]) * 100;
    const ce = r.querySelector('.nx-chg');
    ce.textContent = `${chg >= 0 ? '+' : '−'}${Math.abs(chg).toFixed(2)}% · 40 min`;
    ce.style.color = chg >= 0 ? '#6be3b0' : '#f0656b';
    r.querySelector('.nx-nudge').classList.toggle('on', s >= 70 && !dismissed);
    r.querySelector('.nx-cool').classList.toggle('on', cooled);
  }
  function at(tt) {
    t = tt;
    const frac = Math.min(1, tt / 7.2);
    if (tt < 9.4) cooled = false;
    if (tt >= 9.4 && !dismissed) cooled = true;
    draw(frac);
    const left = Math.max(0, 600 - Math.max(0, tt - 9.4) * 1);
    const m = Math.floor(left / 60),
      sec = Math.floor(left % 60);
    r.querySelector('.nx-timer').textContent = `${m}:${String(sec).padStart(2, '0')}`;
  }
  r.querySelector('.nx-pause').addEventListener('click', () => {
    cooled = true;
    draw(1);
  });
  r.querySelector('.nx-keep').addEventListener('click', () => {
    dismissed = true;
    draw(1);
  });
  r.querySelector('.nx-cool .back').addEventListener('click', () => {
    cooled = false;
    dismissed = true;
    stop();
    draw(1);
  });

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
    if (t < DUR) at(t + dt);
    else stop();
  }
  function stop() {
    cancelAnimationFrame(raf);
  }
  const ctrl = {
    duration: DUR,
    play() {
      dismissed = false;
      cooled = false;
      t = 0;
      last = 0;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    },
    pause: stop,
    seek(v) {
      stop();
      dismissed = false;
      at(v);
    },
    async setState(n) {
      const m = { calm: 1.6, rising: 4.6, nudge: 8.2, cooldown: 10.5 };
      this.seek(m[n] ?? 8.2);
    },
    destroy() {
      stop();
      ro.disconnect();
      fit.remove();
    },
  };
  at(opts.t ?? 8.2);
  return ctrl;
}
