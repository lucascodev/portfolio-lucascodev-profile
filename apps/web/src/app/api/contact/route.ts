import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { SendContactUseCase } from '@/use-cases/contact/send-contact/send-contact.use-case';
import { PrismaContactRepository } from '@/infrastructure/repositories/prisma-contact/prisma-contact.repository';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

const repository = new PrismaContactRepository();
const useCase = new SendContactUseCase(repository);

export async function POST(request: NextRequest) {
  const body: unknown = await request.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  await useCase.execute(parsed.data);
  return NextResponse.json({ ok: true }, { status: 201 });
}
