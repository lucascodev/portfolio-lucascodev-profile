import type { CertificationRepository } from '@/domain/repositories/certification/certification.repository';

export class DeleteCertificationUseCase {
  constructor(private readonly repo: CertificationRepository) {}
  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
