import type { Project } from '../../entities/project/project.entity';

export interface CreateProjectInput {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  images?: string[];
  techStack?: string[];
  category: Project['category'];
  status?: Project['status'];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  order?: number;
}

export interface UpdateProjectInput {
  slug?: string;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  coverImage?: string;
  images?: string[];
  techStack?: string[];
  category?: Project['category'];
  status?: Project['status'];
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  order?: number;
}

export interface ProjectRepository {
  findAll(): Promise<Project[]>;
  findFeatured(): Promise<Project[]>;
  findBySlug(slug: string): Promise<Project | null>;
  findByCategory(category: Project['category']): Promise<Project[]>;
  create(data: CreateProjectInput): Promise<Project>;
  update(id: string, data: UpdateProjectInput): Promise<Project>;
  delete(id: string): Promise<void>;
}
