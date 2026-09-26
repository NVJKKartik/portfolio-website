import { exhibits, rows } from '@/content/hall';

/** How to get back to a record's easel, and the next record further back in time (the newest, after the oldest). */
export function placeInHall(id: string) {
  const row = rows.findIndex(r => r.some(e => e.id === id));
  const inside = exhibits.filter(e => !e.external);
  const i = inside.findIndex(e => e.id === id);
  return {
    back: row >= 0 ? `/#${id}` : '/',
    next: i >= 0 ? inside[(i + 1) % inside.length] : inside[0],
    wrapped: i === inside.length - 1,
  };
}
