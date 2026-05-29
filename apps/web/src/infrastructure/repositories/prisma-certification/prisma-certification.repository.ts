import type { Certification } from '@/domain/entities/certification/certification.entity';
import type {
  CertificationRepository,
  CreateCertificationInput,
  UpdateCertificationInput,
} from '@/domain/repositories/certification/certification.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

export class PrismaCertificationRepository implements CertificationRepository {
  async findAll(): Promise<Certification[]> {
    return prisma.certification.findMany({ orderBy: { order: 'asc' } });
  }

  async create(data: CreateCertificationInput): Promise<Certification> {
    return prisma.certification.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        year: data.year ?? null,
        url: data.url ?? null,
        order: data.order ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateCertificationInput): Promise<Certification> {
    return prisma.certification.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.certification.delete({ where: { id } });
  }
}
