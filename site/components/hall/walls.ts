// The two painted walls, drawn onto canvases the engine hangs on the concrete. Both are paint, not
// signage: flat colour, big type, nothing thin enough to shimmer as the camera moves.
// Coordinates are in metres of wall (m = pixels per metre); every wall is 14.2 m wide.
import type { CreditGroup, Place } from '@/content/hall';

const WALL = 14.2;

/**
 * The exit wall: "The work in this hall was made with", then every credited name, grouped by place,
 * flowed through balanced columns so each place gets wall in proportion to its people.
 * The canvas is a band 2.7 m tall whose top sits 3.55 m above the floor.
 */
export function drawCredits(g: CanvasRenderingContext2D, W: number, groups: CreditGroup[], font: string) {
  const m = W / WALL;
  const size = 0.19 * m,
    lead = 0.29 * m;
  const F = { head: `620 semi-expanded ${size}px ${font}`, name: `430 ${size}px ${font}`, intro: `600 semi-expanded ${size}px ${font}` };
  type Line = [keyof typeof F, string] | ['gap'];
  // A name longer than 2.4 m wraps onto two lines of about equal length, so no column grows wide
  // enough to crowd the next and no word is left on its own.
  const wrap = (k: keyof typeof F, t: string): Line[] => {
    g.font = F[k];
    const w = (x: string) => g.measureText(x).width;
    if (w(t) <= 2.4 * m) return [[k, t]];
    const words = t.split(' ');
    let best = 1;
    for (let i = 2; i < words.length; i++)
      if (
        Math.max(w(words.slice(0, i).join(' ')), w(words.slice(i).join(' '))) <
        Math.max(w(words.slice(0, best).join(' ')), w(words.slice(best).join(' ')))
      )
        best = i;
    return [
      [k, words.slice(0, best).join(' ')],
      [k, words.slice(best).join(' ')],
    ];
  };
  // Blocks never split across columns: the intro, each name, and each place heading with its first name.
  const blocks: Line[][] = [
    [
      ['intro', 'The work'],
      ['intro', 'in this hall'],
      ['intro', 'was made with'],
    ],
  ];
  groups.forEach(grp => {
    blocks.push([['gap'], ['head', grp.place], ...wrap('name', grp.names[0])]);
    grp.names.slice(1).forEach(n => blocks.push(wrap('name', n)));
  });
  const ROWS = 9;
  const cols: Line[][] = [[]];
  for (let blk of blocks) {
    let c = cols[cols.length - 1];
    if (c.length + blk.length > ROWS) {
      cols.push((c = []));
      if (blk[0][0] === 'gap') blk = blk.slice(1); // a gap never starts a column
    }
    c.push(...blk);
  }
  const width = (l: Line) => (l[0] === 'gap' ? 0 : ((g.font = F[l[0]]), g.measureText(l[1]).width));
  const widths = cols.map(c => Math.max(0, ...c.map(width)));
  const left = 0.6 * m,
    right = W - 0.6 * m;
  const gutter = (right - left - widths.reduce((a, b) => a + b, 0)) / Math.max(1, cols.length - 1);
  g.fillStyle = 'rgba(246,244,239,.66)';
  g.textBaseline = 'alphabetic';
  let x = left;
  cols.forEach((c, i) => {
    let y = 0.3 * m; // first baseline 3.25 m above the floor
    for (const l of c) {
      if (l[0] !== 'gap') {
        g.font = F[l[0]];
        g.fillText(l[1], x, y);
      }
      y += lead;
    }
    x += widths[i] + gutter;
  });
}

/**
 * The back wall: where the work was made. One painted bar per place on a time axis from January 2023
 * to this month. A year-only end fades across that year instead of claiming a month; a start before
 * the axis fades in from its edge. A change of role (intern to full-time) changes the bar's tone.
 * The canvas is the whole wall, 4.3 m tall.
 */
