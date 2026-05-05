import { sessionOptions, type SessionData } from '@/shared/config/session/session.config';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return NextResponse.json({ isAdmin: session.isAdmin === true });
}
