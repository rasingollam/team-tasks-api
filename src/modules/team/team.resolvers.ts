import { createTeam, addTeamMember, findTeamById } from './team.service';

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
  },
};
