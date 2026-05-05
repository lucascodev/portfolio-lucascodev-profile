import { PrismaProjectRepository } from '@/infrastructure/repositories/prisma-project/prisma-project.repository';
import { DeleteProjectUseCase } from '@/use-cases/projects/delete-project/delete-project.use-case';
import { UpdateProjectUseCase } from '@/use-cases/projects/update-project/update-project.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaProjectRepository();
const updateUseCase = new UpdateProjectUseCase(repository);
const deleteUseCase = new DeleteProjectUseCase(repository);

const updateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  shortDescription: z.string().min(1).optional(),
  fullDescription: z.string().min(1).optional(),
  coverImage: z.string().min(1).optional(),
  images: z.array(z.string()).optional(),
  techStack: z.array(z.string()).optional(),
  category: z.enum(['mobile', 'web', 'frontend', 'backend', 'ai', 'fullstack', 'game']).optional(),
  status: z.enum(['in_progress', 'completed', 'archived']).optional(),
  githubUrl: z.string().url().nullable().optional(),
  liveUrl: z.string().url().nullable().optional(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const body: unknown = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const project = await updateUseCase.execute(id, parsed.data);
  return NextResponse.json(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
