import type { Exhibit } from '@/content/hall';
import { layout } from './layout';
import s from './Plan.module.css';

type Props = {
  rows: Exhibit[][];
  /** The small corner plan in the hall: marks and the visitor, nothing to click. */
  mini?: boolean;
  active?: string | null;
  onHover?: (id: string | null) => void;
  youRef?: React.Ref<SVGGElement>;
};

/**
 * A drawn plan of the room, seen from above the way the crane sees it: entrance at the bottom, the
 * glass wall on the left, newest row nearest the door. Its box is the floor exactly, so it can sit
 * on the render. Text lives in HTML beside it; at this scale SVG labels would be unreadable.
 */
export default function Plan({ rows, mini, active, onHover, youRef }: Props) {
  const h = layout(rows);
  const W = h.x1 - h.x0,
    D = h.z0 - h.z1;
  const vb = mini ? [h.x0 - 0.6, h.z1 - 0.4, W + 1.2, D + 0.8] : [h.x0, h.z1, W, D];
  const byId = new Map(rows.flat().map(e => [e.id, e]));
  const mullions: number[] = [];
  for (let z = h.z0; z > h.z1; z -= 1.9) mullions.push(z);
  return (
    <svg className={`${s.plan} ${mini ? s.mini : ''}`} viewBox={vb.join(' ')} aria-hidden>
      <path className={s.walls} d={`M${h.x0} ${h.z0} V${h.z1} H${h.x1} V${h.z0} Z`} />
      <line className={s.glass} x1={h.x0} x2={h.x0} y1={h.z0} y2={h.z1} />
      {!mini && mullions.map(z => <line key={z} className={s.mull} x1={h.x0 - 0.14} x2={h.x0 + 0.14} y1={z} y2={z} />)}
      {h.placed.map(p => {
        const e = byId.get(p.id)!;
        const mark = (
          <g transform={`translate(${p.x} ${p.z}) rotate(${((-p.yaw * 180) / Math.PI).toFixed(1)})`}>
            <rect className={s.base} x={-0.22} y={-0.22} width={0.44} height={0.44} />
            <line className={s.pane} x1={-0.54} x2={0.54} y1={0} y2={0} />
          </g>
        );
        return (
          <g
            key={p.id}
            className={`${s.work} ${p.id === active ? s.hot : ''}`}
            onMouseEnter={onHover ? () => onHover(p.id) : undefined}
            onMouseLeave={onHover ? () => onHover(null) : undefined}
          >
            {mini ? (
              mark
            ) : (
              // The key beside the plan carries the same links for keyboards and screen readers.
              <a href={e.href} tabIndex={-1} target={e.external ? '_blank' : undefined} rel={e.external ? 'noreferrer' : undefined}>
                <rect className={s.hit} x={p.x - 0.9} y={p.z - 0.8} width={1.8} height={1.6} />
                {mark}
              </a>
            )}
          </g>
        );
      })}
      {youRef && (
        <g ref={youRef} className={s.you}>
          <path d="M0 -.55 L.42 .45 L-.42 .45Z" />
        </g>
      )}
    </svg>
  );
}
