# Assign Task

Summary
- Assigns a user to a task (sets `assignedTo`).

Permission
- Requires an authenticated user.
- Typically only the team owner or task assignee should be able to assign; adjust permissions as needed.

Mutation

```graphql
mutation AssignTask($taskId: String!, $userId: String!) {
  assignTask(taskId: $taskId, userId: $userId) {
    id
    assignedTo
  }
}
```

Variables

```json
{ "taskId": "task-id-uuid", "userId": "user-id-uuid" }
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"mutation AssignTask($taskId: String!, $userId: String!){ assignTask(taskId: $taskId, userId: $userId){ id assignedTo } }","variables":{"taskId":"task-id-uuid","userId":"user-id-uuid"}}'
```

Success Response

```json
{ "data": { "assignTask": { "id":"task-id-uuid", "assignedTo":"user-id-uuid" } } }
```

Possible Errors
- `Unauthorized`, `Forbidden`, `NotFound`.
