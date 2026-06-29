import type { Certification } from '@/domain/entities/certification/certification.entity';
import type { CertificationRepository, UpdateCertificationInput } from '@/domain/repositories/certification/certification.repository';

export class UpdateCertificationUseCase {
  constructor(private readonly repo: CertificationRepository) {}
  async execute(id: string, data: UpdateCertificationInput): Promise<Certification> {
    return this.repo.update(id, data);
  }
}
