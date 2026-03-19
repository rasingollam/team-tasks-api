import { createTeam, addTeamMember, addTeamMembers, removeTeamMember, findTeamById, updateTeamById, deleteTeamById, listTeamMembers, findTeamsByOwner, findTeamsForMember } from './team.service';
import prisma from '../../prisma/client';

export const teamResolvers = {
  Query: {
    team: async (_: any, args: any, ctx: any) => {
      return findTeamById(args.id);
    },
    teamMembers: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const team = await findTeamById(args.teamId);
      if (!team) throw new Error('Not found');
      // allow owner or members to view members
      if (team.ownerId !== userId) {
        const isMember = await prisma.teamMember.findFirst({ where: { teamId: args.teamId, userId } });
        if (!isMember) throw new Error('Forbidden');
      }
      return listTeamMembers(args.teamId);
    },
    myOwnedTeams: async (_: any, _args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      return findTeamsByOwner(userId);
    },
    myMemberTeams: async (_: any, _args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      return findTeamsForMember(userId);
    },
    userMemberTeams: async (_: any, args: any, ctx: any) => {
      const requester = ctx.userId;
      if (!requester) throw new Error('Unauthorized');
      // allow requester to fetch other users' teams; restrict if needed
      return findTeamsForMember(args.userId);
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
    addMembers: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const team = await findTeamById(args.teamId);
      if (!team) throw new Error('Not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return addTeamMembers({ teamId: args.teamId, userIds: args.userIds });
    },
    removeMember: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const team = await findTeamById(args.teamId);
      if (!team) throw new Error('Not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return removeTeamMember({ teamId: args.teamId, userId: args.userId });
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
