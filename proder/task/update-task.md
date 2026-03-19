# Update Task

Summary
- Update title, description, status, or `assignedTo` for a task.

Permission
- Requires an authenticated user.
- Only the team owner may modify tasks.

Mutation

```graphql
mutation UpdateTask($taskId: String!, $title: String, $description: String, $status: TaskStatus, $assignedTo: String) {
  updateTask(taskId: $taskId, title: $title, description: $description, status: $status, assignedTo: $assignedTo) {
    id
    title
    description
    status
    assignedTo
  }
}
```

Variables Example

```json
{
  "taskId": "task-id-uuid",
  "title": "New title",
  "description": "Updated details",
  "status": "IN_PROGRESS",
  "assignedTo": "user-id-uuid"
}
```

Success Response

```json
{
  "data": { "updateTask": { "id":"task-id-uuid","title":"New title","description":"Updated details","status":"IN_PROGRESS","assignedTo":"user-id-uuid" } }
}
```
