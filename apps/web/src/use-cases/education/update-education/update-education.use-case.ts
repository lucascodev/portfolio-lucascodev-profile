import type { Education } from '@/domain/entities/education/education.entity';
import type { EducationRepository, UpdateEducationInput } from '@/domain/repositories/education/education.repository';

export class UpdateEducationUseCase {
  constructor(private readonly repo: EducationRepository) {}
  async execute(id: string, data: UpdateEducationInput): Promise<Education> {
    return this.repo.update(id, data);
  }
}
