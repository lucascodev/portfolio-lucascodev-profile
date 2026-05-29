import { PrismaEducationRepository } from '@/infrastructure/repositories/prisma-education/prisma-education.repository';
import { CreateEducationUseCase } from '@/use-cases/education/create-education/create-education.use-case';
import { GetAllEducationUseCase } from '@/use-cases/education/get-all-education/get-all-education.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaEducationRepository();
const getAllUseCase = new GetAllEducationUseCase(repository);
const createUseCase = new CreateEducationUseCase(repository);

const createSchema = z.object({
  institution: z.string().min(1).max(200),
  degree: z.string().min(1).max(200),
  field: z.string().max(200).nullable().optional(),
  startYear: z.number().int().min(1900).max(2100),
  endYear: z.number().int().min(1900).max(2100).nullable().optional(),
  current: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const education = await getAllUseCase.execute();
  return NextResponse.json(education);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const education = await createUseCase.execute(parsed.data);
  return NextResponse.json(education, { status: 201 });
}
