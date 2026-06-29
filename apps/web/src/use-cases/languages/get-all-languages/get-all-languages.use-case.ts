import type { Language } from '@/domain/entities/language/language.entity';
import type { LanguageRepository } from '@/domain/repositories/language/language.repository';

export class GetAllLanguagesUseCase {
  constructor(private readonly repo: LanguageRepository) {}
  async execute(): Promise<Language[]> {
    return this.repo.findAll();
  }
}
