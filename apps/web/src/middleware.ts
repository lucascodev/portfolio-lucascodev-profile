import { sessionOptions, type SessionData } from '@/shared/config/session/session.config';
import { getIronSession } from 'iron-session';
import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_METHODS = new Set(['POST', 'PATCH', 'DELETE', 'PUT']);

const PROTECTED_PATHS = ['/api/projects', '/api/skills', '/api/experiences', '/api/site-config'];

export async function middleware(request: NextRequest) {
  const { pathname, method } = { pathname: request.nextUrl.pathname, method: request.method };

  const isProtectedPath = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtectedPath || !PROTECTED_METHODS.has(method)) {
    return NextResponse.next();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = await getIronSession<SessionData>(request.cookies as any, sessionOptions);

  if (!session.isAdmin) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/projects/:path*',
    '/api/skills/:path*',
    '/api/experiences/:path*',
    '/api/site-config/:path*',
  ],
};
