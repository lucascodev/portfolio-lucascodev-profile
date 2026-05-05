import type { ExperienceRepository } from '@/domain/repositories/experience/experience.repository';

export class DeleteExperienceUseCase {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(id: string): Promise<void> {
    return this.experienceRepository.delete(id);
  }
}
