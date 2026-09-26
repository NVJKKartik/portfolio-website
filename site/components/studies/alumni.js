// Alumni Connect: a redesigned interface study (2026) with sample profiles. Not the 2023 Flutter app.
// Idea: the network is only useful if a current student can find the right person and ask for something specific.
const W = 1440,
  H = 900;
const CSS = `
.al-fit{position:absolute;inset:0;overflow:hidden;background:#0a1214}
.al-board{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;background:radial-gradient(90% 80% at 50% 40%,#13262a,#0a1214 70%);display:flex;align-items:center;justify-content:center;gap:48px;font-family:var(--font-bricolage),system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.al-board.solo{gap:0}
.al-board *{box-sizing:border-box}.al-board button{font:inherit;color:inherit;cursor:pointer;background:none;border:0;padding:0}
.al-ph{width:360px;height:760px;border-radius:46px;background:#0f1b1e;border:1px solid #2a3e43;box-shadow:0 0 0 7px #081012,0 0 0 8px #24363a,0 40px 80px -20px rgba(0,0,0,.7);position:relative;overflow:hidden;color:#eef3f1;font-size:14px}
.al-ph.lift{transform:translateY(-18px)}
.al-sb{height:44px;display:flex;justify-content:space-between;align-items:center;padding:0 26px 0 30px;font-size:13px;font-weight:600}
.al-sb i{width:16px;height:9px;border:1.5px solid #eef3f1;border-radius:3px;display:inline-block}
.al-in{position:absolute;top:44px;left:0;right:0;bottom:78px;overflow:hidden;padding:6px 18px 0}
.al-h{display:flex;justify-content:space-between;align-items:flex-end;margin:6px 0 14px}
.al-h h1{margin:0;font-size:30px;line-height:1;font-weight:700;letter-spacing:-.03em;font-variation-settings:"opsz" 60}
.al-h small{color:#8fa6a3;font-size:12.5px}
.al-search{height:44px;border-radius:14px;background:#16262a;border:1px solid #22363b;display:flex;align-items:center;gap:10px;padding:0 14px;color:#8fa6a3;font-size:14px;margin-bottom:12px}
.al-search svg{flex:none}
.al-chips{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px}
.al-chips button{height:30px;padding:0 12px;border-radius:99px;border:1px solid #2a4146;color:#cfe0dc;font-size:12.5px;font-weight:500}
.al-chips button.on{background:#ff7a59;border-color:#ff7a59;color:#1c0d07}
.al-count{font-size:12px;color:#8fa6a3;margin-bottom:6px}
.al-list{display:grid;gap:2px}
.al-p{display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center;padding:10px 4px;border-bottom:1px solid #1a2c30;text-align:left;width:100%;transition:opacity .3s}
.al-p.off{display:none}
.al-p .al-av{display:grid;color:#0f1b1e;margin:0;font-size:16px}.al-av{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;font-weight:700;font-size:16px;color:#0f1b1e;background:var(--c)}
.al-p b{display:block;font-weight:600;font-size:15px;letter-spacing:-.01em}
.al-p span{display:block;color:#8fa6a3;font-size:12.5px;margin-top:2px;line-height:1.35}
.al-p em{font-style:normal;font-size:11px;font-weight:600;color:#9be7c4;border:1px solid #2c5a4a;border-radius:99px;padding:3px 8px;white-space:nowrap}
.al-tab{position:absolute;left:0;right:0;bottom:0;height:78px;border-top:1px solid #1d3034;display:grid;grid-template-columns:repeat(5,1fr);padding:10px 8px 22px;background:#0f1b1e}
.al-tab span{display:grid;justify-items:center;gap:4px;font-size:10.5px;color:#6f8a87}
.al-tab span i{width:22px;height:22px;border-radius:7px;border:1.6px solid currentColor;display:block}
.al-tab span.on{color:#ff7a59}
.al-cover{height:150px;margin:0 -18px;background:linear-gradient(160deg,#ff7a59 0%,#b8475a 45%,#1b3a40 100%);position:relative}
.al-cover:after{content:"";position:absolute;inset:0;background:repeating-linear-gradient(115deg,transparent 0 22px,rgba(255,255,255,.06) 22px 23px)}
.al-back{position:absolute;left:16px;top:12px;width:34px;height:34px;border-radius:50%;background:rgba(15,27,30,.55);display:grid;place-items:center;z-index:2}
.al-pav{width:84px;height:84px;border-radius:26px;border:4px solid #0f1b1e;margin-top:-42px;position:relative;z-index:2;display:grid;place-items:center;font-size:28px;font-weight:700;color:#0f1b1e;background:#9be7c4}
.al-pn{margin:12px 0 2px;font-size:25px;font-weight:700;letter-spacing:-.03em}
.al-pm{color:#8fa6a3;font-size:13px;line-height:1.45}
.al-open{margin:14px 0;padding:12px 14px;border-radius:14px;background:#16262a;border:1px solid #22363b;font-size:13px;line-height:1.5}
.al-open small{display:block;font-size:11px;color:#8fa6a3;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px}
.al-tags{display:flex;gap:6px;flex-wrap:wrap}.al-tags span{font-size:12px;padding:4px 9px;border-radius:99px;background:#1f3337;color:#d6e6e2}
.al-path{list-style:none;margin:6px 0 0;padding:0 0 0 14px;border-left:1px solid #2a4146;display:grid;gap:12px;font-size:13px}
.al-path li{position:relative;line-height:1.35}.al-path li:before{content:"";position:absolute;left:-19px;top:5px;width:9px;height:9px;border-radius:50%;background:#0f1b1e;border:1.5px solid #ff7a59}
.al-path b{display:block;font-size:11.5px;color:#8fa6a3;font-weight:500}
.al-acts{position:absolute;left:18px;right:18px;bottom:92px;display:grid;grid-template-columns:1fr 1.3fr;gap:8px}
.al-acts button{height:46px;border-radius:14px;border:1px solid #2a4146;font-weight:600}
.al-acts button.p{background:#ff7a59;border:0;color:#1c0d07}
.al-ask{position:absolute;left:10px;right:10px;bottom:86px;background:#16262a;border:1px solid #2f4a50;border-radius:20px;padding:16px;box-shadow:0 -20px 50px rgba(0,0,0,.45);transform:translateY(130%);transition:transform .6s cubic-bezier(.2,.8,.2,1);z-index:4}
.al-ask.on{transform:none}
.al-ask h3{margin:0 0 4px;font-size:17px;letter-spacing:-.01em}.al-ask p{margin:0 0 10px;color:#8fa6a3;font-size:12.5px;line-height:1.45}
.al-ask .m{background:#0f1b1e;border:1px solid #22363b;border-radius:12px;padding:10px 12px;font-size:13px;line-height:1.5;color:#d6e6e2;margin-bottom:10px}
.al-ask button{width:100%;height:42px;border-radius:12px;background:#ff7a59;color:#1c0d07;font-weight:600}
.al-job{padding:14px;border-radius:16px;background:#16262a;border:1px solid #22363b;margin-bottom:10px}
.al-job .top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
.al-job b{display:block;font-size:15.5px;font-weight:600;letter-spacing:-.01em}
.al-job span{display:block;color:#8fa6a3;font-size:12.5px;margin-top:3px}
.al-job .by{display:flex;align-items:center;gap:8px;margin-top:12px;padding-top:10px;border-top:1px solid #22363b;font-size:12px;color:#b7cbc7}
.al-job .by i{width:22px;height:22px;border-radius:7px;background:var(--c);display:block}
.al-job .dl{font-size:11px;font-weight:600;color:#ffb199;white-space:nowrap}
.al-seg{display:grid;grid-template-columns:1fr 1fr;background:#16262a;border-radius:12px;padding:3px;margin-bottom:12px}
.al-seg b{text-align:center;padding:8px;border-radius:9px;font-size:13px;font-weight:500;color:#8fa6a3}.al-seg b.on{background:#223a3f;color:#eef3f1}
.al-cap{position:absolute;left:0;right:0;bottom:22px;text-align:center;font-size:12px;color:#6f8a87;letter-spacing:.02em}
.al-cap b{font-weight:600;letter-spacing:.06em;text-transform:uppercase;font-size:11px;color:#b7cbc7;margin-right:8px}
.al-lbl{position:absolute;top:34px;font-size:12px;color:#8fa6a3;letter-spacing:.04em;width:360px;text-align:center}
`;

