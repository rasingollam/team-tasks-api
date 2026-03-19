import { Request } from 'express';
import prisma from './prisma/client';
import { verifyToken } from './auth/jwt';

export function createContext({ req }: { req: Request }) {
  const authHeader = (req.headers.authorization as string) || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader || null;
  let userId: string | null = null;
  if (token) {
    try {
      const payload = verifyToken(token) as any;
      userId = payload?.sub || payload?.userId || null;
    } catch (err) {
      userId = null;
    }
  }
  return { prisma, token, userId } as const;
}

export type Context = ReturnType<typeof createContext>;
