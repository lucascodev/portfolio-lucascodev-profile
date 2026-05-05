'use client';

import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import { useSiteConfigQuery } from '@/presentation/hooks/use-site-config-query/use-site-config-query.hook';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { EditFooterModal } from '@/presentation/view/shared/footer/edit-footer-modal/edit-footer-modal.component';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface FooterProps {
  readonly initialData?: SiteConfig;
}

export function Footer({ initialData }: FooterProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const year = new Date().getFullYear();
  const isEditMode = useAdminStore((state) => state.isEditMode);
  const { data } = useSiteConfigQuery(initialData);

  const config = useMemo(
    () => ({
      footerBio:
        data?.footerBio ??
        'Fullstack & Mobile Engineer especializado em Flutter, NestJS, Python/FastAPI e IA.',
      footerNavLinks: data?.footerNavLinks ?? [
        { label: 'Projetos', href: '/projects' },
        { label: 'Sobre', href: '/about' },
        { label: 'Contato', href: '/contact' },
      ],
      footerSocialLinks: data?.footerSocialLinks ?? [
        { label: 'GitHub', href: 'https://github.com/lucascodev' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/lucascodev' },
      ],
    }),
    [data],
  );

  return (
    <footer className="relative border-t border-[#1A1A1A] bg-black">
      {isEditMode && data && (
        <div className="absolute right-6 top-6 z-10">
          <EditButton onClick={() => setIsEditModalOpen(true)} />
        </div>
      )}

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <Link
              href="/"
              className="font-mono text-sm font-semibold text-white transition-colors hover:text-[#6EE7B7]"
            >
              lucascodev<span className="text-[#6EE7B7]">.</span>
            </Link>
            <p className="mt-2 max-w-xs text-sm text-[#737373]">{config.footerBio}</p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                Menu
              </p>
              <ul className="flex flex-col gap-2">
                {config.footerNavLinks.map(({ label, href }) => (
                  <li key={`${label}-${href}`}>
                    <Link
                      href={href}
                      className="text-sm text-[#A3A3A3] transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#525252]">
                Social
              </p>
              <ul className="flex flex-col gap-2">
                {config.footerSocialLinks.map(({ label, href }) => (
                  <li key={`${label}-${href}`}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#A3A3A3] transition-colors hover:text-white"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#1A1A1A] pt-6">
          <p className="text-xs text-[#525252]">
            © {year} Lucas Codev. Feito com Next.js, TypeScript e muita ☕
          </p>
        </div>
      </div>

      {data && (
        <EditFooterModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          config={data}
        />
      )}
    </footer>
  );
}
