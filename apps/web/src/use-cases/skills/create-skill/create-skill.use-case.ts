import type { Skill } from '@/domain/entities/skill/skill.entity';
import type {
  CreateSkillInput,
  SkillRepository,
} from '@/domain/repositories/skill/skill.repository';

export class CreateSkillUseCase {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(data: CreateSkillInput): Promise<Skill> {
    return this.skillRepository.create(data);
  }
}
