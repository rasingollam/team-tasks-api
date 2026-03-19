**Delete Team (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation**: GraphQL mutation `deleteTeam` (suggested)
- **Purpose**: Permanently remove a team. Typically restricted to the team owner or admins.

**Implemented**: Not currently implemented in the repository. Example mutation and server guidance below.

**Suggested Mutation**

```graphql
mutation DeleteTeam($id: String!) {
  deleteTeam(id: $id)
}
```

**Variables (example)**

```json
{
  "id": "team123"
}
```

**Success Response (example)**

```json
{
  "data": {
    "deleteTeam": true
  }
}
```

**Server-side guidance**
- A resolver should verify `ctx.userId` is the owner (or has admin rights) before deleting.
- Example resolver sketch:

```ts
deleteTeam: async (_: any, args: any, ctx: any) => {
  const { id } = args;
  const userId = ctx.userId;
  if (!userId) throw new Error('Unauthorized');
  const team = await findTeamById(id);
  if (!team) throw new Error('Not found');
  if (team.ownerId !== userId) throw new Error('Forbidden');
  await prisma.team.delete({ where: { id } });
  return true;
}
```

**Notes**
- Consider soft-deletes if you need recoverability (add a `deletedAt` timestamp instead of removing rows).
