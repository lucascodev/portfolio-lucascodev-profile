'use client';

import type { Experience } from '@/domain/entities/experience/experience.entity';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditExperienceModal } from '@/presentation/view/about/components/edit-experience-modal/edit-experience-modal.component';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { slideLeft, staggerSlow } from '@/shared/utils/motion/motion.variants';
import { formatDateRange } from '@/shared/utils/format-date/format-date.util';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface TimelineProps {
  experiences: Experience[];
}

export function Timeline({ experiences }: Readonly<TimelineProps>) {
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <motion.ol
      className="relative border-l border-[#2A2A2A]"
      variants={staggerSlow}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {experiences.map((exp) => (
        <motion.li key={exp.id} className="mb-10 ml-6" variants={slideLeft}>
          <span className="absolute -left-[9px] flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#3D3D3D] bg-[#111111]">
            <span className="h-2 w-2 rounded-full bg-[#6EE7B7]" />
          </span>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-[#737373]">
                {formatDateRange(exp.startDate, exp.endDate)}
              </p>
              {isEditMode && <EditButton onClick={() => setEditingId(exp.id)} />}
            </div>
            <h3 className="text-base font-semibold text-white">{exp.role}</h3>
            <p className="text-sm font-medium text-[#6EE7B7]">{exp.company}</p>
            <p className="mt-1 text-sm text-[#A3A3A3]">{exp.description}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {exp.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-[#2A2A2A] px-2.5 py-0.5 font-mono text-xs text-[#737373]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
          {editingId === exp.id && (
            <EditExperienceModal experience={exp} isOpen onClose={() => setEditingId(null)} />
          )}
        </motion.li>
      ))}
    </motion.ol>
  );
}
