import type { Language } from '@/domain/entities/language/language.entity';
import type { LanguageRepository, UpdateLanguageInput } from '@/domain/repositories/language/language.repository';

export class UpdateLanguageUseCase {
  constructor(private readonly repo: LanguageRepository) {}
  async execute(id: string, data: UpdateLanguageInput): Promise<Language> {
    return this.repo.update(id, data);
  }
}
