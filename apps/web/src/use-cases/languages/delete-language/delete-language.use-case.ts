import type { LanguageRepository } from '@/domain/repositories/language/language.repository';

export class DeleteLanguageUseCase {
  constructor(private readonly repo: LanguageRepository) {}
  async execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}
