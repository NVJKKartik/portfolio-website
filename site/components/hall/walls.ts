// The two painted end walls, drawn onto canvases the engine hangs on the concrete. Paint, not
// signage: flat colour and big type, nothing thin enough to shimmer as the camera moves.
// Coordinates are metres of wall (m = pixels per metre); both walls are 14.2 × 4.3 m.
import type { Walls } from '@/content/hall';

const WALL = 14.2;
const INK = '#1e1b17',
  INK_2 = '#4f483e',
  CREAM = '#fff8ec',
  TOMATO = '#e2552b';
const WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
const count = (n: number) => WORDS[n] ?? String(n);

/** Cuts text to a width with an ellipsis, the way a browser squashes a tab. */
function fit(g: CanvasRenderingContext2D, t: string, w: number) {
  if (g.measureText(t).width <= w) return t;
  let s = t;
  while (s.length > 1 && g.measureText(`${s}…`).width > w) s = s.slice(0, -1);
  return `${s.trimEnd()}…`;
}

/**
 * The back wall: a painted browser window. The pinned tabs are the interests, then a tab per place,
 * newest first, the first one open. They squash as they run out of room, which is the joke.
 */
export function drawTabs(g: CanvasRenderingContext2D, W: number, walls: Walls, font: string) {
  const m = W / WALL;
  const x0 = 0.75 * m,
    y0 = 0.45 * m,
    ww = W - 2 * x0,
    wh = 3.5 * m;
  g.fillStyle = '#e6d6b9';
  g.beginPath();
  g.roundRect(x0, y0, ww, wh, 0.22 * m);
  g.fill();

  const top = y0 + 0.15 * m,
    th = 0.59 * m,
    pad = 0.13 * m;
  // Pinned and open tabs fit their words; the closed ones share what's left and squash.
  const width = (t: string, weight: number, extra = 0) => {
    g.font = `${weight} semi-expanded ${0.28 * m}px ${font}`;
    return g.measureText(t).width + 2 * pad + extra;
  };
  const pins = walls.fun.map(f => width(f, 700));
  const open = width(walls.places[0], 800, 0.3 * m);
  const rest = (ww - 0.4 * m - pins.reduce((a, b) => a + b, 0) - open - 0.5 * m) / Math.max(1, walls.places.length - 1);
  let x = x0 + 0.2 * m;
  const tab = (label: string, w: number, kind: 'pin' | 'open' | 'tab') => {
    if (kind === 'open') {
      g.fillStyle = CREAM;
      g.beginPath();
      g.roundRect(x, top, w - 0.05 * m, th + 0.2 * m, [0.15 * m, 0.15 * m, 0, 0]);
      g.fill();
    }
    g.font = `${kind === 'open' ? 800 : 700} semi-expanded ${0.28 * m}px ${font}`;
    g.fillStyle = kind === 'open' ? INK : '#6b5f4e';
    g.textBaseline = 'middle';
    const text = fit(g, label, w - 2 * pad - (kind === 'open' ? 0.3 * m : 0));
    g.fillText(text, x + pad, top + th / 2 + 0.03 * m);
    if (kind === 'open') {
      g.fillStyle = '#9b8f7c';
      g.fillText('×', x + pad + g.measureText(text).width + 0.14 * m, top + th / 2 + 0.03 * m);
    } else {
      // The divider between closed tabs: 4 cm wide, so it holds at the far end of the hall.
      g.fillStyle = '#c9b797';
      g.fillRect(x + w - 0.06 * m, top + 0.15 * m, 0.04 * m, 0.3 * m);
    }
    x += w;
  };
  walls.fun.forEach((f, i) => tab(f, pins[i], 'pin'));
  walls.places.forEach((p, i) => tab(p, i === 0 ? open : rest, i === 0 ? 'open' : 'tab'));
  g.font = `600 ${0.4 * m}px ${font}`;
  g.fillStyle = '#6b5f4e';
  g.fillText('+', x + 0.08 * m, top + th / 2);

  // The page: cream, with the line and the count.
  const py = y0 + 0.74 * m;
  g.fillStyle = CREAM;
  g.beginPath();
  g.roundRect(x0, py, ww, y0 + wh - py, [0, 0, 0.22 * m, 0.22 * m]);
  g.fill();
  g.textBaseline = 'alphabetic';
  g.fillStyle = INK;
  g.font = `800 expanded ${1.0 * m}px ${font}`;
  g.fillText('Too many tabs open.', x0 + 0.55 * m, y0 + 2.1 * m);
  const a = `${count(walls.places.length)} places I’ve studied and worked. `,
    b = `${count(walls.fun.length)} things I do for fun.`;
  g.font = `600 ${0.38 * m}px ${font}`;
  g.fillStyle = INK_2;
  g.fillText(a, x0 + 0.58 * m, y0 + 2.85 * m);
  const aw = g.measureText(a).width;
  g.font = `800 ${0.38 * m}px ${font}`;
  g.fillStyle = TOMATO;
  g.fillText(b, x0 + 0.58 * m + aw, y0 + 2.85 * m);
}

/** The exit wall: thanks for walking through, and the email on a tomato pill. No names; they're on the labels. */
export function drawThanks(g: CanvasRenderingContext2D, W: number, email: string, font: string) {
  const m = W / WALL;
  g.fillStyle = TOMATO;
  g.fillRect(0, 0, W, 0.2 * m);
  g.textBaseline = 'alphabetic';
  g.fillStyle = INK;
  g.font = `800 semi-expanded ${0.75 * m}px ${font}`;
  g.fillText('Thanks for walking through.', 1.1 * m, 1.45 * m);
  g.fillStyle = '#3e372e';
  g.font = `600 ${0.38 * m}px ${font}`;
  g.fillText('Everyone I built these with is on the labels. Thank you, too.', 1.13 * m, 2.2 * m);
  const pill = `One more tab won’t hurt → ${email}`;
  g.font = `800 semi-expanded ${0.35 * m}px ${font}`;
  const pw = g.measureText(pill).width + 0.44 * m,
    ph = 0.35 * m + 0.26 * m;
  g.fillStyle = TOMATO;
  g.beginPath();
  g.roundRect(1.1 * m, 2.8 * m, pw, ph, ph / 2);
  g.fill();
  g.fillStyle = CREAM;
  g.textBaseline = 'middle';
  g.fillText(pill, 1.1 * m + 0.22 * m, 2.8 * m + ph / 2 + 0.02 * m);
}
