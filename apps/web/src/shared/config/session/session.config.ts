import type { SessionOptions } from 'iron-session';

export interface SessionData {
  userId?: string;
  isAdmin?: boolean;
}

export const sessionOptions: SessionOptions = {
  cookieName: 'portfolio_session',
  password: process.env['SESSION_SECRET'] ?? '',
  cookieOptions: {
    secure: process.env['NODE_ENV'] === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 dias
  },
};
