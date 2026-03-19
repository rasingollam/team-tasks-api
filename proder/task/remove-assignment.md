# Remove Task Assignment

Summary
- Unassigns a user from a task (sets `assignedTo` to `null`).

Permission
- Requires an authenticated user.
- Only the team owner may remove assignments (or change this to allow assignees to unassign themselves).

Mutation

```graphql
mutation RemoveAssignment($taskId: String!) {
  removeTaskAssignment(taskId: $taskId) {
    id
    assignedTo
  }
}
```

Variables

```json
{ "taskId": "task-id-uuid" }
```

Success Response

```json
{
  "data": {
    "removeTaskAssignment": { "id":"task-id-uuid", "assignedTo": null }
  }
}
```
