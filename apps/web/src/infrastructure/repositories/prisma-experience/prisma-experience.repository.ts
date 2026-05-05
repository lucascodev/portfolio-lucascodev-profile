import type { Experience } from '@/domain/entities/experience/experience.entity';
import type {
  CreateExperienceInput,
  ExperienceRepository,
  UpdateExperienceInput,
} from '@/domain/repositories/experience/experience.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

function toExperienceEntity(raw: {
  id: string;
  company: string;
  role: string;
  description: string;
  techStack: unknown;
  startDate: Date;
  endDate: Date | null;
  current: boolean;
  order: number;
}): Experience {
  return {
    ...raw,
    techStack: Array.isArray(raw.techStack) ? (raw.techStack as string[]) : [],
  };
}

export class PrismaExperienceRepository implements ExperienceRepository {
  async findAll(): Promise<Experience[]> {
    const rows = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
    return rows.map(toExperienceEntity);
  }

  async create(data: CreateExperienceInput): Promise<Experience> {
    const row = await prisma.experience.create({
      data: {
        company: data.company,
        role: data.role,
        description: data.description,
        techStack: data.techStack,
        startDate: data.startDate,
        endDate: data.endDate ?? null,
        current: data.current,
        order: data.order,
      },
    });
    return toExperienceEntity(row);
  }

  async update(id: string, data: UpdateExperienceInput): Promise<Experience> {
    const row = await prisma.experience.update({
      where: { id },
      data: {
        ...data,
        techStack: data.techStack !== undefined ? data.techStack : undefined,
      },
    });
    return toExperienceEntity(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.experience.delete({ where: { id } });
  }
}
