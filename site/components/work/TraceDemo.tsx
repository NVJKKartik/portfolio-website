'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { scenarios, findings, question, type Scenario } from '@/content/demo';
import { useMotion } from '@/lib/motion';
import s from './TraceDemo.module.css';

const ORDER: Scenario[] = ['healthy', 'broken', 'guarded'];
const EVAL_STAGES = ['Identify', 'Localise', 'Cluster', 'Score & summarise'];

export default function TraceDemo() {
  const [scenario, setScenario] = useState<Scenario>('healthy');
  const [selected, setSelected] = useState('llm');
  const [evalStep, setEvalStep] = useState(-1); // -1 idle, 0..3 revealing, 4 done
  const { reduced } = useMotion();
  const timers = useRef<number[]>([]);
  const run = scenarios[scenario];
  const finding = findings[scenario];
  const total = Math.max(...run.spans.map(sp => sp.end));
  const span = run.spans.find(sp => sp.id === selected) ?? run.spans[0];
  const showFailPath = scenario === 'broken' && evalStep >= 1;

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clear, []);

  const choose = (sc: Scenario) => {
    clear();
    setScenario(sc);
    setEvalStep(-1);
    setSelected(sc === 'guarded' ? 'guard' : sc === 'broken' ? 'retr' : 'llm');
  };

  const evaluate = () => {
    clear();
    if (reduced) {
      setEvalStep(4);
      return;
    }
    setEvalStep(0);
    for (let i = 1; i <= 4; i++)
      timers.current.push(
        window.setTimeout(() => {
          setEvalStep(i);
          if (i === 2 && finding.rootCause) setSelected(finding.rootCause.span);
        }, i * 650),
      );
  };

  const dashboard = useMemo(
    () => [
      { k: 'HTTP', v: '200', ok: true },
      { k: 'Latency', v: `${(total / 1000).toFixed(2)} s`, ok: true },
      { k: 'Error rate', v: '0.0%', ok: true },
      {
        k: 'Grounded?',
        v: evalStep >= 4 ? (finding.verdict === 'pass' ? 'yes' : 'no') : 'not measured',
        ok: evalStep >= 4 ? finding.verdict === 'pass' : null,
      },
    ],
    [total, evalStep, finding.verdict],
  );

  return (
    <div className={s.demo} data-scenario={scenario}>
      <div className={s.top}>
        <p className={s.disclaimer}>
          <span className={s.badge}>Illustrative demo</span> A fictional support agent, deterministic and local. It’s modelled on a real bug I{' '}
          <Link href="/writing/every-dashboard-was-green-while-my-agent-made-things-up-here-is-how-i/">wrote about</Link>. Not product output, not
          benchmark data.
        </p>
        <div className={s.scenarios} role="group" aria-label="Scenario">
          {ORDER.map((sc, i) => (
            <button key={sc} aria-pressed={scenario === sc} className={s.scenarioBtn} onClick={() => choose(sc)}>
              <span className={s.scNo}>{i + 1}</span> {scenarios[sc].label}
            </button>
          ))}
        </div>
      </div>

      <p className={s.blurb} aria-live="polite">
        {run.blurb}
      </p>

      <ul className={s.dash} aria-label="Monitoring dashboard">
        {dashboard.map(d => (
          <li key={d.k} className={s.tile} data-ok={d.ok === null ? undefined : String(d.ok)}>
            <span className="label">{d.k}</span>
            <span className={s.tileV}>
              <span className={s.lamp} aria-hidden /> {d.v}
            </span>
          </li>
        ))}
      </ul>

      <div className={s.body}>
        <div className={s.traceCol}>
          <p className={s.request}>
            <span className="label">user</span> {question}
          </p>
          <ol className={s.rows} aria-label="Trace spans. Select one to inspect.">
            {run.spans.map(sp => {
              const onPath = showFailPath && (sp.id === 'retr' || sp.id === 'llm' || sp.id === 'run');
              return (
                <li key={sp.id} className={s.rowItem}>
                  <button
                    className={s.row}
                    data-status={sp.status}
                    data-selected={selected === sp.id || undefined}
                    data-path={onPath || undefined}
                    data-new={sp.id === 'guard' || undefined}
                    aria-pressed={selected === sp.id}
                    onClick={() => {
                      setSelected(sp.id);
                    }}
                  >
                    <span className={s.rowName} style={{ paddingLeft: sp.depth * 16 }}>
                      {sp.depth > 0 && <span aria-hidden>└ </span>}
                      {sp.name}
                    </span>
                    <span className={s.rowTrack} aria-hidden>
                      <span
                        className={s.rowBar}
                        style={{ left: `${(sp.start / total) * 100}%`, width: `${Math.max(0.6, ((sp.end - sp.start) / total) * 100)}%` }}
                      />
                    </span>
                    <span className={s.rowMs}>{sp.status === 'skipped' ? 'skipped' : `${sp.end - sp.start} ms`}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          <div className={s.answer}>
            <span className="label">agent answered</span>
            <p key={scenario}>{run.answer}</p>
          </div>
        </div>

        <aside className={s.inspector} aria-label="Span inspector">
          <p className="label">inspect · {span.name}</p>
          <dl className={s.attrs}>
            {span.attrs.map(([k, v]) => (
              <div
                key={k}
                className={s.attr}
                data-alert={(k === 'documents.count' && v === '0') || (k === 'context' && v === '(empty)') || undefined}
              >
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      <div className={s.evalBar}>
        <button className={s.evalBtn} onClick={evaluate} disabled={evalStep >= 0 && evalStep < 4}>
          {evalStep >= 4 ? 'Run evaluation again' : evalStep >= 0 ? 'Evaluating…' : 'Run evaluation'}
        </button>
        <ol className={s.evalStages} aria-label="Evaluation stages">
          {EVAL_STAGES.map((st, i) => (
            <li key={st} data-done={evalStep > i || undefined} data-on={evalStep === i || undefined}>
              <span>{String(i + 1).padStart(2, '0')}</span> {st}
            </li>
          ))}
        </ol>
      </div>

      {evalStep >= 0 && (
        <div className={s.report} data-verdict={finding.verdict} aria-live="polite">
          <div className={s.reportCell} data-show={evalStep >= 1 || undefined}>
            <span className="label">identify</span>
            <p>{finding.identify}</p>
            <p className={s.cat}>{finding.category}</p>
          </div>
          <div className={s.reportCell} data-show={evalStep >= 2 || undefined}>
            <span className="label">localise</span>
            <p>{finding.rootCause?.text ?? 'Nothing to localise.'}</p>
          </div>
          <div className={s.reportCell} data-show={evalStep >= 3 || undefined}>
            <span className="label">cluster</span>
            <p>{finding.cluster}</p>
          </div>
          <div className={s.reportCell} data-show={evalStep >= 4 || undefined}>
            <span className="label">score · priority {finding.priority}</span>
            <ul className={s.scores}>
              {finding.scores.map(sc => (
                <li key={sc.label}>
                  <span>{sc.label}</span>
                  <span className={s.pips} aria-label={`${sc.value} of 5`}>
                    {[1, 2, 3, 4, 5].map(n => (
                      <i key={n} data-on={n <= sc.value || undefined} />
                    ))}
                  </span>
                </li>
              ))}
            </ul>
            <p className={s.summary}>{finding.summary}</p>
          </div>
        </div>
      )}
      {evalStep >= 4 && scenario === 'broken' && (
        <p className={s.next}>
          Every tile on the dashboard stayed green. Try <button onClick={() => choose('guarded')}>3 · Add the guard</button>.
        </p>
      )}
    </div>
  );
}
