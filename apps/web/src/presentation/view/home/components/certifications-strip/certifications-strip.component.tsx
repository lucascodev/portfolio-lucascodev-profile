'use client';

import { useCertificationsQuery } from '@/presentation/hooks/use-certifications-query/use-certifications-query.hook';
import { fadeUp, stagger } from '@/shared/utils/motion/motion.variants';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function CertificationsStrip() {
  const { data: certifications = [], isLoading } = useCertificationsQuery();

  if (isLoading || certifications.length === 0) return null;

  return (
    <motion.section
      className="border-y border-[#1A1A1A] bg-[#050505] py-8"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <p className="mb-6 text-center font-mono text-xs font-semibold uppercase tracking-widest text-[#525252]">
        Certificações
      </p>
      <motion.div
        className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-6"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {certifications.map((cert) => {
          const inner = (
            <motion.div
              key={cert.id}
              variants={fadeUp}
              className="flex items-center gap-2.5 rounded-full border border-[#2A2A2A] bg-[#0A0A0A] px-4 py-2 transition-colors hover:border-[#3D3D3D] hover:bg-[#111111]"
            >
              {cert.badgeUrl && (
                <div className="relative h-5 w-5 shrink-0">
                  <Image src={cert.badgeUrl} alt="" fill className="object-contain" unoptimized />
                </div>
              )}
              <span className="text-sm font-medium text-[#D4D4D4]">{cert.name}</span>
              <span className="text-xs text-[#525252]">· {cert.issuer}</span>
            </motion.div>
          );

          return cert.url ? (
            <a
              key={cert.id}
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${cert.name} — ${cert.issuer}`}
            >
              {inner}
            </a>
          ) : (
            <div key={cert.id}>{inner}</div>
          );
        })}
      </motion.div>
    </motion.section>
  );
}
