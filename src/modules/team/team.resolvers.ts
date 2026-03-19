import { createTeam, addTeamMember, findTeamById, updateTeamById, deleteTeamById } from './team.service';

export const teamResolvers = {
  Query: {
    team: async (_: any, args: any, ctx: any) => {
      return findTeamById(args.id);
    },
  },
  Mutation: {
    createTeam: async (_: any, args: any, ctx: any) => {
      const ownerId = ctx.userId;
      if (!ownerId) throw new Error('Unauthorized');
      return createTeam({ name: args.name, ownerId });
    },
    addMember: async (_: any, args: any, ctx: any) => {
      // In a full implementation, verify permissions
      return addTeamMember({ teamId: args.teamId, userId: args.userId });
    },
    updateTeam: async (_: any, args: any, ctx: any) => {
      const { id, name } = args;
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const team = await findTeamById(id);
      if (!team) throw new Error('Not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return updateTeamById(id, { name });
    },
    deleteTeam: async (_: any, args: any, ctx: any) => {
      const { id } = args;
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const team = await findTeamById(id);
      if (!team) throw new Error('Not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      await deleteTeamById(id);
      return true;
    },
  },
};
