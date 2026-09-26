// Builds the real captures the site ships from media-src/ into public/media/work/.
//   node scripts/media/build-media.mjs
// Drawn plates live in scripts/plates (npm run plates); interface studies are captured by npm run brand.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const root = new URL('../../', import.meta.url).pathname;
const src = f => `${root}media-src/${f}`;
const out = f => `${root}public/media/work/${f}`;
await mkdir(out(''), { recursive: true });

const webp = (img, file, q = 80) => img.webp({ quality: q, effort: 5 }).toFile(out(file));

// ── Real captures ──────────────────────────────────────────────────────
const crops = [
  // [source, output, extract?, width]
  ['ac-Trace1.png', 'ac-trace.webp', { left: 0, top: 0, width: 1182, height: 1394 }, 900],
  ['ac-Reccom1.png', 'ac-recs.webp', { left: 0, top: 0, width: 1700, height: 1022 }, 1400],
  ['ac-page-01.png', 'ac-paper.webp', { left: 90, top: 110, width: 1060, height: 900 }, 1000],
  ['nexus.jpg', 'nexus.webp', null, 1080],
  ['hivemind.jpg', 'hivemind.webp', null, 1400],
  ['centio.png', 'centio.webp', null, 1366],
  ['alumni-feed.jpg', 'alumni-feed.webp', null, 600],
  ['alumni-jobs.jpg', 'alumni-jobs.webp', null, 600],
  ['traceai-logo.png', 'platform.webp', null, 1600],
];
for (const [s, o, ext, w] of crops) {
  let img = sharp(src(s)).flatten({ background: '#ffffff' });
  if (ext) img = img.extract(ext);
  await webp(img.resize({ width: w, withoutEnlargement: true }), o);
}
// Patent drawing: small line-art GIF. Upscale cleanly and set on paper.
await webp(
  sharp(src('patent-D00000.gif'))
    .resize({ width: 1074, kernel: 'lanczos3' })
    .flatten({ background: '#fbf8f2' })
    .extend({ top: 60, bottom: 60, left: 180, right: 180, background: '#fbf8f2' }),
  'patent.webp',
  86,
);

console.log('media built');
