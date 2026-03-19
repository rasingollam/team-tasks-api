import { createTask, assignTask, updateTaskStatus, findTasksByTeam, updateTaskById, removeTaskAssignment, deleteTaskById } from './task.service';
import prisma from '../../prisma/client';

export const taskResolvers = {
  Query: {
    tasksByTeam: async (_: any, args: any, ctx: any) => {
      return findTasksByTeam(args.teamId);
    },
  },
  Mutation: {
    createTask: async (_: any, args: any, ctx: any) => {
      if (!ctx.userId) throw new Error('Unauthorized');
      return createTask({ teamId: args.teamId, title: args.title, description: args.description });
    },
    assignTask: async (_: any, args: any, ctx: any) => {
      // permission checks omitted
      return assignTask({ taskId: args.taskId, userId: args.userId });
    },
    updateTaskStatus: async (_: any, args: any, ctx: any) => {
      return updateTaskStatus({ taskId: args.taskId, status: args.status });
    },
    updateTask: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const task = await prisma.task.findUnique({ where: { id: args.taskId } });
      if (!task) throw new Error('Not found');
      const team = await prisma.team.findUnique({ where: { id: task.teamId } });
      if (!team) throw new Error('Team not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return updateTaskById({ taskId: args.taskId, title: args.title, description: args.description ?? null, status: args.status ?? undefined, assignedTo: args.assignedTo ?? undefined });
    },
    removeTaskAssignment: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const task = await prisma.task.findUnique({ where: { id: args.taskId } });
      if (!task) throw new Error('Not found');
      const team = await prisma.team.findUnique({ where: { id: task.teamId } });
      if (!team) throw new Error('Team not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return removeTaskAssignment(args.taskId);
    },
    deleteTask: async (_: any, args: any, ctx: any) => {
      const userId = ctx.userId;
      if (!userId) throw new Error('Unauthorized');
      const task = await prisma.task.findUnique({ where: { id: args.taskId } });
      if (!task) throw new Error('Not found');
      const team = await prisma.team.findUnique({ where: { id: task.teamId } });
      if (!team) throw new Error('Team not found');
      if (team.ownerId !== userId) throw new Error('Forbidden');
      return deleteTaskById(args.taskId);
    },
  },
};
