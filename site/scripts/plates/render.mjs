// Renders every plate in draw.js to public/media/plates/<id>.webp. `npm run plates`.
// Needs the network once, for the Archivo and JetBrains Mono webfonts the plates are set in.
import http from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';
import sharp from 'sharp';

const here = new URL('.', import.meta.url).pathname;
const out = new URL('../../public/media/plates/', import.meta.url).pathname;
const types = { '.html': 'text/html', '.js': 'text/javascript' };
const server = http
  .createServer(async (req, res) => {
    try {
      const file = join(here, req.url === '/' ? 'index.html' : req.url.slice(1));
      res.writeHead(200, { 'content-type': types[extname(file)] ?? 'text/plain' }).end(await readFile(file));
    } catch {
      res.writeHead(404).end();
    }
  })
  .listen(0);

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`http://localhost:${server.address().port}/`);
await page.waitForFunction(() => window.ready === true);
const ids = await page.evaluate(() => window.plates.ids);
for (const id of ids) {
  const url = await page.evaluate(i => window.plates.png(i), id);
  await sharp(Buffer.from(url.split(',')[1], 'base64'))
    .resize(800)
    .webp({ quality: 84 })
    .toFile(join(out, `${id}.webp`));
  console.log(`plates/${id}.webp`);
}
await browser.close();
server.close();
