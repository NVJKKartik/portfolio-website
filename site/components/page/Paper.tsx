import { ViewTransition, type ReactNode } from 'react';
import SiteHeader from '@/components/SiteHeader';
import { profile } from '@/content/profile';
import s from './Paper.module.css';

/** Every reading page: label paper, the site header in ink, and a quiet footer. */
export default function Paper({ current, children }: { current?: string; children: ReactNode }) {
  return (
    <ViewTransition
      enter={{ 'nav-forward': 'page-in', 'nav-back': 'page-back-in', default: 'none' }}
      exit={{ 'nav-forward': 'page-out', 'nav-back': 'page-back-out', default: 'none' }}
      default="none"
    >
      <div className={s.paper}>
        <SiteHeader tone="dark" current={current} />
        <main id="main" className={s.main}>
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
