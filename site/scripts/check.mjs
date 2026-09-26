// Post-build integrity check: `npm run build && npm run check`.
// Fails if any internal link or asset in the static export points at nothing, if a page lacks a
// title/description/OG image, or if content references a missing post. Pass --external to also
// HEAD-check every outbound link (slow; uses the network).
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';

const OUT = new URL('../out/', import.meta.url).pathname;
const external = process.argv.includes('--external');
const errors = [];
const outbound = new Set();

async function* html(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* html(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const exists = async p => !!(await stat(p).catch(() => null));

async function resolves(href, from) {
  const [path] = href.split(/[?#]/);
  if (!path) return true; // pure hash link
  const abs = path.startsWith('/') ? join(OUT, path) : join(dirname(from), path);
  if (path.endsWith('/')) return exists(join(abs, 'index.html'));
  return (await exists(abs)) || (await exists(abs + '.html')) || (await exists(join(abs, 'index.html')));
}

let pages = 0;
for await (const file of html(OUT)) {
  if (file.includes('/_next/')) continue;
  pages++;
  const page = file.replace(OUT, '/');
  const src = await readFile(file, 'utf8');
  const isDoc = !/404|_not-found/.test(page);
  if (isDoc) {
    if (!/<title>[^<]{3,}<\/title>/.test(src)) errors.push(`${page}: missing <title>`);
    if (!/<meta name="description" content="[^"]{20,}/.test(src)) errors.push(`${page}: missing/short meta description`);
    if (!/<meta property="og:image"/.test(src)) errors.push(`${page}: missing og:image`);
    if (!/<main id="main"/.test(src)) errors.push(`${page}: missing <main id="main"> (skip link target)`);
    if (!/<h1[\s>]/.test(src)) errors.push(`${page}: no <h1>`);
  }
  const refs = [...src.matchAll(/\s(?:href|src)="([^"]+)"/g)].map(m => m[1].replace(/&amp;/g, '&'));
  for (const r of refs) {
    if (/^(mailto:|tel:|data:|javascript:)/.test(r)) continue;
    if (/^https?:\/\//.test(r)) {
      outbound.add(r);
      continue;
    }
    if (r.startsWith('#')) {
      const id = r.slice(1);
      if (id && !src.includes(`id="${id}"`)) errors.push(`${page}: in-page anchor #${id} has no target`);
      continue;
    }
    if (!(await resolves(r, file))) errors.push(`${page}: broken internal reference ${r}`);
  }
  // Hash links into the homepage must land on a real id or on an easel in the hall (data-exhibit).
  for (const [, id] of src.matchAll(/href="\/#([\w-]+)"/g)) {
    const home = await readFile(join(OUT, 'index.html'), 'utf8');
    if (!home.includes(`id="${id}"`) && !home.includes(`data-exhibit="${id}"`))
      errors.push(`${page}: /#${id} is neither an id nor an easel in the hall`);
  }
}

if (external) {
  const skip = /linkedin\.com|npmjs\.com|medium\.com|springer\.com|ieeexplore|fonts\.g/; // bot-walled; checked by hand
  for (const url of outbound) {
    if (skip.test(url)) continue;
    const res = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0 link-check' } }).catch(e => ({
      status: e.message,
    }));
    if (!(res.status >= 200 && res.status < 400)) errors.push(`outbound ${url} → ${res.status}`);
  }
}

console.log(`Checked ${pages} pages, ${outbound.size} unique outbound links${external ? ' (fetched)' : ''}.`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('OK');
