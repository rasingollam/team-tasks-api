import { gql } from 'apollo-server-express';

export const taskTypeDefs = gql`
  enum TaskStatus {
    TODO
    IN_PROGRESS
    DONE
  }

  type Task {
    id: String!
    title: String!
    description: String
    status: TaskStatus!
    teamId: String!
    assignedTo: String
  }

  extend type Query {
    tasksByTeam(teamId: String!): [Task!]!
  }

  extend type Mutation {
    createTask(teamId: String!, title: String!, description: String): Task
    assignTask(taskId: String!, userId: String!): Task
    updateTaskStatus(taskId: String!, status: TaskStatus!): Task
  }
`;
