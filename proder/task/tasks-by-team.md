# Tasks By Team

Summary
- Lists all tasks for a given team.

Permission
- Requires an authenticated user.
- Caller must be a team member or owner.

Query

```graphql
query TasksByTeam($teamId: String!) {
  tasksByTeam(teamId: $teamId) {
    id
    title
    description
    status
    assignedTo
  }
}
```

Variables

```json
{ "teamId": "team-id-uuid" }
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"query TasksByTeam($teamId: String!){ tasksByTeam(teamId: $teamId){ id title description status assignedTo } }","variables":{"teamId":"team-id-uuid"}}'
```

Success Response

```json
{
  "data": {
    "tasksByTeam": [
      {"id":"task-1","title":"Write docs","description":"...","status":"TODO","assignedTo":null},
      {"id":"task-2","title":"Implement API","description":"...","status":"IN_PROGRESS","assignedTo":"user-id-uuid"}
    ]
  }
}
```

Notes
- For large result sets, add pagination arguments to the query.
