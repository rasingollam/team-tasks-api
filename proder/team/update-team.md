**Update Team (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation**: GraphQL mutation `updateTeam` (suggested)
- **Purpose**: Update team properties (e.g., `name`). Typically restricted to the team owner.

**Implemented**: Not currently implemented in the repository. The project has `createTeam` and `team` queries implemented. Example mutation and guidance below to add the resolver.

**Suggested Mutation**

```graphql
mutation UpdateTeam($id: String!, $name: String!) {
  updateTeam(id: $id, name: $name) {
    id
    name
    ownerId
  }
}
```

**Variables (example)**

```json
{
  "id": "team123",
  "name": "Platform Engineering"
}
```

**Server-side notes**
- Implement a resolver that checks `ctx.userId === team.ownerId` before allowing the update.
- Example resolver sketch (TypeScript):

```ts
// in src/modules/team/team.resolvers.ts
updateTeam: async (_: any, args: any, ctx: any) => {
  const { id, name } = args;
  const userId = ctx.userId;
  if (!userId) throw new Error('Unauthorized');
  const team = await findTeamById(id);
  if (!team) throw new Error('Not found');
  if (team.ownerId !== userId) throw new Error('Forbidden');
  return prisma.team.update({ where: { id }, data: { name } });
}
```

**Notes**
- Adding validation (e.g., name length) is recommended.
