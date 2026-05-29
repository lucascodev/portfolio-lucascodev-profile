import { PrismaEducationRepository } from '@/infrastructure/repositories/prisma-education/prisma-education.repository';
import { DeleteEducationUseCase } from '@/use-cases/education/delete-education/delete-education.use-case';
import { UpdateEducationUseCase } from '@/use-cases/education/update-education/update-education.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaEducationRepository();
const updateUseCase = new UpdateEducationUseCase(repository);
const deleteUseCase = new DeleteEducationUseCase(repository);

const updateSchema = z.object({
  institution: z.string().min(1).max(200).optional(),
  degree: z.string().min(1).max(200).optional(),
  field: z.string().max(200).nullable().optional(),
  startYear: z.number().int().min(1900).max(2100).optional(),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
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
  const education = await updateUseCase.execute(id, parsed.data);
  return NextResponse.json(education);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
