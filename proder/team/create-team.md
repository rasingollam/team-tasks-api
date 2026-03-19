**Create Team (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation**: GraphQL mutation `createTeam`
- **Purpose**: Create a new Team. The authenticated user becomes the `ownerId` of the team.

**Implemented**: Yes — see `src/modules/team/createTeam` resolver. The resolver requires a logged-in user (`ctx.userId`) and will throw `Unauthorized` if missing.

**Mutation**

```graphql
mutation CreateTeam($name: String!) {
  createTeam(name: $name) {
    id
    name
    ownerId
  }
}
```

**Variables (example)**

```json
{
  "name": "Engineering"
}
```

**cURL Example**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"query":"mutation CreateTeam($name: String!){ createTeam(name:$name){ id name ownerId }}","variables":{"name":"Engineering"}}'
```

**Notes**
- The resolver sets `ownerId` from the authenticated `userId` in context. Add the `Authorization` header in GraphQL Studio under `Headers` as `{"Authorization":"Bearer <token>"}`.
- The mutation returns the created `Team` object.
