import prisma from '../../prisma/client';

export async function createTask(data: { teamId: string; title: string; description?: string }) {
  return prisma.task.create({ data: { teamId: data.teamId, title: data.title, description: data.description ?? null } });
}

export async function assignTask(data: { taskId: string; userId: string }) {
  return prisma.task.update({ where: { id: data.taskId }, data: { assignedTo: data.userId } });
}

export async function updateTaskStatus(data: { taskId: string; status: string }) {
  return prisma.task.update({ where: { id: data.taskId }, data: { status: data.status as any } });
}

export async function findTasksByTeam(teamId: string) {
  return prisma.task.findMany({ where: { teamId } });
}
