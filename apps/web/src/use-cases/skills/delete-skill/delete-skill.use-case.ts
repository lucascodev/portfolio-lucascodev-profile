import type { SkillRepository } from '@/domain/repositories/skill/skill.repository';

export class DeleteSkillUseCase {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(id: string): Promise<void> {
    return this.skillRepository.delete(id);
  }
}
