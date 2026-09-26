import path from 'node:path';
import sharp from 'sharp';

export type Tint = { bg: string; ink: string; light: boolean };

/**
 * A record's top takes the colour of its own plate: the average of the image's outer edge, nudged off
 * the plate so it still reads as an object on the ground, with ink picked by luminance. Runs at build
 * time on the file in public/, so it can't drift from the image.
 */
export async function tintOf(src: string): Promise<Tint> {
  const { data } = await sharp(path.join(process.cwd(), 'public', src))
    .resize(40, 50, { fit: 'fill' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let r = 0,
    g = 0,
    b = 0,
    n = 0;
  for (let y = 0; y < 50; y++)
    for (let x = 0; x < 40; x++)
      if (x < 3 || x > 36 || y < 3 || y > 46) {
        const i = (y * 40 + x) * 3;
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        n++;
      }
  r /= n;
  g /= n;
  b /= n;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const light = lum > 0.55;
  const k = light ? 0.93 : 1,
    add = light ? 0 : 18;
  const c = (v: number) => Math.round(Math.min(255, v * k + add));
  return { bg: `rgb(${c(r)},${c(g)},${c(b)})`, ink: light ? '#1e1b17' : '#fbf5ea', light };
}
