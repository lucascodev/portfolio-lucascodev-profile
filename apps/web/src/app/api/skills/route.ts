import { PrismaSkillRepository } from '@/infrastructure/repositories/prisma-skill/prisma-skill.repository';
import { CreateSkillUseCase } from '@/use-cases/skills/create-skill/create-skill.use-case';
import { GetAllSkillsUseCase } from '@/use-cases/skills/get-all-skills/get-all-skills.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaSkillRepository();
const getAllUseCase = new GetAllSkillsUseCase(repository);
const createUseCase = new CreateSkillUseCase(repository);

const createSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['mobile', 'frontend', 'backend', 'ai', 'devops', 'database', 'other']),
  level: z.enum(['learning', 'proficient', 'expert']),
  iconUrl: z.string().url().nullable().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const skills = await getAllUseCase.execute();
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const skill = await createUseCase.execute(parsed.data);
  return NextResponse.json(skill, { status: 201 });
}
