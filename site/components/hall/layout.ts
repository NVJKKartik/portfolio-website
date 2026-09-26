import type { Exhibit } from '@/content/hall';

// Where every easel stands. Shared by the WebGL hall and the drawn plan so they can't disagree.
// Units are metres. The entrance is at +z; rows run back toward -z, one row per span of time.

export const ROW = 3.7;
export const AISLE = -5.55; // the walkway along the glass wall
export const EYE = 1.6;

export type Placed = { id: string; row: number; x: number; z: number; yaw: number };
export type Hall = { x0: number; x1: number; z0: number; z1: number; h: number; placed: Placed[] };

export function layout(rows: Pick<Exhibit, 'id'>[][]): Hall {
  let s = 21;
  const rand = () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
  const placed: Placed[] = [];
  rows.forEach((row, k) => {
    const xs =
      row.length === 4
        ? [-4.35, -1.45, 1.45, 4.3]
        : row.length === 3
          ? [-2.9, 0, 2.9]
          : row.length === 2
            ? [-1.45, 1.45]
            : row.map((_, j) => -4.35 + (j * 8.65) / Math.max(1, row.length - 1));
    row.forEach((e, j) =>
      placed.push({ id: e.id, row: k, x: xs[j] + (rand() - 0.5) * 0.4, z: -k * ROW + (rand() - 0.5) * 0.5, yaw: (rand() - 0.5) * 0.12 }),
    );
  });
  return { x0: -7, x1: 7.2, z0: 9, z1: -rows.length * ROW - 3.5, h: 4.3, placed };
}

export type Frame = { x: number; y: number; w: number; h: number; key: { x: number; w: number } | null };

/**
 * Where the room's floor sits on screen at the top of the crane, in CSS pixels of a w×h stage.
 * The engine puts its camera wherever makes this true and the drawn plan is laid over the same box,
 * so the drawing lands exactly on the render. Landscape leaves room for a key beside the plan.
 */
export function planFrame(hall: Hall, w: number, h: number): Frame {
  const ratio = (hall.x1 - hall.x0) / (hall.z0 - hall.z1);
  const tall = w / h < 0.8;
  // A phone's heading carries a picker too, so the plan starts lower.
  const top = tall ? 176 : 64,
    bottom = tall ? 40 : 56;
  let fh = h - top - bottom,
    fw = fh * ratio;
  const room = tall ? w - 64 : w * 0.34;
  if (fw > room) {
    fw = room;
    fh = fw / ratio;
  }
  const y = top + (h - top - bottom - fh) / 2;
  if (tall) return { x: (w - fw) / 2, y, w: fw, h: fh, key: null };
  // The plan and its key read as one drawing, centred on the stage.
  const gap = 64,
    kw = Math.min(580, w - fw - gap - 96);
  const x = (w - (fw + gap + kw)) / 2;
  return { x, y, w: fw, h: fh, key: { x: x + fw + gap, w: kw } };
}
