import type { Skill } from '@/domain/entities/skill/skill.entity';
import type { SkillRepository } from '@/domain/repositories/skill/skill.repository';

export class GetAllSkillsUseCase {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(): Promise<Skill[]> {
    return this.skillRepository.findAll();
  }
}
