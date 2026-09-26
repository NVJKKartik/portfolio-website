import data from './writing/posts.json';

export type Post = {
  slug: string;
  title: string;
  date: string;
  source: 'DEV' | 'Medium';
  url: string;
  tags: string[];
  readingMinutes: number;
  excerpt: string;
  html: string;
};

export const snapshotAt: string = data.snapshotAt;
export const posts = data.posts as Post[];
export const postBySlug = (slug: string) => posts.find(p => p.slug === slug);

/**
 * Most titles are a setup and a turn ("My CI evals were green. A regression still paged me at 3 AM.").
 * Lists set the turn in weight. Never used on an article's own heading.
 */
export const splitTitle = (t: string): [string | null, string] => {
  const m = t.match(/^(.+?[.?!])\s+(.+)$/);
  return m && m[2].length > 8 ? [m[1], m[2]] : [null, t];
};
