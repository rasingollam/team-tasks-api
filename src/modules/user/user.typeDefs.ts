import { gql } from 'apollo-server-express';

export const userTypeDefs = gql`
  type User {
    id: String!
    email: String!
    name: String
  }

  type Query {
    me: User
    users: [User!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Mutation {
    register(email: String!, password: String!, name: String): User
    login(email: String!, password: String!): AuthPayload
    deleteUser(userId: String!): Boolean
  }
`;
