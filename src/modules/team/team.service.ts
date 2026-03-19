import prisma from '../../prisma/client';

export async function createTeam(data: { name: string; ownerId: string }) {
  return prisma.team.create({ data: { name: data.name, ownerId: data.ownerId } });
}

export async function addTeamMember(data: { teamId: string; userId: string }) {
  return prisma.teamMember.create({ data: { teamId: data.teamId, userId: data.userId } });
}

export async function findTeamById(id: string) {
  return prisma.team.findUnique({ where: { id } });
}
