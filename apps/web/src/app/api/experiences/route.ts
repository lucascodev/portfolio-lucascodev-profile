import { PrismaExperienceRepository } from '@/infrastructure/repositories/prisma-experience/prisma-experience.repository';
import { CreateExperienceUseCase } from '@/use-cases/experiences/create-experience/create-experience.use-case';
import { GetAllExperiencesUseCase } from '@/use-cases/experiences/get-all-experiences/get-all-experiences.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaExperienceRepository();
const getAllUseCase = new GetAllExperiencesUseCase(repository);
const createUseCase = new CreateExperienceUseCase(repository);

const createSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  description: z.string().min(1),
  techStack: z.array(z.string()).default([]),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable().optional(),
  current: z.boolean().default(false),
  order: z.number().int().default(0),
});

export async function GET() {
  const experiences = await getAllUseCase.execute();
  return NextResponse.json(experiences);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { startDate, endDate, ...rest } = parsed.data;
  const experience = await createUseCase.execute({
    ...rest,
    startDate: new Date(startDate),
    endDate: endDate ? new Date(endDate) : null,
  });
  return NextResponse.json(experience, { status: 201 });
}
