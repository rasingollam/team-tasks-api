import { createUser, findUserById, findUserByEmail } from './user.service';
import { verifyPassword } from '../../auth/hash';
import { signToken } from '../../auth/jwt';

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, ctx: any) => {
      if (!ctx.userId) return null;
      return findUserById(ctx.userId);
    },
  },
  Mutation: {
    register: async (_: any, args: any, ctx: any) => {
      const { email, password, name } = args;
      const user = await createUser({ email, password, name });
      return user;
    },
    login: async (_: any, args: any, ctx: any) => {
      const { email, password } = args;
      const user = await findUserByEmail(email);
      if (!user) throw new Error('Invalid credentials');
      const ok = await verifyPassword(password, user.password);
      if (!ok) throw new Error('Invalid credentials');
      const token = signToken({ userId: user.id, sub: user.id });
      return { token, user };
    },
  },
};
