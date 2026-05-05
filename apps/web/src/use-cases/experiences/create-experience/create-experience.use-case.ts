import type { Experience } from '@/domain/entities/experience/experience.entity';
import type {
  CreateExperienceInput,
  ExperienceRepository,
} from '@/domain/repositories/experience/experience.repository';

export class CreateExperienceUseCase {
  constructor(private readonly experienceRepository: ExperienceRepository) {}

  async execute(data: CreateExperienceInput): Promise<Experience> {
    return this.experienceRepository.create(data);
  }
}
