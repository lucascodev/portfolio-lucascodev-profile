import { PrismaLanguageRepository } from '@/infrastructure/repositories/prisma-language/prisma-language.repository';
import { DeleteLanguageUseCase } from '@/use-cases/languages/delete-language/delete-language.use-case';
import { UpdateLanguageUseCase } from '@/use-cases/languages/update-language/update-language.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaLanguageRepository();
const updateUseCase = new UpdateLanguageUseCase(repository);
const deleteUseCase = new DeleteLanguageUseCase(repository);

const LEVELS = ['basic', 'elementary', 'intermediate', 'advanced', 'fluent', 'native'] as const;

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  level: z.enum(LEVELS).optional(),
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
  const language = await updateUseCase.execute(id, parsed.data);
  return NextResponse.json(language);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
