import type { Experience } from '@/domain/entities/experience/experience.entity';
import type {
  ExperienceRepository,
  UpdateExperienceInput,
} from '@/domain/repositories/experience/experience.repository';

export class UpdateExperienceUseCase {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(id: string, data: UpdateExperienceInput): Promise<Experience> {
    return this.experienceRepository.update(id, data);
  }
}
