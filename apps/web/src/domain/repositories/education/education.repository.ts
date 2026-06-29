import type { Education } from '../../entities/education/education.entity';

export interface CreateEducationInput {
  institution: string;
  degree: string;
  field?: string | null;
  startYear: number;
  endYear?: number | null;
  current?: boolean;
  order?: number;
}

export interface UpdateEducationInput {
  institution?: string;
  degree?: string;
  field?: string | null;
  startYear?: number;
  endYear?: number | null;
  current?: boolean;
  order?: number;
}

export interface EducationRepository {
  findAll(): Promise<Education[]>;
  create(data: CreateEducationInput): Promise<Education>;
  update(id: string, data: UpdateEducationInput): Promise<Education>;
  delete(id: string): Promise<void>;
}
