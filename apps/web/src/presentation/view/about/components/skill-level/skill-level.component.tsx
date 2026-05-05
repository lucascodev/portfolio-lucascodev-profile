'use client';

import type { Skill } from '@/domain/entities/skill/skill.entity';
import { useAdminStore } from '@/presentation/store/admin/admin.store';
import { EditSkillModal } from '@/presentation/view/about/components/edit-skill-modal/edit-skill-modal.component';
import { EditButton } from '@/presentation/view/shared/edit-button/edit-button.component';
import { fadeUp } from '@/shared/utils/motion/motion.variants';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface SkillLevelProps {
  skill: Skill;
}

const levelConfig = {
  expert: { label: 'Expert', bars: 3, color: 'bg-[#6EE7B7]' },
  proficient: { label: 'Proficiente', bars: 2, color: 'bg-[#A3A3A3]' },
  learning: { label: 'Aprendendo', bars: 1, color: 'bg-[#525252]' },
};

export function SkillLevel({ skill }: Readonly<SkillLevelProps>) {
  const config = levelConfig[skill.level];
  const isEditMode = useAdminStore((s) => s.isEditMode);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        className="relative flex items-center justify-between rounded-lg border border-[#1A1A1A] bg-[#0A0A0A] px-4 py-3"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
      >
        <span className="text-sm text-white">{skill.name}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737373]">{config.label}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3].map((bar) => (
              <motion.div
                key={bar}
                className={[
                  'h-1.5 w-4 rounded-full',
                  bar <= config.bars ? config.color : 'bg-[#2A2A2A]',
                ].join(' ')}
                style={{ transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.15 + (bar - 1) * 0.07, ease: 'easeOut' }}
              />
            ))}
          </div>
          {isEditMode && <EditButton onClick={() => setIsModalOpen(true)} label="" />}
        </div>
      </motion.div>
      {isModalOpen && (
        <EditSkillModal skill={skill} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
