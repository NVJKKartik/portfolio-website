import Link from 'next/link';
import { profile } from '@/content/profile';
import s from './SiteHeader.module.css';

// One page holds everything; the nav jumps within it. Records, posts and sources keep their own URLs.
const NAV = [
  ['Work', '/#work'],
  ['Writing', '/#writing'],
  ['About', '/#about'],
  ['Contact', '/#contact'],
] as const;

/** One header for the whole site. Over the hall it sits on the render; on paper pages it's ink. */
export default function SiteHeader({ tone, current, hideName }: { tone: 'light' | 'dark'; current?: string; hideName?: boolean }) {
  return (
    <header className={`${s.bar} ${tone === 'light' ? s.light : ''}`}>
      <Link href="/" className={s.name} aria-label={`${profile.fullName}, the hall`} data-hide={hideName || undefined}>
        <span className={s.full}>{profile.fullName}</span>
        <span className={s.short}>{profile.name}</span>
      </Link>
      <nav aria-label="Site">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} aria-current={current === href ? 'page' : undefined}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
