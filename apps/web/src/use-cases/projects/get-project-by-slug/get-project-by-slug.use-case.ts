import type { Project } from '@/domain/entities/project/project.entity';
import type { ProjectRepository } from '@/domain/repositories/project/project.repository';

export class GetProjectBySlugUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(slug: string): Promise<Project | null> {
    return this.projectRepository.findBySlug(slug);
  }
}
