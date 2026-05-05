import type { Experience } from '../../entities/experience/experience.entity';

export interface CreateExperienceInput {
  company: string;
  role: string;
  description: string;
  techStack: string[];
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  order: number;
}

export interface UpdateExperienceInput {
  company?: string;
  role?: string;
  description?: string;
  techStack?: string[];
  startDate?: Date;
  endDate?: Date | null;
  current?: boolean;
  order?: number;
}

export interface ExperienceRepository {
  findAll(): Promise<Experience[]>;
  create(data: CreateExperienceInput): Promise<Experience>;
  update(id: string, data: UpdateExperienceInput): Promise<Experience>;
  delete(id: string): Promise<void>;
}
