import { work } from './work';
import { research } from './research';
import { speaking } from './more';
import { posts } from './writing';
import { journey } from './journey';

// Everything in the hall is derived from the content files, so a label can never disagree with its page.
// Order is time: the front row is the newest work, the back wall the oldest.

export type Exhibit = {
  id: string;
  title: string;
  short: string;
  when: string;
  /** YYYY-MM, for row order. */
  sort: string;
  place: string;
  medium: string;
  /** What Kartik did. */
  part: string;
  /** The line under the title on the easel: `part`, or its first sentence when that would run long. */
  caption: string;
  /** Who else made it. */
  credit: string;
  href: string;
  external?: boolean;
  image: { src: string; alt: string; ratio: number };
  study?: boolean;
};

const PLATE = 0.8;
/** Up to about three lines of caption: the whole part, else its first sentence, else that sentence up to its colon. */
const lead = (text: string) => {
  if (text.length <= 120) return text;
  const first = text.split(/(?<=\.)\s+(?=[A-Z])/)[0];
  return first.length <= 120 || !first.includes(':') ? first : `${first.split(':')[0]}.`;
};
const month = (iso: string) => iso.slice(0, 7);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthLabel = (iso: string) => `${MONTHS[+iso.slice(5, 7) - 1]} ${iso.slice(0, 4)}`;

const fromWork = work.map<Exhibit>(w => ({
  id: w.slug,
  title: w.name,
  short: w.short ?? w.name,
  when: w.years,
  sort: w.sort,
  place: w.place,
  medium: w.medium,
  part: w.contribution[0],
  caption: w.caption ?? lead(w.contribution[0]),
  credit: w.collaborators,
  href: `/work/${w.slug}/`,
  image: { src: w.cover.src, alt: w.cover.alt, ratio: w.cover.ratio ?? PLATE },
  study: !!w.study,
}));

// AgentCompass already has a case study (with the demo), so its paper isn't hung twice.
const fromResearch = research
  .filter(r => !work.some(w => w.slug === r.slug))
  .map<Exhibit>(r => {
    const others = r.authors.filter(a => !a.me).map(a => a.name);
    const patent = r.kind === 'Granted patent';
    // The role line names co-authors; the credit line lists them, so the label says each thing once.
    const part = r.role.includes(', with') ? `${r.role.split(', with')[0]}.` : r.role;
    return {
      id: r.slug,
      title: r.shortTitle,
      short: r.short,
      when: monthLabel(r.date),
      sort: month(r.date),
      place: r.place,
      medium: `${r.kind} · ${r.venue}`,
      part,
      caption: lead(part),
      credit: `${patent ? 'Co-inventors' : 'Co-authors'}: ${others.join(', ')}.`,
      href: `/research/${r.slug}/`,
      image: patent
        ? {
            src: '/media/work/patent.webp',
            alt: 'Figure from US 12,608,610 B1: the multi-agent synthetic data generation framework.',
            ratio: 1434 / 1320,
          }
        : { src: `/media/plates/${r.slug}.webp`, alt: `Plate: ${r.shortTitle}.`, ratio: PLATE },
    };
  });

const talks = speaking.map<Exhibit>(s => ({
  id: s.slug,
  title: s.title.split(':')[0],
  short: 'Talk',
  when: monthLabel(s.date),
  sort: month(s.date),
  place: s.event,
  medium: 'Live session',
  part: s.role,
  caption: lead(s.role),
  credit: s.credit,
  href: s.href,
  external: true,
  image: { src: `/media/plates/${s.slug}.webp`, alt: `Plate: ${s.title}.`, ratio: PLATE },
}));

