import type { Project } from '@/domain/entities/project/project.entity';
import type {
  CreateProjectInput,
  ProjectRepository,
} from '@/domain/repositories/project/project.repository';

export class CreateProjectUseCase {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async execute(data: CreateProjectInput): Promise<Project> {
    return this.projectRepository.create(data);
  }
}
