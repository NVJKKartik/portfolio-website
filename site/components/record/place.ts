import { exhibits, rows, rowYears } from '@/content/hall';

/** Where a record hangs in the hall, and the next record further back in time. */
export function placeInHall(id: string) {
  const row = rows.findIndex(r => r.some(e => e.id === id));
  const inside = exhibits.filter(e => !e.external);
  const i = inside.findIndex(e => e.id === id);
  return {
    where: row >= 0 ? rowYears(rows[row]) : '',
    back: row >= 0 ? `/#${id}` : '/',
    next: i >= 0 ? inside[(i + 1) % inside.length] : inside[0],
  };
}
