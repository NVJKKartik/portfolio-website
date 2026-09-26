import type { Metadata } from 'next';

// Child pages that set openGraph replace the parent's object wholesale, so they must carry the image too.
const image = {
  url: '/opengraph-image.png',
  width: 1200,
  height: 630,
  alt: 'The hall: glass easels on concrete blocks in an open gallery, daylight through a glass wall, with N.V.J.K Kartik’s name.',
};

export const og = (title: string, description: string, extra: NonNullable<Metadata['openGraph']> = {}): Metadata['openGraph'] => ({
  title: `${title} · Kartik`,
  description,
  images: [image],
  ...extra,
});
