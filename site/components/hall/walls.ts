// The two painted end walls, drawn onto canvases the engine hangs on the concrete. Paint, not
// signage: flat colour and big type, nothing thin enough to shimmer as the camera moves.
// Coordinates are metres of wall (m = pixels per metre); both walls are 14.2 × 4.3 m.
import type { Walls } from '@/content/hall';

const WALL = 14.2;
const INK = '#1e1b17',
  INK_2 = '#4f483e',
  CREAM = '#fff8ec',
  TOMATO = '#e2552b';
/**
 * The back wall: "Rabbit holes, not hobbies." and each field with what came out of it, the depth in
 * my colour. Two columns of big type and nothing else: no rules or dots to shimmer at the far end.
 */
export function drawHoles(g: CanvasRenderingContext2D, W: number, walls: Walls, font: string) {
  const m = W / WALL;
  const x0 = 0.9 * m,
    col = 6.4 * m;
  g.textBaseline = 'alphabetic';
  g.fillStyle = INK;
  g.font = `800 expanded ${0.72 * m}px ${font}`;
  g.fillText('Rabbit holes, not hobbies.', x0, 1.25 * m);
  const pitch = 0.42 * m,
    y0 = 1.95 * m;
  // Both columns share one size, stepped down only if the longest line wouldn't fit the wall.
  let size = 0.27 * m;
  const widest = (weight: string, texts: string[]) => ((g.font = `${weight} ${size}px ${font}`), Math.max(...texts.map(t => g.measureText(t).width)));
  const fits = () =>
    widest(
      '800 semi-expanded',
      walls.holes.map(h => h[0]),
    ) <=
      col - x0 - 0.3 * m &&
    widest(
      '700',
      walls.holes.map(h => h[1]),
    ) <=
      W - col - 0.6 * m;
  while (size > 0.18 * m && !fits()) size *= 0.95;
  walls.holes.forEach(([field, depth], i) => {
    const y = y0 + i * pitch;
    g.fillStyle = INK;
    g.font = `800 semi-expanded ${size}px ${font}`;
    g.fillText(field, x0, y);
    g.fillStyle = TOMATO;
    g.font = `700 ${size}px ${font}`;
    g.fillText(depth, col, y);
  });
  if (walls.fun.length) {
    g.fillStyle = INK_2;
    g.font = `600 ${0.27 * m}px ${font}`;
    g.fillText(`Off the clock: ${new Intl.ListFormat('en-GB').format(walls.fun)}.`, x0, y0 + walls.holes.length * pitch + 0.2 * m);
  }
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
  const pill = `Got a rabbit hole for me? → ${email}`;
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
