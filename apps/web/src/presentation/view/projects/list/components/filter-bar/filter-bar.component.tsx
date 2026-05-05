'use client';

import { useProjectsStore } from '@/presentation/store/projects/projects.store';
import type { ProjectCategory } from '@/domain/entities/project/project.entity';

const CATEGORIES: Array<{ label: string; value: ProjectCategory | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Web', value: 'web' },
  { label: 'Backend', value: 'backend' },
  { label: 'IA', value: 'ai' },
  { label: 'Fullstack', value: 'fullstack' },
];

export function FilterBar() {
  const { selectedCategory, setCategory } = useProjectsStore();

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setCategory(value)}
          className={[
            'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
            selectedCategory === value
              ? 'border-[#6EE7B7] bg-[#6EE7B7]/10 text-[#6EE7B7]'
              : 'border-[#2A2A2A] text-[#A3A3A3] hover:border-[#3D3D3D] hover:text-white',
          ].join(' ')}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
