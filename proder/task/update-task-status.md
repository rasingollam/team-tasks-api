# Update Task Status

Summary
- Change the status of a task (TODO, IN_PROGRESS, DONE).

Permission
- Requires an authenticated user.
- Typically the team owner or assignee may change status.

Mutation

```graphql
mutation UpdateTaskStatus($taskId: String!, $status: TaskStatus!) {
  updateTaskStatus(taskId: $taskId, status: $status) {
    id
    status
  }
}
```

Variables

```json
{ "taskId": "task-id-uuid", "status": "IN_PROGRESS" }
```

Example cURL

```bash
curl -X POST https://your-api.example.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{"query":"mutation UpdateTaskStatus($taskId: String!, $status: TaskStatus!){ updateTaskStatus(taskId: $taskId, status: $status){ id status } }","variables":{"taskId":"task-id-uuid","status":"IN_PROGRESS"}}'
```

Success Response

```json
{ "data": { "updateTaskStatus": { "id":"task-id-uuid", "status":"IN_PROGRESS" } } }
```
