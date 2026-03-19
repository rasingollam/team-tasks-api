# Create Task

Summary
- Creates a new task under a team.

Permission
- Requires an authenticated user.
- The caller must be a member of the team (or owner) to create tasks.

Mutation

```graphql
mutation CreateTask($teamId: String!, $title: String!, $description: String) {
  createTask(teamId: $teamId, title: $title, description: $description) {
    id
    title
    description
    status
    teamId
    assignedTo
  }
}
```

Variables

```json
{
  "teamId": "team-id-uuid",
  "title": "Write API docs",
  "description": "Create proder docs for tasks"
}
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"mutation CreateTask($teamId: String!, $title: String!, $description: String){ createTask(teamId: $teamId, title: $title, description: $description){ id title description status teamId assignedTo } }","variables":{"teamId":"team-id-uuid","title":"Write API docs","description":"Create proder docs for tasks"}}'
```

Success Response

```json
{
  "data": {
    "createTask": {
      "id": "task-id-uuid",
      "title": "Write API docs",
      "description": "Create proder docs for tasks",
      "status": "TODO",
      "teamId": "team-id-uuid",
      "assignedTo": null
    }
  }
}
```

Possible Errors
- `Unauthorized`: missing or invalid `Authorization` header.
- `Forbidden`: caller is not a team member.
- `NotFound`: team not found.

Notes
- By default `status` is `TODO` and `assignedTo` is `null`.
