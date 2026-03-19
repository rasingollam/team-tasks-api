# Delete User

Summary
- Permanently deletes a user account and cleans up related data.

Permission
- Requires an authenticated user.
- Users may only delete their own account (requester's `userId` must match the `userId` argument).

Mutation

```graphql
mutation DeleteUser($userId: String!) {
  deleteUser(userId: $userId)
}
```

Variables

```json
{ "userId": "user-id-uuid" }
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"mutation DeleteUser($userId: String!){ deleteUser(userId: $userId) }","variables":{"userId":"user-id-uuid"}}'
```

Success Response (200)

```json
{ "data": { "deleteUser": true } }
```

Possible Errors
- `Unauthorized`: missing or invalid `Authorization` header.
- `Forbidden`: requester is not the same user.
- `NotFound`: user not found.

Notes
- This mutation sets `assignedTo` to `null` for tasks assigned to the user and removes `TeamMember` rows for the user before deleting the account.
- If you need admins to delete users, adjust resolver permission logic accordingly.
