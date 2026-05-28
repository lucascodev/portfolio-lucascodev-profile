import { prisma } from '@/shared/lib/prisma/prisma.lib';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const setupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12, 'Password must be at least 12 characters'),
});

export async function POST(request: Request) {
  const existing = await prisma.user.count();
  if (existing > 0) {
    return NextResponse.json({ error: 'Already configured' }, { status: 403 });
  }

  const body: unknown = await request.json();
  const parsed = setupSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { email, passwordHash } });

  return NextResponse.json({ ok: true }, { status: 201 });
}
