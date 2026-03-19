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

export async function updateTaskById(data: { taskId: string; title?: string; description?: string | null; status?: string | null; assignedTo?: string | null }) {
  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) updateData.status = data.status as any;
  if (data.assignedTo !== undefined) updateData.assignedTo = data.assignedTo;
  return prisma.task.update({ where: { id: data.taskId }, data: updateData });
}

export async function removeTaskAssignment(taskId: string) {
  return prisma.task.update({ where: { id: taskId }, data: { assignedTo: null } });
}

export async function deleteTaskById(taskId: string) {
  await prisma.task.delete({ where: { id: taskId } });
  return true;
}

export async function findTasksByTeam(teamId: string) {
  return prisma.task.findMany({ where: { teamId } });
}
