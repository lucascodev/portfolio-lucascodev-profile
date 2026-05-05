import { PrismaExperienceRepository } from '@/infrastructure/repositories/prisma-experience/prisma-experience.repository';
import { DeleteExperienceUseCase } from '@/use-cases/experiences/delete-experience/delete-experience.use-case';
import { UpdateExperienceUseCase } from '@/use-cases/experiences/update-experience/update-experience.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaExperienceRepository();
const updateUseCase = new UpdateExperienceUseCase(repository);
const deleteUseCase = new DeleteExperienceUseCase(repository);

const updateSchema = z.object({
  company: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  techStack: z.array(z.string()).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().nullable().optional(),
  current: z.boolean().optional(),
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
  const { startDate, endDate, ...rest } = parsed.data;
  const experience = await updateUseCase.execute(id, {
    ...rest,
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate !== undefined ? (endDate ? new Date(endDate) : null) : undefined,
  });
  return NextResponse.json(experience);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
