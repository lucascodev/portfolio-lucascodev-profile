import type { Skill } from '@/domain/entities/skill/skill.entity';
import type {
  SkillRepository,
  UpdateSkillInput,
} from '@/domain/repositories/skill/skill.repository';

export class UpdateSkillUseCase {
  constructor(private readonly skillRepository: SkillRepository) {}

  async execute(id: string, data: UpdateSkillInput): Promise<Skill> {
    return this.skillRepository.update(id, data);
  }
}
