import type { Metadata, Viewport } from 'next';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { MotionProvider } from '@/lib/motion';
import { profile } from '@/content/profile';
import './globals.css';

// One family across its width axis, the way museum signage uses one face at several sizes.
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', axes: ['wdth'], display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const title = profile.fullName;
export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: { default: title, template: `%s · ${profile.name}` },
  description: profile.intro,
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  openGraph: { type: 'website', siteName: profile.fullName, title, description: profile.intro },
  twitter: { card: 'summary_large_image' },
};

const motionBoot = `try{var d=document.documentElement;d.dataset.motion=matchMedia('(prefers-reduced-motion: reduce)').matches?'reduced':localStorage.getItem('kartik:paused')==='1'?'paused':'full'}catch(e){document.documentElement.dataset.motion='full'}`;

export const viewport: Viewport = { themeColor: '#1c1c1b' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${archivo.variable} ${mono.variable}`} suppressHydrationWarning>
      {/* Browser inspection extensions add attributes to head before React hydrates. This is scoped to head attributes only. */}
      <head suppressHydrationWarning>
        {/* Decide the motion mode before first paint, so reduced-motion visitors never see a start state. */}
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
