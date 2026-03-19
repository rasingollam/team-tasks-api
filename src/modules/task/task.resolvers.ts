import { createTask, assignTask, updateTaskStatus, findTasksByTeam } from './task.service';

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
  },
};
