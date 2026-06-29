import { PrismaLanguageRepository } from '@/infrastructure/repositories/prisma-language/prisma-language.repository';
import { CreateLanguageUseCase } from '@/use-cases/languages/create-language/create-language.use-case';
import { GetAllLanguagesUseCase } from '@/use-cases/languages/get-all-languages/get-all-languages.use-case';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const repository = new PrismaLanguageRepository();
const getAllUseCase = new GetAllLanguagesUseCase(repository);
const createUseCase = new CreateLanguageUseCase(repository);

const LEVELS = ['basic', 'elementary', 'intermediate', 'advanced', 'fluent', 'native'] as const;

const createSchema = z.object({
  name: z.string().min(1).max(100),
  level: z.enum(LEVELS),
  order: z.number().int().optional(),
});

export async function GET() {
  const languages = await getAllUseCase.execute();
  return NextResponse.json(languages);
}

export async function POST(request: Request) {
  const body: unknown = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const language = await createUseCase.execute(parsed.data);
  return NextResponse.json(language, { status: 201 });
}