const PEOPLE = [
  { n: 'Riya Menon', i: 'RM', c: '#9be7c4', b: '’20', r: 'ML engineer · Monsoon Health', city: 'Bengaluru', tags: ['ml', 'blr', 'ref', 'b1921'] },
  { n: 'Arjun Rao', i: 'AR', c: '#ffc56b', b: '’19', r: 'Backend engineer · Kestrel Labs', city: 'Bengaluru', tags: ['blr', 'ref', 'b1921'] },
  { n: 'Sneha Kulkarni', i: 'SK', c: '#ff9e87', b: '’21', r: 'Data scientist · Tamarind Systems', city: 'Pune', tags: ['ml', 'b1921'] },
  { n: 'Farhan Ali', i: 'FA', c: '#a8c7ff', b: '’18', r: 'Founder · Anvil Robotics', city: 'Hyderabad', tags: ['ref'] },
  { n: 'Divya Iyer', i: 'DI', c: '#d9b8ff', b: '’20', r: 'Research engineer · Saffron Pay', city: 'Bengaluru', tags: ['ml', 'blr', 'b1921'] },
  { n: 'Karan Mehta', i: 'KM', c: '#7fe0e0', b: '’22', r: 'SDE I · Kestrel Labs', city: 'Bengaluru', tags: ['blr'] },
];
const tab = on =>
  `<nav class="al-tab">${['Home', 'People', 'Jobs', 'Messages', 'Me'].map(x => `<span class="${x === on ? 'on' : ''}"><i></i>${x}</span>`).join('')}</nav>`;
