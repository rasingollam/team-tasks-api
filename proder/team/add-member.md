# Add Team Member

Summary
- Adds an existing user to a team.

Permission
- Requires an authenticated user.
- Only the team owner (creator) may add members.

Mutation

```graphql
mutation AddMember($teamId: String!, $userId: String!) {
  addMember(teamId: $teamId, userId: $userId) {
    id
    userId
    teamId
  }
}
```

Variables

```json
{
  "teamId": "team-id-uuid",
  "userId": "user-id-uuid"
}
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"mutation AddMember($teamId: String!, $userId: String!){ addMember(teamId: $teamId, userId: $userId){ id name members { id name email } } }","variables":{"teamId":"team-id-uuid","userId":"user-id-uuid"}}'
```

Success Response (200)

```json
{
  "data": {
    "addMember": {
      "id": "team-member-id-uuid",
      "userId": "user-id-uuid",
      "teamId": "team-id-uuid"
    }
  }
}
```

Possible Errors
- `Unauthorized`: missing or invalid `Authorization` header.
- `Forbidden`: authenticated user is not the team owner.
- `NotFound`: team or user not found.
- `AlreadyMember`: the user is already a member of the team.

Notes
- The `userId` must reference an existing user account.
- The server validates permissions; callers should not assume an add will succeed.
- Use the `getTeam` query to verify membership after the mutation.

Add multiple members
- You can add multiple users in one request by providing an array of `userIds`.

Mutation

```graphql
mutation AddMembers($teamId: String!, $userIds: [String!]!) {
  addMembers(teamId: $teamId, userIds: $userIds) {
    id
    userId
    teamId
  }
}
```

Variables

```json
{
  "teamId": "team-id-uuid",
  "userIds": ["user-id-1","user-id-2"]
}
```

Notes on batch behavior
- Server should validate permissions (owner-only) and de-duplicate existing memberships.
- Implementation tip: use `prisma.teamMember.createMany()` or create per-user and return created `TeamMember` records. Handle partial failures by returning created items and surface errors for failed entries.
