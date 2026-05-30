'use client';

import { useExperiencesQuery } from '@/presentation/hooks/use-experiences-query/use-experiences-query.hook';
import { fadeUp, stagger } from '@/shared/utils/motion/motion.variants';
import { formatDateRange } from '@/shared/utils/format-date/format-date.util';
import { motion } from 'framer-motion';

const MAX_VISIBLE = 3;

export function ExperiencePreview() {
  const { data: experiences = [], isLoading } = useExperiencesQuery();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {['sk-1', 'sk-2'].map((k) => (
          <div key={k} className="h-24 animate-pulse rounded-xl bg-[#111111]" />
        ))}
      </div>
    );
  }

  if (experiences.length === 0) return null;

  const sorted = [...experiences]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, MAX_VISIBLE);

  return (
    <motion.div
      className="relative border-l border-[#2A2A2A]"
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {sorted.map((exp) => (
        <motion.div key={exp.id} variants={fadeUp} className="mb-8 ml-6">
          <span className="absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#3D3D3D] bg-[#111111]">
            <span className="h-2 w-2 rounded-full bg-[#6EE7B7]" />
          </span>
          <p className="font-mono text-xs text-[#737373]">
            {formatDateRange(exp.startDate, exp.endDate)}
          </p>
          <h4 className="mt-0.5 text-base font-semibold text-white">{exp.role}</h4>
          <p className="text-sm font-medium text-[#6EE7B7]">{exp.company}</p>
          {exp.techStack.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {exp.techStack.slice(0, 4).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#2A2A2A] px-2.5 py-0.5 font-mono text-xs text-[#737373]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