const sb = '<div class="al-sb"><span>9:41</span><span><i></i></span></div>';
const search =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.2" stroke="#8fa6a3" stroke-width="1.6"/><path d="M11 11l3.2 3.2" stroke="#8fa6a3" stroke-width="1.6" stroke-linecap="round"/></svg>';

function people() {
  return `<div class="al-ph al-ph-people">${sb}<div class="al-in">
    <div class="al-h"><h1>People</h1><small>1,240 alumni</small></div>
    <div class="al-search">${search}Company, city, batch or skill</div>
    <div class="al-chips"><button type="button" data-f="all">All</button><button type="button" data-f="b1921">Batch ’19–’21</button><button type="button" data-f="blr">Bengaluru</button><button type="button" data-f="ml">ML</button><button type="button" data-f="ref">Open to referrals</button></div>
    <div class="al-count"></div>
    <div class="al-list">${PEOPLE.map((p, k) => `<button type="button" class="al-p" data-k="${k}" data-tags="${p.tags.join(' ')}"><span class="al-av" style="--c:${p.c}">${p.i}</span><span><b>${p.n}</b><span>${p.b} · Data Science &amp; AI · ${p.city}</span><span>${p.r}</span></span>${p.tags.includes('ref') ? '<em>Referrals</em>' : '<span></span>'}</button>`).join('')}</div>
  </div>${tab('People')}</div>`;
}
function profile() {
  const p = PEOPLE[0];
  return `<div class="al-ph al-ph-prof lift">${sb}<div class="al-in" style="padding-top:0">
    <div class="al-cover"><span class="al-back"><svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="#eef3f1" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg></span></div>
    <div class="al-pav">${p.i}</div><div class="al-pn">${p.n}</div>
    <div class="al-pm">Batch of 2020 · Data Science &amp; AI<br>${p.r} · ${p.city}</div>
    <div class="al-open"><small>Happy to help with</small><div class="al-tags"><span>Resume reviews</span><span>Mock interviews</span><span>Referrals</span></div></div>
    <ul class="al-path"><li><b>2020</b>Graduated, IIIT Dharwad</li><li><b>2020 — 23</b>Intern, then SDE · Kestrel Labs</li><li><b>2023 — now</b>ML engineer · Monsoon Health</li></ul>
  </div>
  <div class="al-acts"><button type="button">Message</button><button type="button" class="p al-askbtn">Ask for a referral</button></div>
  <div class="al-ask"><h3>Ask Riya for a referral</h3><p>Alumni see the role, your resume and a short note. Keep it specific.</p>
    <div class="m">Hi Riya, I’m in third year DSAI. I saw the ML research intern role at Monsoon Health and would love a referral. My resume and a project on speech emotion are attached.</div>
    <button type="button">Send request</button></div>
  ${tab('People')}</div>`;
}
function jobs() {
  const J = [
    ['ML research intern', 'Monsoon Health · Bengaluru · 6 months', 'Riya ’20', '#9be7c4', 'Closes 12 Oct'],
    ['Backend intern', 'Kestrel Labs · Bengaluru · Go, Postgres', 'Arjun ’19', '#ffc56b', 'Closes 18 Oct'],
    ['Robotics software, new grad', 'Anvil Robotics · Hyderabad', 'Farhan ’18', '#a8c7ff', 'Rolling'],
  ];
  return `<div class="al-ph al-ph-jobs">${sb}<div class="al-in">
    <div class="al-h"><h1>Jobs</h1><small>posted by alumni</small></div>
    <div class="al-seg"><b class="on">Internships</b><b>Full-time</b></div>
    ${J.map(([a, b, c, d, e]) => `<div class="al-job"><div class="top"><div><b>${a}</b><span>${b}</span></div><span class="dl">${e}</span></div><div class="by"><i style="--c:${d}"></i>Posted by ${c} · will refer 3</div></div>`).join('')}
  </div>${tab('Jobs')}</div>`;
}

