'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopNav() {
  const pathname = usePathname();

  const linkClass = (path) =>
    pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <div className="top-nav">
      <Link href="/" className="logo">
        Schedly
      </Link>
      <div className="nav-links">
        <Link href="/" className={linkClass('/')}>Event Types</Link>
        <Link href="/availability" className={linkClass('/availability')}>Availability</Link>
        <Link href="/meetings" className={linkClass('/meetings')}>Meetings</Link>
      </div>
    </div>
  );
}
