import { Albert_Sans, Bricolage_Grotesque, Chivo, Chivo_Mono, Literata } from 'next/font/google';

// Each interface study keeps its own product's type, so three studies never look like one app.
// Loaded by the work page (a server component), so they ship only on the three study pages.
// next/font must be called from server code; the client Study wrapper just receives the class names.
const chivo = Chivo({ subsets: ['latin'], variable: '--font-chivo', display: 'swap' });
const chivoMono = Chivo_Mono({ subsets: ['latin'], variable: '--font-chivo-mono', display: 'swap' });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap' });
const albert = Albert_Sans({ subsets: ['latin'], variable: '--font-albert', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' });

export const studyFonts = [chivo, chivoMono, literata, albert, bricolage].map(f => f.variable).join(' ');
