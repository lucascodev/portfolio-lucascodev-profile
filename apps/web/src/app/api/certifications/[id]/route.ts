import { PrismaCertificationRepository } from '@/infrastructure/repositories/prisma-certification/prisma-certification.repository';
import { DeleteCertificationUseCase } from '@/use-cases/certifications/delete-certification/delete-certification.use-case';
import { UpdateCertificationUseCase } from '@/use-cases/certifications/update-certification/update-certification.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaCertificationRepository();
const updateUseCase = new UpdateCertificationUseCase(repository);
const deleteUseCase = new DeleteCertificationUseCase(repository);

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  issuer: z.string().min(1).max(200).optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  url: z.string().url().nullable().optional(),
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
  const certification = await updateUseCase.execute(id, parsed.data);
  return NextResponse.json(certification);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  await deleteUseCase.execute(id);
  return new NextResponse(null, { status: 204 });
}