export function drawPlaces(g: CanvasRenderingContext2D, W: number, places: Place[], font: string, now = new Date()) {
  const m = W / WALL;
  const start = 2023 * 12,
    end = now.getFullYear() * 12 + now.getMonth() + 1;
  const X0 = 0.6 * m,
    X1 = W - 0.6 * m;
  const x = (month: number) => X0 + ((Math.min(end, Math.max(start, month)) - start) / (end - start)) * (X1 - X0);
  const month = (s: string, edge: 'from' | 'to') =>
    s === 'now' ? end : s.length === 4 ? +s * 12 + (edge === 'to' ? 12 : 0) : +s.slice(0, 4) * 12 + +s.slice(5, 7) - 1 + (edge === 'to' ? 1 : 0);
  const deep = [61, 90, 80],
    paint = (a: number) => `rgba(${deep.join(',')},${a})`;
  const paper = 'rgba(246,244,239,.92)',
    ink = 'rgba(27,28,28,.78)';
  const pitch = 0.46 * m,
    bh = 0.38 * m,
    top = 0.55 * m,
    fs = 0.25 * m,
    pad = 0.14 * m;

  // Year rules and numerals, thick enough to hold at the far end of the hall.
  const bottom = top + places.length * pitch;
  g.font = `700 semi-expanded ${0.5 * m}px ${font}`;
  for (let y = 2023; y * 12 < end; y++) {
    const at = x(y * 12);
    if (y > 2023) {
      g.fillStyle = 'rgba(27,28,28,.22)';
      g.fillRect(at - 0.025 * m, top - 0.2 * m, 0.05 * m, bottom - top + 0.35 * m);
    }
    g.fillStyle = 'rgba(27,28,28,.5)';
    g.fillText(String(y), at + (y > 2023 ? 0.12 * m : 0), bottom + 0.72 * m);
  }

  places.forEach((p, i) => {
    const a = month(p.from, 'from'),
      b = month(p.to, 'to');
    const xa = x(a),
      xb = x(b),
      y = top + i * pitch;
    // Fuzzy ends: a start before the axis fades in over 0.8 m; a year-only end fades across its year.
    const fadeIn = a < start ? Math.min(0.8 * m, (xb - xa) / 3) : 0;
    const fadeOut = p.to.length === 4 ? xb - x(b - 12) : 0;
    const grad = g.createLinearGradient(xa, 0, xb, 0);
    grad.addColorStop(0, paint(fadeIn ? 0 : 0.88));
    if (fadeIn) grad.addColorStop(fadeIn / (xb - xa), paint(0.88));
    if (fadeOut) grad.addColorStop(1 - fadeOut / (xb - xa), paint(0.88));
    grad.addColorStop(1, paint(fadeOut ? 0 : 0.88));
    g.font = `700 semi-expanded ${fs}px ${font}`;
    const base = y + bh / 2 + fs * 0.36;

    if (p.shift) {
      // Two tones: the lighter first phase, then the solid one. The place is named just before the bar.
      const xs = x(month(p.shift.at, 'from'));
      g.fillStyle = paint(0.42);
      g.fillRect(xa, y, xs - xa, bh);
      g.fillStyle = paint(0.88);
      g.fillRect(xs, y, xb - xs, bh);
      g.fillStyle = ink;
      g.textAlign = 'right';
      g.fillText(p.place, xa - pad, base);
      g.textAlign = 'left';
      g.fillStyle = 'rgba(27,28,28,.72)';
      g.fillText(p.shift.before, xa + pad, base);
      g.fillStyle = paper;
      g.fillText(p.shift.after, xs + pad, base);
      return;
    }
    g.fillStyle = grad;
    g.fillRect(xa, y, xb - xa, bh);
    // A place that began before the axis carries its years, since the axis can't show them.
    const label = a < start ? `${p.place}, ${p.from} – ${p.to}` : p.place;
    const tw = g.measureText(label).width;
    const lx = xa + fadeIn * 0.6 + pad;
    if (lx + tw + pad <= xb - fadeOut * 0.5) {
      g.fillStyle = paper;
      g.fillText(label, lx, base);
    } else {
      g.fillStyle = ink;
      g.fillText(label, xb + pad, base);
    }
  });
}
