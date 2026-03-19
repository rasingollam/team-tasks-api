# Remove Team Member

Summary
- Removes a user from a team.

Permission
- Requires an authenticated user.
- Only the team owner (creator) may remove members.

Mutation

```graphql
mutation RemoveMember($teamId: String!, $userId: String!) {
  removeMember(teamId: $teamId, userId: $userId)
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
  -d '{"query":"mutation RemoveMember($teamId: String!, $userId: String!){ removeMember(teamId: $teamId, userId: $userId) }","variables":{"teamId":"team-id-uuid","userId":"user-id-uuid"}}'
```

Success Response (200)

```json
{
  "data": {
    "removeMember": true
  }
}
```

Possible Errors
- `Unauthorized`: missing or invalid `Authorization` header.
- `Forbidden`: authenticated user is not the team owner.
- `NotFound`: team not found.
- `NotMember`: specified user was not a member (mutation returns `false`).

Notes
- This mutation returns `true` when a membership was deleted, otherwise `false`.
- To allow users to remove themselves, change permission logic in the resolver to permit `ctx.userId === userId`.
- For batch removals, call `removeMember` multiple times or implement a `removeMembers` mutation.
