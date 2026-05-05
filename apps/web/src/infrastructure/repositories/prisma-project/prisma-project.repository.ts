import type { Project, ProjectCategory } from '@/domain/entities/project/project.entity';
import type {
  CreateProjectInput,
  ProjectRepository,
  UpdateProjectInput,
} from '@/domain/repositories/project/project.repository';
import { prisma } from '@/shared/lib/prisma/prisma.lib';

function toProjectEntity(raw: {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  images: unknown;
  techStack: unknown;
  category: string;
  status: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Project {
  return {
    ...raw,
    images: Array.isArray(raw.images) ? (raw.images as string[]) : [],
    techStack: Array.isArray(raw.techStack) ? (raw.techStack as string[]) : [],
    category: raw.category as Project['category'],
    status: raw.status as Project['status'],
  };
}

export class PrismaProjectRepository implements ProjectRepository {
  async findAll(): Promise<Project[]> {
    const rows = await prisma.project.findMany({ orderBy: { order: 'asc' } });
    return rows.map(toProjectEntity);
  }

  async findFeatured(): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      where: { featured: true },
      orderBy: { order: 'asc' },
    });
    return rows.map(toProjectEntity);
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const row = await prisma.project.findUnique({ where: { slug } });
    return row ? toProjectEntity(row) : null;
  }

  async findByCategory(category: ProjectCategory): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      where: { category },
      orderBy: { order: 'asc' },
    });
    return rows.map(toProjectEntity);
  }

  async create(data: CreateProjectInput): Promise<Project> {
    const row = await prisma.project.create({
      data: {
        slug: data.slug,
        title: data.title,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        coverImage: data.coverImage,
        images: data.images ?? [],
        techStack: data.techStack ?? [],
        category: data.category,
        status: data.status ?? 'in_progress',
        githubUrl: data.githubUrl ?? null,
        liveUrl: data.liveUrl ?? null,
        featured: data.featured ?? false,
        order: data.order ?? 0,
      },
    });
    return toProjectEntity(row);
  }

  async update(id: string, data: UpdateProjectInput): Promise<Project> {
    const row = await prisma.project.update({
      where: { id },
      data: {
        ...data,
        images: data.images,
        techStack: data.techStack,
      },
    });
    return toProjectEntity(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }
}
