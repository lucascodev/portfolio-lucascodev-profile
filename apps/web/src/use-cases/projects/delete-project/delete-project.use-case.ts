import type { ProjectRepository } from '@/domain/repositories/project/project.repository';

export class DeleteProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string): Promise<void> {
    return this.projectRepository.delete(id);
  }
}
