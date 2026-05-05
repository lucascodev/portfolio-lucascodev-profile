import { PrismaProjectRepository } from '@/infrastructure/repositories/prisma-project/prisma-project.repository';
import { CreateProjectUseCase } from '@/use-cases/projects/create-project/create-project.use-case';
import { GetAllProjectsUseCase } from '@/use-cases/projects/get-all-projects/get-all-projects.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaProjectRepository();
const getAllUseCase = new GetAllProjectsUseCase(repository);
const createUseCase = new CreateProjectUseCase(repository);

const createSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  coverImage: z.string().min(1),
  images: z.array(z.string()).default([]),
  techStack: z.array(z.string()).default([]),
  category: z.enum(['mobile', 'web', 'frontend', 'backend', 'ai', 'fullstack', 'game']),
  status: z.enum(['in_progress', 'completed', 'archived']).optional(),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const projects = await getAllUseCase.execute();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const project = await createUseCase.execute(parsed.data);
  return NextResponse.json(project, { status: 201 });
}
