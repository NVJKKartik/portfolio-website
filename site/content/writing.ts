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
