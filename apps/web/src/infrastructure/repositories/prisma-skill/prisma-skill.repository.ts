import type { Skill } from '@/domain/entities/skill/skill.entity';
import type {
  CreateSkillInput,
  SkillRepository,
  UpdateSkillInput,
} from '@/domain/repositories/skill/skill.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

function toSkillEntity(raw: {
  id: string;
  name: string;
  category: string;
  level: string;
  iconUrl: string | null;
  order: number;
}): Skill {
  return {
    ...raw,
    category: raw.category as Skill['category'],
    level: raw.level as Skill['level'],
  };
}

export class PrismaSkillRepository implements SkillRepository {
  async findAll(): Promise<Skill[]> {
    const rows = await prisma.skill.findMany({ orderBy: { order: 'asc' } });
    return rows.map(toSkillEntity);
  }

  async findByCategory(category: Skill['category']): Promise<Skill[]> {
    const rows = await prisma.skill.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });
    return rows.map(toSkillEntity);
  }

  async create(data: CreateSkillInput): Promise<Skill> {
    const row = await prisma.skill.create({
      data: {
        name: data.name,
        category: data.category,
        level: data.level,
        iconUrl: data.iconUrl ?? null,
        order: data.order ?? 0,
      },
    });
    return toSkillEntity(row);
  }

  async update(id: string, data: UpdateSkillInput): Promise<Skill> {
    const row = await prisma.skill.update({ where: { id }, data });
    return toSkillEntity(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.skill.delete({ where: { id } });
  }
}
