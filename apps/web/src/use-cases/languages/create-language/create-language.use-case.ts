import type { Language } from '@/domain/entities/language/language.entity';
import type { CreateLanguageInput, LanguageRepository } from '@/domain/repositories/language/language.repository';

export class CreateLanguageUseCase {
  constructor(private readonly repo: LanguageRepository) {}
  async execute(data: CreateLanguageInput): Promise<Language> {
    return this.repo.create(data);
  }
}
