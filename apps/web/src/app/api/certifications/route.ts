import { PrismaCertificationRepository } from '@/infrastructure/repositories/prisma-certification/prisma-certification.repository';
import { CreateCertificationUseCase } from '@/use-cases/certifications/create-certification/create-certification.use-case';
import { GetAllCertificationsUseCase } from '@/use-cases/certifications/get-all-certifications/get-all-certifications.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaCertificationRepository();
const getAllUseCase = new GetAllCertificationsUseCase(repository);
const createUseCase = new CreateCertificationUseCase(repository);

const createSchema = z.object({
  name: z.string().min(1).max(200),
  issuer: z.string().min(1).max(200),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  url: z.string().url().nullable().optional(),
  badgeUrl: z.string().url().nullable().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const certifications = await getAllUseCase.execute();
  return NextResponse.json(certifications);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const certification = await createUseCase.execute(parsed.data);
  return NextResponse.json(certification, { status: 201 });
}
