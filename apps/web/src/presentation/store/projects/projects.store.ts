import { create } from 'zustand';
import type { ProjectCategory } from '@/domain/entities/project/project.entity';

interface ProjectsState {
  selectedCategory: ProjectCategory | 'all';
  setCategory: (category: ProjectCategory | 'all') => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  selectedCategory: 'all',
  setCategory: (category) => set({ selectedCategory: category }),
}));
