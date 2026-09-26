import Link from 'next/link';
import Paper from '@/components/page/Paper';
import p from '@/components/page/page.module.css';

export default function NotFound() {
  return (
    <Paper>
      <header className={p.head}>
        <p className={p.kicker}>404</p>
        <h1>Nothing hangs here.</h1>
        <p className={p.lede}>
          This page doesn’t exist. Everything that does is in the <Link href="/">hall</Link> or in its <Link href="/#work">list of every work</Link>.
        </p>
      </header>
    </Paper>
  );
}
