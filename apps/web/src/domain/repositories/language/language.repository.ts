import type { Language } from '../../entities/language/language.entity';

export interface CreateLanguageInput {
  name: string;
  level: Language['level'];
  order?: number;
}

export interface UpdateLanguageInput {
  name?: string;
  level?: Language['level'];
  order?: number;
}

export interface LanguageRepository {
  findAll(): Promise<Language[]>;
  create(data: CreateLanguageInput): Promise<Language>;
  update(id: string, data: UpdateLanguageInput): Promise<Language>;
  delete(id: string): Promise<void>;
}
