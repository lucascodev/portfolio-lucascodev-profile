export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  images: string[];
  techStack: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectCategory =
  | 'mobile'
  | 'web'
  | 'frontend'
  | 'backend'
  | 'ai'
  | 'fullstack'
  | 'game';

export type ProjectStatus = 'in_progress' | 'completed' | 'archived';
