import { Albert_Sans, Bricolage_Grotesque, Chivo, Chivo_Mono, Literata } from 'next/font/google';

// Each interface study keeps its own product's type, so three studies never look like one app.
// Loaded by the work page (a server component). Not preloaded: the build hoists font preloads onto
// every page, home included, where they'd compete with the hall for bandwidth. A study draws its
// own type a moment late instead. next/font must be called from server code; the client Study
// wrapper just receives the class names.
const chivo = Chivo({ subsets: ['latin'], variable: '--font-chivo', display: 'swap', preload: false });
const chivoMono = Chivo_Mono({ subsets: ['latin'], variable: '--font-chivo-mono', display: 'swap', preload: false });
const literata = Literata({ subsets: ['latin'], variable: '--font-literata', display: 'swap', preload: false });
const albert = Albert_Sans({ subsets: ['latin'], variable: '--font-albert', display: 'swap', preload: false });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap', preload: false });

export const studyFonts = [chivo, chivoMono, literata, albert, bricolage].map(f => f.variable).join(' ');
