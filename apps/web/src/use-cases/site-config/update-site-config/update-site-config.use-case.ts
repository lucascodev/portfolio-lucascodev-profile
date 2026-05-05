import type { SiteConfig } from '@/domain/entities/site-config/site-config.entity';
import type {
  SiteConfigRepository,
  UpdateSiteConfigInput,
} from '@/domain/repositories/site-config/site-config.repository';

export class UpdateSiteConfigUseCase {
  constructor(private readonly repository: SiteConfigRepository) {}

  async execute(data: UpdateSiteConfigInput): Promise<SiteConfig> {
    return this.repository.update(data);
  }
}
