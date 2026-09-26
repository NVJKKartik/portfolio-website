// Snapshots Kartik's public posts (DEV API + Medium RSS) into content/writing/posts.json.
// Run manually: `npm run snapshot:writing`. The build never hits the network.
import { writeFile, mkdir } from 'node:fs/promises';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const DEV_USER = 'kartik-nvjk';
const MEDIUM_FEED = 'https://medium.com/feed/@kartik.nvj';
const OUT = new URL('../content/writing/posts.json', import.meta.url);

const slugify = s => {
  const slug = s
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return slug.length <= 72 ? slug : slug.slice(0, 73).replace(/-[^-]*$/, ''); // cut long ones at a word boundary
};

const strip = html =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// Allowlist sanitiser: only the tags the reading view styles; http(s)/mailto links only; no inline styles or handlers.
export function sanitize(html) {
  return sanitizeHtml(html.replace(/<img[^>]+medium\.com\/_\/stat[^>]*>/gi, ''), {
    allowedTags: [
      'p',
      'a',
      'strong',
      'em',
      'code',
      'pre',
      'blockquote',
      'ul',
      'ol',
      'li',
      'h2',
      'h3',
      'h4',
      'hr',
      'img',
      'figure',
      'figcaption',
      'br',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
    ],
    allowedAttributes: { a: ['href', 'title'], img: ['src', 'alt', 'title', 'width', 'height'] },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (_tag, attribs) => ({ tagName: 'a', attribs: { ...attribs, rel: 'noreferrer', target: '_blank' } }),
      img: (_tag, attribs) => ({ tagName: 'img', attribs: { ...attribs, loading: 'lazy', decoding: 'async' } }),
    },
  }).replace(/<figure>\s*<\/figure>/g, '');
}

async function fromDev() {
  const list = await (await fetch(`https://dev.to/api/articles?username=${DEV_USER}&per_page=100`)).json();
  const posts = [];
  for (const a of list) {
    const full = await (await fetch(`https://dev.to/api/articles/${a.id}`)).json();
    const body = full.body_markdown.replace(/^---[\s\S]*?---\s*/, '');
    posts.push({
      slug: slugify(a.title),
      title: a.title,
      date: a.published_at.slice(0, 10),
      source: 'DEV',
      url: a.url,
      tags: a.tag_list,
      readingMinutes: a.reading_time_minutes,
      excerpt: a.description,
      html: sanitize(await marked.parse(body)),
    });
  }
  return posts;
}

async function fromMedium() {
  const xml = await (await fetch(MEDIUM_FEED)).text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  return items.map(item => {
    const pick = tag => item.match(new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`))?.[1] ?? '';
    const html = sanitize(pick('content:encoded'));
    const text = strip(html);
    const title = pick('title');
    return {
      slug: slugify(title),
      title,
      date: new Date(pick('pubDate')).toISOString().slice(0, 10),
      source: 'Medium',
      url: pick('link').split('?')[0],
      tags: [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)].map(m => m[1]),
      readingMinutes: Math.max(1, Math.round(text.split(' ').length / 230)),
      excerpt: text.slice(0, 180).replace(/\s\S*$/, '') + '…',
      html,
    };
  });
}

if (process.argv.includes('--resanitize')) {
  // Re-run the sanitiser over the existing snapshot without touching the network.
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile(OUT, 'utf8'));
  data.posts.forEach(p => (p.html = sanitize(p.html)));
  await writeFile(OUT, JSON.stringify(data, null, 2));
  console.log(`Re-sanitised ${data.posts.length} posts`);
  process.exit(0);
}

const posts = [...(await fromDev()), ...(await fromMedium())].sort((a, b) => b.date.localeCompare(a.date));
await mkdir(new URL('.', OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ snapshotAt: new Date().toISOString(), posts }, null, 2));
console.log(`Saved ${posts.length} posts`);
