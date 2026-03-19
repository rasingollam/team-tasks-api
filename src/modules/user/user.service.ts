import prisma from '../../prisma/client';
import { hashPassword } from '../../auth/hash';

export async function createUser(data: { email: string; password: string; name?: string }) {
  const hashed = await hashPassword(data.password);
  return prisma.user.create({ data: { email: data.email, password: hashed, name: data.name ?? null } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}
