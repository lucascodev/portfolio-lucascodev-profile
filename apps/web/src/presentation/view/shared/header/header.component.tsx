'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Projetos', href: '/projects' },
  { label: 'Sobre', href: '/about' },
  { label: 'Contato', href: '/contact' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#1A1A1A] bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold text-white transition-colors hover:text-[#6EE7B7]"
        >
          lucascodev<span className="text-[#6EE7B7]">.</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={[
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-[#1A1A1A] text-white'
                    : 'text-[#A3A3A3] hover:text-white hover:bg-[#111111]',
                ].join(' ')}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
