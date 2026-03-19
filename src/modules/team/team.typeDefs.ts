import { gql } from 'apollo-server-express';

export const teamTypeDefs = gql`
  type Team {
    id: String!
    name: String!
    ownerId: String!
  }

  type TeamMember {
    id: String!
    userId: String!
    teamId: String!
  }

  extend type Query {
    team(id: String!): Team
  }

  extend type Mutation {
    createTeam(name: String!): Team
    addMember(teamId: String!, userId: String!): TeamMember
    addMembers(teamId: String!, userIds: [String!]!): [TeamMember!]!
    removeMember(teamId: String!, userId: String!): Boolean
    updateTeam(id: String!, name: String!): Team
    deleteTeam(id: String!): Boolean
  }
`;
