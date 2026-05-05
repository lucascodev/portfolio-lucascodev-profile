import { PrismaSiteConfigRepository } from '@/infrastructure/repositories/prisma-site-config/prisma-site-config.repository';
import { GetSiteConfigUseCase } from '@/use-cases/site-config/get-site-config/get-site-config.use-case';
import { Providers } from '@/presentation/providers/providers';
import { AdminToolbar } from '@/presentation/view/shared/admin-toolbar/admin-toolbar.component';
import { Footer } from '@/presentation/view/shared/footer/footer.component';
import { Header } from '@/presentation/view/shared/header/header.component';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Lucas Codev — Fullstack & Mobile Engineer',
    template: '%s | Lucas Codev',
  },
  description:
    'Desenvolvedor fullstack e mobile especializado em Flutter, React Native, NestJS, Python/FastAPI e soluções com IA e Visão Computacional.',
  keywords: ['Flutter', 'React Native', 'NestJS', 'FastAPI', 'AI', 'YOLO', 'Fullstack', 'Mobile'],
  authors: [{ name: 'Lucas', url: 'https://lucascodev.com' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Lucas Codev',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteConfig = await new GetSiteConfigUseCase(
    new PrismaSiteConfigRepository(),
  ).execute().catch(() => undefined);

  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-black text-white">
        <Providers>
          <Header />
          <div className="flex flex-1 flex-col pt-16">{children}</div>
          <Footer initialData={siteConfig} />
          <AdminToolbar />
        </Providers>
      </body>
    </html>
  );
}
