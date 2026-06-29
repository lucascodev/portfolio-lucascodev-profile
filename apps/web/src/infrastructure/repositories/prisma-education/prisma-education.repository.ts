import type { Education } from '@/domain/entities/education/education.entity';
import type {
  CreateEducationInput,
  EducationRepository,
  UpdateEducationInput,
} from '@/domain/repositories/education/education.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

export class PrismaEducationRepository implements EducationRepository {
  async findAll(): Promise<Education[]> {
    return prisma.education.findMany({ orderBy: { order: 'asc' } });
  }

  async create(data: CreateEducationInput): Promise<Education> {
    return prisma.education.create({
      data: {
        institution: data.institution,
        degree: data.degree,
        field: data.field ?? null,
        startYear: data.startYear,
        endYear: data.endYear ?? null,
        current: data.current ?? false,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateEducationInput): Promise<Education> {
    return prisma.education.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.education.delete({ where: { id } });
  }
}
