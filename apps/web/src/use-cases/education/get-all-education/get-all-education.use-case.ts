import type { Education } from '@/domain/entities/education/education.entity';
import type { EducationRepository } from '@/domain/repositories/education/education.repository';

export class GetAllEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  async execute(): Promise<Education[]> {
    return this.repo.findAll();
  }
}
