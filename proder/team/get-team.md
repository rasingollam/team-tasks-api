**Get Team (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation(s)**:
  - `team(id: String!): Team` — Get a single team by id. (Implemented)
  - `teams: [Team!]!` — List all teams (not implemented by default; suggested API shown below).

**Query — single team (implemented)**

```graphql
query GetTeam($id: String!) {
  team(id: $id) {
    id
    name
    ownerId
  }
}
```

**Variables (example)**

```json
{
  "id": "team123"
}
```

**Query — list teams (suggested / optional)**

```graphql
query ListTeams {
  teams {
    id
    name
    ownerId
  }
}
```

**Notes**
- `team(id)` is implemented in `src/modules/team/team.resolvers.ts` and returns the result of `findTeamById`.
- If you add a `teams` query, consider authorization rules: list only teams the user belongs to, or only public teams, depending on your app model.
