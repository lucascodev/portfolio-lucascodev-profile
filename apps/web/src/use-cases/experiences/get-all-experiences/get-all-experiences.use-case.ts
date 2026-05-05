import type { Experience } from '@/domain/entities/experience/experience.entity';
import type { ExperienceRepository } from '@/domain/repositories/experience/experience.repository';

export class GetAllExperiencesUseCase {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(): Promise<Experience[]> {
    return this.experienceRepository.findAll();
  }
}
