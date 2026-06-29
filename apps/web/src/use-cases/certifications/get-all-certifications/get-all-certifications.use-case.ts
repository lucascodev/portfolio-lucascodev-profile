import type { Certification } from '@/domain/entities/certification/certification.entity';
import type { CertificationRepository } from '@/domain/repositories/certification/certification.repository';

export class GetAllCertificationsUseCase {
  constructor(private readonly repo: CertificationRepository) {}
  async execute(): Promise<Certification[]> {
    return this.repo.findAll();
  }
}
