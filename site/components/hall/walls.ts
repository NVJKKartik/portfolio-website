// The art on the hall's end walls: canvases of nested squares, after Josef Albers's Homage to the
// Square. Each square sits inside the last and a little low, so the eye is pulled in and down: a
// rabbit hole with no words. Flat colour with a faint brush grain, nothing fine enough to shimmer.

const DEEP = '#264e41',
  GREEN = '#3d7a64',
  OCHRE = '#d8a24a',
  TOMATO = '#e2552b',
  CREAM = '#f3e9d6',
  SAND = '#c9b28c',
  BASALT = '#2a2926';

/** Outermost colour first. */
export const PAINTINGS = {
  back: [DEEP, GREEN, OCHRE, TOMATO],
  left: [CREAM, SAND, OCHRE, TOMATO],
  middle: [TOMATO, OCHRE, CREAM, GREEN],
  right: [BASALT, DEEP, GREEN, CREAM],
} as const;

/**
 * Paints one canvas on a square context of side n. Albers's proportions on a ten-unit grid: each
 * square is two units smaller, one unit in from the sides, a unit and a half from the top and half a
 * unit from the bottom of the one outside it.
 */
export function drawHomage(g: CanvasRenderingContext2D, n: number, colours: readonly string[], seed: number) {
  let s = seed;
  const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const u = n / 10;
  colours.forEach((c, k) => {
    const side = (10 - 2 * k) * u,
      x = k * u,
      y = 1.5 * k * u;
    g.fillStyle = c;
    g.fillRect(x, y, side, side);
    // Brush grain: short, soft, low-contrast strokes, clipped to the square.
    g.save();
    g.beginPath();
    g.rect(x, y, side, side);
    g.clip();
    g.lineCap = 'round';
    for (let i = 0; i < 260 * (side / n); i++) {
      g.strokeStyle = rand() < 0.5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.035)';
      g.lineWidth = (0.004 + rand() * 0.01) * n;
      const px = x + rand() * side,
        py = y + rand() * side,
        len = (0.03 + rand() * 0.09) * n;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(px + len, py + (rand() - 0.5) * 0.01 * n);
      g.stroke();
    }
    g.restore();
  });
}
