import { PrismaSkillRepository } from '@/infrastructure/repositories/prisma-skill/prisma-skill.repository';
import { DeleteSkillUseCase } from '@/use-cases/skills/delete-skill/delete-skill.use-case';
import { UpdateSkillUseCase } from '@/use-cases/skills/update-skill/update-skill.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaSkillRepository();
const updateUseCase = new UpdateSkillUseCase(repository);
const deleteUseCase = new DeleteSkillUseCase(repository);

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(['mobile', 'frontend', 'backend', 'ai', 'devops', 'database', 'other']).optional(),
  level: z.enum(['learning', 'proficient', 'expert']).optional(),
  iconUrl: z.string().url().nullable().optional(),
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
  const skill = await updateUseCase.execute(id, parsed.data);
  return NextResponse.json(skill);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
