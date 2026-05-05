'use client';

import { motion, useMotionTemplate, useScroll, useTransform } from 'framer-motion';
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
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0.6, 0.97]);
  const bgColor = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50 border-b border-[#1A1A1A] backdrop-blur-md"
      style={{ backgroundColor: bgColor }}
    >
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
    </motion.header>
  );
}
