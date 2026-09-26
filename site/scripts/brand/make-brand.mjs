// Renders the hall's posters, the social image, the interface-study stills and the icons from the live site.
//   (dev server or `npx serve out` on :3000)  node scripts/brand/make-brand.mjs [baseUrl]
// Uses installed Chrome so the hall renders on the GPU, not in software.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const base = process.argv[2] ?? 'http://localhost:3000';
const root = new URL('../../', import.meta.url);
const at = p => new URL(p, root).pathname;
const browser = await chromium.launch({ channel: 'chrome' });

/** Opens the hall with motion paused, so it holds the opening view (where the live room starts), and waits for the plates. */
async function hall(viewport, dpr, css) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: dpr });
  await page.addInitScript(() => localStorage.setItem('kartik:paused', '1'));
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: `nextjs-portal,.skip-link{display:none!important}${css}` });
  await page.waitForSelector('[data-live]', { timeout: 30000 });
  await page.waitForTimeout(5000);
  return page;
}

// Posters: the room alone, no text. The live room's first frame, and what reduced-motion visitors see.
const hide = (...parts) => `${parts.map(p => `section[aria-label="The hall"] [class*="${p}"]`).join(',')}{visibility:hidden!important}`;
const bare = `header{visibility:hidden!important}${hide('wall', 'hint', 'mini', 'caption', 'controls')}`;
for (const [file, vp, dpr] of [
  ['public/media/hall/poster-wide.webp', { width: 1440, height: 900 }, 1.25],
  ['public/media/hall/poster-tall.webp', { width: 450, height: 900 }, 2],
]) {
  const page = await hall(vp, dpr, bare);
  await sharp(await page.screenshot({ type: 'png' }))
    .webp({ quality: 80 })
    .toFile(at(file));
  await page.close();
}

// Social image: the opening frame with the wall text.
const page = await hall({ width: 1200, height: 630 }, 1, `header{visibility:hidden!important}${hide('hint', 'mini', 'count')}`);
const og = await page.screenshot({ type: 'png' });
await page.close();
await writeFile(at('app/opengraph-image.png'), og);
await writeFile(at('app/twitter-image.png'), og);
const alt = 'The hall: glass easels on concrete blocks in an open gallery, daylight through a glass wall, with N.V.J.K Kartik’s name.';
await writeFile(at('app/opengraph-image.alt.txt'), alt);
await writeFile(at('app/twitter-image.alt.txt'), alt);

// Interface studies: each captured live from its own page, in the state that shows its idea.
for (const [slug, file, state] of [
  ['nexus', 'nexus', 'Nudge'],
  ['centio', 'centio', 'Draft ready'],
  ['alumni-connect', 'alumni', 'Referral ask'],
]) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 2 });
  await p.goto(`${base}/work/${slug}/`, { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: state }).click();
  await p.waitForTimeout(1500);
  const stage = p.locator('figure > div').first();
  await sharp(await stage.screenshot({ type: 'png' }))
    .resize(1600)
    .webp({ quality: 86 })
    .toFile(at(`public/media/studies/${file}.webp`));
  await p.close();
}
await browser.close();

// Icons from the SVG mark.
const svg = await readFile(at('app/icon.svg'));
await sharp(svg, { density: 1200 }).resize(180, 180).png().toFile(at('app/apple-icon.png'));
await sharp(svg, { density: 2400 }).resize(1024, 1024).png().toFile(at('public/brand/avatar-1024.png'));
console.log('brand assets written');
