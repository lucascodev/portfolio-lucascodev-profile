import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import type { SiteConfigRepository } from '@/domain/repositories/site-config/site-config.repository';

export class GetSiteConfigUseCase {
  constructor(private readonly repository: SiteConfigRepository) {}

  async execute(): Promise<SiteConfig> {
    return this.repository.get();
  }
}