const oldest = posts[posts.length - 1];
const writing: Exhibit = {
  id: 'writing',
  title: 'Posts about what broke',
  short: 'Writing',
  when: `${oldest.date.slice(0, 4)} — now`,
  sort: month(oldest.date),
  place: 'DEV and Medium',
  medium: `${posts.length} posts`,
  part: 'Posts on evals, tracing and agents in production, most of them starting from something that broke.',
  caption: 'Posts on evals, tracing and agents in production, most of them starting from something that broke.',
  credit: 'Written alone.',
  href: '/writing/',
  image: { src: '/media/plates/writing.webp', alt: 'Plate: “My CI evals were green. A regression still paged me at 3 AM.”', ratio: PLATE },
};

export const exhibits: Exhibit[] = [...fromWork, ...fromResearch, ...talks, writing].sort((a, b) => b.sort.localeCompare(a.sort));

/** Rows alternate four and three easels, so every row stands in the gaps of the one in front. */
const ROW_SIZES = [4, 3, 4, 3, 4, 3, 2];
export const rows: Exhibit[][] = (() => {
  const out: Exhibit[][] = [];
  let i = 0;
  for (let k = 0; i < exhibits.length; k++) {
    const n = ROW_SIZES[k] ?? 4;
    out.push(exhibits.slice(i, i + n));
    i += n;
  }
  return out;
})();

/** A row's span: "Jun–Sep 2026" within one year, "Jun 2024 – Jun 2025" across two. */
export const rowYears = (row: Exhibit[]) => {
  const s = row.map(e => e.sort).sort();
  const [a, b] = [s[0], s[s.length - 1]];
  const [ma, mb] = [MONTHS[+a.slice(5, 7) - 1], MONTHS[+b.slice(5, 7) - 1]];
  if (a.slice(0, 4) !== b.slice(0, 4)) return `${ma} ${a.slice(0, 4)} – ${mb} ${b.slice(0, 4)}`;
  return ma === mb ? `${ma} ${a.slice(0, 4)}` : `${ma}–${mb} ${a.slice(0, 4)}`;
};

export const exhibitById = (id: string) => exhibits.find(e => e.id === id);

// ——— the two painted walls ———

/**
 * The exit wall: everyone the easel labels credit, grouped by where the work was made, oldest first,
 * spelled exactly as credited. A group's last line names the team when the credit does.
 */
export type CreditGroup = { place: string; names: string[] };
export const madeWith: CreditGroup[] = [
  { place: 'IIIT Dharwad', names: ['Aarsh Desai', 'AryanTN05', 'Priyesh Gupta', 'Rohith Yadav', 'Vinayak Rai', 'Vivaan Sharma'] },
  {
    place: 'IIT Bombay',
    names: [
      'Aarsh Desai',
      'Ashwin T S',
      'Manjunath K. Vanahalli',
      'Priyesh Gupta',
      'Ramkumar Rajendran',
      'Vinayak Rai',
      'Vishwas Badhe',
      'the Educational Technology group',
    ],
  },
  { place: 'Vocab.AI', names: ['the Vocab.AI team'] },
  { place: 'NIT Puducherry', names: ['the Department of CSE'] },
  { place: 'IIT Madras', names: ['RBCDSAI'] },
  // Too many people to name fairly here; each Future AGI easel carries its own credit.
  { place: 'Future AGI', names: ['the Future AGI team'] },
];
// A name on the wall must be one an easel label actually credits: this fails the build on a typo or an invention.
{
  const credited = exhibits.map(e => e.credit).join(' ');
  for (const g of madeWith)
    for (const n of g.names) {
      const core = n.replace(/^(and )?the /, '');
      if (!credited.includes(core)) throw new Error(`madeWith: "${n}" (${g.place}) isn't credited on any easel`);
    }
}

/** The back wall: where the work was made, as painted bars on a time axis. From the journey's dated stops. */
export type Place = { place: string; from: string; to: string; shift?: { at: string; before: string; after: string } };
export const places: Place[] = journey
  .filter(j => j.span)
  .map(j => ({ place: j.place.split(' · ')[0], from: j.span![0], to: j.span![1], shift: j.shift }));
