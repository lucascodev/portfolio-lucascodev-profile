import type { Skill } from '../../entities/skill/skill.entity';

export interface CreateSkillInput {
  name: string;
  category: Skill['category'];
  level: Skill['level'];
  iconUrl?: string | null;
  order?: number;
}

export interface UpdateSkillInput {
  name?: string;
  category?: Skill['category'];
  level?: Skill['level'];
  iconUrl?: string | null;
  order?: number;
}

export interface SkillRepository {
  findAll(): Promise<Skill[]>;
  findByCategory(category: Skill['category']): Promise<Skill[]>;
  create(data: CreateSkillInput): Promise<Skill>;
  update(id: string, data: UpdateSkillInput): Promise<Skill>;
  delete(id: string): Promise<void>;
}
