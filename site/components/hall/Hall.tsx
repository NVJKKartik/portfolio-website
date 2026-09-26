'use client';

import Link from 'next/link';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import type { Exhibit } from '@/content/hall';
import { useMotion } from '@/lib/motion';
import type { HallController } from './engine';
import { layout, planFrame, ROW, type Frame } from './layout';
import Plan from './Plan';
import s from './Hall.module.css';

// The crane takes this much of the stage's scroll; the rest holds on the plan before the catalogue.
const CRANE_END = 0.85;
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type Props = { rows: Exhibit[][]; years: string[]; name: string; intro: string; proof: string };

/**
 * The top of the home page: the WebGL hall under an HTML overlay. Everything readable here is HTML;
 * the canvas only reports where the visitor is and what they're looking at. Scrolling lifts the roof
 * off and cranes up to a drawn plan of the room; the catalogue follows.
 */
export default function Hall({ rows, years, name, intro, proof }: Props) {
  const exhibits = rows.flat();
  const hall = layout(rows);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const gl = useRef<HTMLDivElement>(null);
  const you = useRef<SVGGElement>(null);
  const bigYou = useRef<SVGGElement>(null);
  const lift = useRef(0);
  const ctl = useRef<HallController | null>(null);
  const halfTurn = useRef<ReturnType<typeof setTimeout>>(undefined);
  const { reduced, paused, togglePaused } = useMotion();
  // Reduced motion, or a browser that couldn't run the engine: the still poster, no crane.
  const [failed, setFailed] = useState(false);
  const still = reduced || failed;
  const [live, setLive] = useState(false);
  const [at, setAt] = useState<string | null>(null);
  const [back, setBack] = useState(false);
  const [moving, setMoving] = useState(false);
  // Walking on their own (drag, keys, floor clicks): the entrance plaque stays down until they go back.
  const [roaming, setRoaming] = useState(false);
  const [tip, setTip] = useState<{ id: string; x: number; y: number } | null>(null);
  const [planHover, setPlanHover] = useState<string | null>(null);
  // Off the floor (the room's controls step aside), and high enough for the drawn plan to take over.
  const [craned, setCraned] = useState(false);
  const [planOn, setPlanOn] = useState(false);
  const [frame, setFrame] = useState<Frame | null>(null);

  const current = at ? (exhibits.find(e => e.id === at) ?? null) : null;
  const index = current ? exhibits.indexOf(current) : -1;

  // Boot the engine once the stage is on screen. Reduced motion keeps the still frame; the catalogue is the way in.
  useEffect(() => {
    if (reduced || !gl.current) return;
    let disposed = false;
    const el = gl.current;
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || ctl.current) return;
        io.disconnect();
        const font = getComputedStyle(document.documentElement).getPropertyValue('--font-archivo').trim() || 'Arial';
        await Promise.all(['400 28px', '600 108px', '650 40px'].map(w => document.fonts.load(`${w} ${font}`).catch(() => [])));
        const hash = decodeURIComponent(location.hash.slice(1));
        const mobile = el.clientWidth / el.clientHeight < 0.8;
        try {
          const { createHall } = await import('./engine');
          if (disposed) return;
          ctl.current = await createHall(el, {
            rows,
            years,
            font,
            reduced: false,
            mobile,
            quality: mobile || (navigator.hardwareConcurrency ?? 8) < 6 ? 'low' : 'high',
            start: exhibits.some(e => e.id === hash) ? hash : undefined,
            on: {
              ready: () => setLive(true),
              hover: (id, x, y) => setTip(id ? { id, x, y } : null),
              roam: () => {
                setRoaming(true);
                setAt(null);
                setBack(false);
                setMoving(false);
                setTip(null);
                if (exhibits.some(e => `#${e.id}` === location.hash)) history.replaceState(null, '', location.pathname);
              },
              walk: id => {
                setAt(id);
                setBack(false);
                setMoving(true);
                setTip(null);
              },
              arrive: id => {
                setAt(id);
                setBack(false);
                setMoving(false);
                if (id) history.replaceState(null, '', `#${id}`);
                else if (exhibits.some(e => `#${e.id}` === location.hash)) history.replaceState(null, '', location.pathname);
              },
              turned: (_, b) => {
                setBack(b);
                setMoving(false);
              },
              pose: (x, z, yaw) => {
                const t = `translate(${x.toFixed(2)} ${z.toFixed(2)}) rotate(${((yaw * 180) / Math.PI).toFixed(1)})`;
                you.current?.setAttribute('transform', t);
                bigYou.current?.setAttribute('transform', t);
              },
            },
          });
        } catch (err) {
          // No WebGL, a lost context or a software renderer: the poster stays and the crane goes, as with
          // reduced motion. The catalogue below is the way in either way.
          console.warn('The hall is staying on its poster:', err);
          if (!disposed) setFailed(true);
          return;
        }
        if (disposed) ctl.current.dispose();
        else ctl.current.crane(lift.current);
      },
      { rootMargin: '100px' },
    );
    io.observe(el);
    return () => {
      disposed = true;
      io.disconnect();
      clearTimeout(halfTurn.current);
      ctl.current?.dispose();
      ctl.current = null;
    };
    // rows/years are static page data; the engine is built once per visit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  useEffect(() => ctl.current?.setPaused(paused), [paused, live]);

  // The stage is sticky inside a taller section; how far through it the page is drives the crane.
  // Reduced motion has no crane: the section is one screen and the catalogue is the way in.
  useEffect(() => {
    if (still || !section.current || !stage.current) return;
    const el = section.current,
      st = stage.current;
    let raf = 0;
    const read = () => {
      raf = 0;
      const r = el.getBoundingClientRect(),
        range = r.height - innerHeight;
      const u = range > 0 ? clamp01(-r.top / (range * CRANE_END)) : 0;
      lift.current = u;
      st.style.setProperty('--p', u.toFixed(4));
      ctl.current?.crane(u);
      setCraned(u > 0.03);
      setPlanOn(u > 0.8);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(read));
    const ro = new ResizeObserver(() => {
      setFrame(planFrame(hall, st.clientWidth, st.clientHeight));
      onScroll();
    });
    ro.observe(st);
    read();
    addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener('scroll', onScroll);
    };
    // hall is derived from static page data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still]);

  /** Scrolls to the top of the crane (or back down into the room), so the camera flies there with the page. */
  const rise = (up: boolean) => {
    const el = section.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const top = scrollY + r.top + (up ? (r.height - innerHeight) * 0.93 : 0);
    scrollTo({ top, behavior: paused ? 'auto' : 'smooth' });
  };

  const walk = (id: string) => {
    setMoving(true);
    setBack(false);
    setTip(null);
    ctl.current?.walkTo(id);
  };
  const turn = () => {
    setMoving(true);
    clearTimeout(halfTurn.current);
    // The label arrives halfway round, not after the orbit, so the turn never feels like a wait.
    if (!back) halfTurn.current = setTimeout(() => setBack(true), paused ? 0 : 700);
    else setBack(false);
    ctl.current?.turn();
  };
  const step = (d: number) => walk(exhibits[(index + d + exhibits.length) % exhibits.length].id);
  const entrance = () => {
    setMoving(true);
    setRoaming(false);
    setAt(null);
    setBack(false);
    ctl.current?.entrance();
  };

  // WASD and arrows walk (the engine handles those once the room has focus). R turns a work around; Escape goes back to the entrance.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if ((e.target as HTMLElement).closest('input, textarea') || e.metaKey || e.ctrlKey || !ctl.current) return;
    if ((e.key === 'r' || e.key === 'R') && current) turn();
    else if (e.key === 'Escape' && (current || roaming)) entrance();
    else return;
    e.preventDefault();
  });
  useEffect(() => {
    const h = (e: KeyboardEvent) => onKey(e);
    addEventListener('keydown', h);
    return () => removeEventListener('keydown', h);
  }, []);

  const tipE = tip ? exhibits.find(e => e.id === tip.id) : null;
  // Hidden overlay layers are also inert, so their links drop out of the tab order.
  const off = (hidden: boolean) => (hidden ? { 'data-off': true, inert: true } : {});
  const keyHover = (id: string) => ({
    'data-hot': planHover === id || undefined,
    onMouseEnter: () => setPlanHover(id),
    onMouseLeave: () => setPlanHover(null),
  });
  const rowY = (k: number) => (frame ? frame.y + ((-k * ROW - hall.z1) / (hall.z0 - hall.z1)) * frame.h : 0);

  return (
    <section ref={section} className={s.hall} aria-label="The hall" data-crane={!still || undefined}>
      <div ref={stage} className={s.stage} data-live={live || undefined}>
        <img
          className={s.poster}
          src="/media/hall/poster-wide.webp"
          srcSet="/media/hall/poster-tall.webp 900w, /media/hall/poster-wide.webp 1800w"
          sizes="100vw"
          alt=""
          data-hidden={live || undefined}
        />
        <div ref={gl} className={s.gl} />
        <div className={s.grade} aria-hidden />

        <div className={s.wall} {...off(!!current || roaming || craned)}>
          <h1>{name}</h1>
          <p>{intro}</p>
          <p className={s.proof}>{proof}</p>
          <a className={s.skip} href="#work">
            Every work, as a list ↓
          </a>
        </div>

        {!still && (
          <div className={s.hint} {...off(!!current || !live || craned)}>
            <p>
              Drag to look around. Click the floor to walk there, or a work to go to it.
              <br />
              Once you’re in the room, WASD or the arrow keys walk.
            </p>
            <span className={s.hintBtns}>
              {roaming && (
                <button type="button" onClick={entrance}>
                  Back to the entrance
                </button>
              )}
              <button type="button" onClick={togglePaused} aria-pressed={paused}>
                {paused ? 'Resume motion' : 'Pause motion'}
              </button>
            </span>
          </div>
        )}

        {!still && (
          <button
            type="button"
            className={s.mini}
            {...off(!live || !!current || craned)}
            onClick={() => rise(true)}
            aria-label="Rise to the plan of the room"
          >
            <span>Plan</span>
            <Plan rows={rows} mini active={at} youRef={you} />
          </button>
        )}

        {tipE && !craned && (
          <div className={s.tip} style={{ transform: `translate(${tip!.x}px, ${tip!.y}px) translate(-50%, -110%)` }}>
            <b>{tipE.title}</b>
            <span>{tipE.when}</span>
          </div>
        )}

        {current && (
          <>
            <div className={s.caption} {...off(back || moving || craned)}>
              <span>
                {current.when} · {current.place}
              </span>
              <b>{current.title}</b>
              <p>{current.part}</p>
            </div>
            <div className={s.controls} {...off(craned)}>
              <button type="button" onClick={() => step(-1)} aria-label="Previous work">
                ←
              </button>
              <button type="button" onClick={turn}>
                {back ? 'Turn it back' : 'Turn it around'}
              </button>
              {current.external ? (
                <a className={s.primary} href={current.href} target="_blank" rel="noreferrer">
                  Open ↗
                </a>
              ) : (
                <Link className={s.primary} href={current.href}>
                  Open the record
                </Link>
              )}
              <button type="button" onClick={() => step(1)} aria-label="Next work">
                →
              </button>
              <button type="button" onClick={entrance} className={s.side}>
                Entrance
              </button>
            </div>
          </>
        )}

        {current && (
          <aside className={s.label} data-on={(back && !craned) || undefined} inert={!back || craned} aria-label="Label on the back of the easel">
            <div className={s.k}>Back of the easel</div>
            <h2>{current.title}</h2>
            <div className={s.d}>
              {current.when} · {current.place}
            </div>
            <div className={s.m}>{current.medium}</div>
            <hr />
            <h3>Kartik’s part</h3>
            <p>{current.part}</p>
            <h3>Credit</h3>
            <p className={s.credit}>{current.credit}</p>
          </aside>
        )}

        {!still && (
          <>
            <div className={s.sheet} aria-hidden />
            <div className={s.drawn} inert={!planOn} role="region" aria-label="Plan of the room">
              {/* Landscape: a title block at the foot of the key, level with the entrance, as on a drawing. */}
              <div
                className={s.planHead}
                style={frame?.key ? { left: frame.key.x, top: 'auto', bottom: `calc(100% - ${frame.y + frame.h}px)` } : undefined}
              >
                <h2>Plan of the room</h2>
                <p>From above: the entrance at the bottom, the newest work nearest the door.</p>
                <button type="button" onClick={() => rise(false)}>
                  Back into the room ↑
                </button>
              </div>
              {frame && (
                <>
                  <div className={s.drawing} style={{ left: frame.x, top: frame.y, width: frame.w, height: frame.h }}>
                    <Plan rows={rows} active={planHover} onHover={setPlanHover} youRef={bigYou} />
                    <span className={s.glassNote}>Glass wall</span>
                    <span className={s.door}>Entrance</span>
                  </div>
                  {frame.key && (
                    <ol className={s.key} style={{ left: frame.key.x, width: frame.key.w }}>
                      {rows.map((row, k) => (
                        <li key={k} style={{ top: rowY(k) }}>
                          <span>{years[k]}</span>
                          <p>
                            {row.map((e, j) => (
                              <span key={e.id}>
                                {j > 0 && <span aria-hidden> · </span>}
                                {e.external ? (
                                  <a href={e.href} target="_blank" rel="noreferrer" {...keyHover(e.id)}>
                                    {e.title} ↗
                                  </a>
                                ) : (
                                  <Link href={e.href} {...keyHover(e.id)}>
                                    {e.title}
                                  </Link>
                                )}
                              </span>
                            ))}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
