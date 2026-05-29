import type { Certification } from '@/domain/entities/certification/certification.entity';
import type { CertificationRepository, CreateCertificationInput } from '@/domain/repositories/certification/certification.repository';

export class CreateCertificationUseCase {
  constructor(private readonly repo: CertificationRepository) {}
  async execute(data: CreateCertificationInput): Promise<Certification> {
    return this.repo.create(data);
  }
}
