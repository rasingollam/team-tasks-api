import { userTypeDefs } from '../modules/user/user.typeDefs';
import { userResolvers } from '../modules/user/user.resolvers';
import { teamTypeDefs } from '../modules/team/team.typeDefs';
import { teamResolvers } from '../modules/team/team.resolvers';
import { taskTypeDefs } from '../modules/task/task.typeDefs';
import { taskResolvers } from '../modules/task/task.resolvers';

export const typeDefs = [userTypeDefs, teamTypeDefs, taskTypeDefs];
export const resolvers = [userResolvers, teamResolvers, taskResolvers];
