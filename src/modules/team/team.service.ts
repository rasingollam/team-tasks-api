import prisma from '../../prisma/client';

export async function createTeam(data: { name: string; ownerId: string }) {
  return prisma.team.create({ data: { name: data.name, ownerId: data.ownerId } });
}

export async function addTeamMember(data: { teamId: string; userId: string }) {
  return prisma.teamMember.create({ data: { teamId: data.teamId, userId: data.userId } });
}

export async function addTeamMembers(data: { teamId: string; userIds: string[] }) {
  const { teamId, userIds } = data;
  const existing = await prisma.teamMember.findMany({
    where: { teamId, userId: { in: userIds } },
    select: { userId: true },
  });
  const existingSet = new Set(existing.map((e) => e.userId));
  const toCreate = userIds.filter((id) => !existingSet.has(id));
  if (toCreate.length === 0) {
    return [];
  }
  await prisma.teamMember.createMany({
    data: toCreate.map((userId) => ({ teamId, userId })),
    skipDuplicates: true,
  });
  return prisma.teamMember.findMany({ where: { teamId, userId: { in: userIds } } });
}

export async function removeTeamMember(data: { teamId: string; userId: string }) {
  const { teamId, userId } = data;
  const result = await prisma.teamMember.deleteMany({ where: { teamId, userId } });
  return result.count > 0;
}

export async function listTeamMembers(teamId: string) {
  const memberships = await prisma.teamMember.findMany({
    where: { teamId },
    include: { user: true },
  });
  return memberships.map((m) => m.user);
}

export async function findTeamsByOwner(ownerId: string) {
  return prisma.team.findMany({ where: { ownerId } });
}

export async function findTeamsForMember(userId: string) {
  const memberships = await prisma.teamMember.findMany({ where: { userId }, include: { team: true } });
  return memberships.map((m) => m.team);
}

export async function findTeamById(id: string) {
  return prisma.team.findUnique({ where: { id } });
}

export async function updateTeamById(id: string, data: { name?: string }) {
  return prisma.team.update({ where: { id }, data });
}

export async function deleteTeamById(id: string) {
  return prisma.team.delete({ where: { id } });
}
