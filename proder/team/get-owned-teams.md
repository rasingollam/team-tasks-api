# Get Owned Teams

Summary
- Returns all teams owned by the authenticated user (team head).

Permission
- Requires an authenticated user.

Query

```graphql
query MyOwnedTeams {
  myOwnedTeams {
    id
    name
    ownerId
  }
}
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"query MyOwnedTeams{ myOwnedTeams{ id name ownerId } }"}'
```

Success Response (200)

```json
{
  "data": {
    "myOwnedTeams": [
      {"id":"team-1","name":"Product","ownerId":"owner-id"},
      {"id":"team-2","name":"Platform","ownerId":"owner-id"}
    ]
  }
}
```

Notes
- Useful for dashboards showing teams the user administers.
