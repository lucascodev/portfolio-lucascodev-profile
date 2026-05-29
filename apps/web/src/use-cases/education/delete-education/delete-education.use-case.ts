import type { EducationRepository } from '@/domain/repositories/education/education.repository';

export class DeleteEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