export async function mount(el, opts = {}) {
  if (!document.getElementById('al-css')) {
    const s = document.createElement('style');
    s.id = 'al-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }
  const fit = document.createElement('div');
  fit.className = 'al-fit';
  const r = document.createElement('div');
  r.className = 'al-board';
  fit.appendChild(r);
  el.appendChild(fit);
  r.innerHTML = `${people()}${profile()}${jobs()}<div class="al-cap"><b>Interface study, 2026</b>Redesign of Alumni Connect (2023, led by Aarsh Desai). Sample profiles and companies.</div>`;
  const chips = [...r.querySelectorAll('.al-chips button')],
    rows = [...r.querySelectorAll('.al-p')],
    count = r.querySelector('.al-count');
  let active = new Set(['blr']);
  function apply() {
    chips.forEach(c => c.classList.toggle('on', c.dataset.f === 'all' ? active.size === 0 : active.has(c.dataset.f)));
    let n = 0;
    rows.forEach(row => {
      const tg = row.dataset.tags.split(' ');
      const ok = [...active].every(f => tg.includes(f));
      row.classList.toggle('off', !ok);
      if (ok) n++;
    });
    count.textContent = `${n} match${n === 1 ? '' : 'es'}${active.size ? ' · ' + [...active].map(f => ({ b1921: 'batch ’19–’21', blr: 'Bengaluru', ml: 'ML', ref: 'open to referrals' })[f]).join(', ') : ''}`;
  }
  chips.forEach(c =>
    c.addEventListener('click', () => {
      const f = c.dataset.f;
      if (f === 'all') active.clear();
      else if (active.has(f)) active.delete(f);
      else active.add(f);
      apply();
    }),
  );
  const ask = r.querySelector('.al-ask');
  r.querySelector('.al-askbtn').addEventListener('click', () => ask.classList.toggle('on'));
  function resize() {
    const b = fit.getBoundingClientRect();
    const s = Math.min(b.width / W, b.height / H);
    r.style.transform = `translate(${(b.width - W * s) / 2}px,${(b.height - H * s) / 2}px) scale(${s})`;
  }
  const ro = new ResizeObserver(resize);
  ro.observe(fit);
  resize();
  let timers = [];
  const script = [
    [
      0,
      () => {
        active = new Set();
        apply();
        ask.classList.remove('on');
      },
    ],
    [
      1.2,
      () => {
        active.add('blr');
        apply();
      },
    ],
    [
      2.6,
      () => {
        active.add('ref');
        apply();
      },
    ],
    [4.4, () => ask.classList.add('on')],
  ];
  const ctrl = {
    duration: 7,
    play() {
      timers.forEach(clearTimeout);
      timers = script.map(([s, f]) => setTimeout(f, s * 1000));
    },
    pause() {
      timers.forEach(clearTimeout);
    },
    seek(v) {
      timers.forEach(clearTimeout);
      script.filter(([s]) => s <= v).forEach(([, f]) => f());
    },
    async setState(n) {
      this.seek(n === 'ask' ? 6 : n === 'filter' ? 4 : 0);
    },
    destroy() {
      timers.forEach(clearTimeout);
      ro.disconnect();
      fit.remove();
    },
  };
  ctrl.seek(opts.t ?? 6);
  return ctrl;
}
