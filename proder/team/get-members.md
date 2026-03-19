# Get Team Members

Summary
- Returns the list of users who are members of a given team.

Permission
- Requires an authenticated user.
- The caller must be the team owner or a member of the team.

Query

```graphql
query TeamMembers($teamId: String!) {
  teamMembers(teamId: $teamId) {
    id
    email
    name
  }
}
```

Variables

```json
{
  "teamId": "team-id-uuid"
}
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"query TeamMembers($teamId: String!){ teamMembers(teamId: $teamId){ id email name } }","variables":{"teamId":"team-id-uuid"}}'
```

Success Response (200)

```json
{
  "data": {
    "teamMembers": [
      {"id":"owner-id","email":"owner@example.com","name":"Owner Name"},
      {"id":"member-id","email":"member@example.com","name":"Member Name"}
    ]
  }
}
```

Possible Errors
- `Unauthorized`: missing or invalid `Authorization` header.
- `Forbidden`: caller is not the owner nor a member of the team.
- `NotFound`: team not found.

Notes
- This returns `User` objects (id, email, name).
- For large teams consider paginating the query.
