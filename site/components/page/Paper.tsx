import { ViewTransition, type ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { profile } from '@/content/profile';
import s from './Paper.module.css';

/**
 * Every reading page: warm paper, the site header, and a quiet footer. `bleed` lets the page run edge
 * to edge (records have a full-width top); `tone` sets the header's ink for a dark top.
 */
export default function Paper({
  current,
  bleed,
  tone = 'dark',
  children,
}: {
  current?: string;
  bleed?: boolean;
  tone?: 'light' | 'dark';
  children: ReactNode;
}) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'page-in', 'nav-back': 'page-back-in', default: 'none' }}
      exit={{ 'nav-forward': 'page-out', 'nav-back': 'page-back-out', default: 'none' }}
      default="none"
    >
      <div className={s.paper}>
        <SiteHeader tone={tone} current={current} />
        <main id="main" className={bleed ? s.bleed : s.main}>
          {children}
        </main>
        <footer className={s.foot}>
          <span>{profile.fullName}</span>
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </footer>
      </div>
    </ViewTransition>
  );
}
