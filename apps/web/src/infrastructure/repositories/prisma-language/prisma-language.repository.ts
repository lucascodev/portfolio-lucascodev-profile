import type { Language } from '@/domain/entities/language/language.entity';
import type {
  CreateLanguageInput,
  LanguageRepository,
  UpdateLanguageInput,
} from '@/domain/repositories/language/language.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

function toLanguageEntity(raw: { id: string; name: string; level: string; order: number }): Language {
  return { ...raw, level: raw.level as Language['level'] };
}

export class PrismaLanguageRepository implements LanguageRepository {
  async findAll(): Promise<Language[]> {
    const rows = await prisma.language.findMany({ orderBy: { order: 'asc' } });
    return rows.map(toLanguageEntity);
  }

  async create(data: CreateLanguageInput): Promise<Language> {
    const row = await prisma.language.create({
      data: { name: data.name, level: data.level, order: data.order ?? 0 },
    });
    return toLanguageEntity(row);
  }

  async update(id: string, data: UpdateLanguageInput): Promise<Language> {
    const row = await prisma.language.update({ where: { id }, data });
    return toLanguageEntity(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.language.delete({ where: { id } });
  }
}
