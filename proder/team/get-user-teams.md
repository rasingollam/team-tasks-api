# Get Teams For User

Summary
- Returns teams a given user is a member of.

Permission
- Requires an authenticated user.

Query

```graphql
query UserMemberTeams($userId: String!) {
  userMemberTeams(userId: $userId) {
    id
    name
    ownerId
  }
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
  -d '{"query":"query UserMemberTeams($userId: String!){ userMemberTeams(userId: $userId){ id name ownerId } }","variables":{"userId":"user-id-uuid"}}'
```

Success Response (200)

```json
{
  "data": {
    "userMemberTeams": [
      {"id":"team-1","name":"Product","ownerId":"owner-id"},
      {"id":"team-3","name":"Growth","ownerId":"another-owner"}
    ]
  }
}
```

Notes
- `myMemberTeams` is a convenience query that returns teams for the authenticated user without passing `userId`.
