# Delete Task

Summary
- Permanently deletes a task from a team.

Permission
- Requires an authenticated user.
- Only the team owner may delete tasks.

Mutation

```graphql
mutation DeleteTask($taskId: String!) {
  deleteTask(taskId: $taskId)
}
```

Variables

```json
{ "taskId": "task-id-uuid" }
```

Success Response (200)

```json
{ "data": { "deleteTask": true } }
```

Possible Errors
- `Unauthorized`, `Forbidden`, `NotFound`.
