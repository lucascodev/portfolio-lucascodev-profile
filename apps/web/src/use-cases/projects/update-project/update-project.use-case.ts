import type { Project } from '@/domain/entities/project/project.entity';
import type {
  ProjectRepository,
  UpdateProjectInput,
} from '@/domain/repositories/project/project.repository';

export class UpdateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(id: string, data: UpdateProjectInput): Promise<Project> {
    return this.projectRepository.update(id, data);
  }
}
