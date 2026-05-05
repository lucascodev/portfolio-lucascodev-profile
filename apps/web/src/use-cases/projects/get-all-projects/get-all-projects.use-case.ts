import type { Project } from '@/domain/entities/project/project.entity';
import type { ProjectRepository } from '@/domain/repositories/project/project.repository';

export class GetAllProjectsUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }
}
