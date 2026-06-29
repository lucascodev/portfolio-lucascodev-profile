import type { Education } from '@/domain/entities/education/education.entity';
import type { CreateEducationInput, EducationRepository } from '@/domain/repositories/education/education.repository';

export class CreateEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  async execute(data: CreateEducationInput): Promise<Education> {
    return this.repo.create(data);
  }
}
