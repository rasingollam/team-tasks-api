**User Registration (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation**: GraphQL mutation `register`
- **Purpose**: Create a new user account in the system. Stores email, hashed password, and optional name.

**Mutation**

mutation Register($email: String!, $password: String!, $name: String) {
  register(email: $email, password: $password, name: $name) {
    id
    email
    name
  }
}

**Variables (example)**

```json
{
  "email": "alice@example.com",
  "password": "s3cretPass!",
  "name": "Alice"
}
```

**Success Response (example)**

```json
{
  "data": {
    "register": {
      "id": "cl4x....",
      "email": "alice@example.com",
      "name": "Alice"
    }
  }
}
```

**cURL Example**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation Register($email: String!, $password: String!, $name: String){ register(email:$email,password:$password,name:$name){ id email name }}","variables":{"email":"alice@example.com","password":"s3cretPass!","name":"Alice"}}'
```

**GraphQL Studio (or Playground)**
- Paste the mutation in the editor and the variables JSON in the variables panel. Run to create a user.

**Error cases & troubleshooting**
- `INTERNAL_SERVER_ERROR` with message like `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` — indicates `DATABASE_URL` was not set or contained an invalid value when the Prisma client / adapter constructed the DB connection. Fixes:
  - Ensure `.env` contains a valid `DATABASE_URL`, e.g.:
    `DATABASE_URL="postgresql://devuser:devpass@localhost:5432/db_team_tasks?schema=public"`
  - Ensure server loads env before Prisma is imported (the project uses `import 'dotenv/config'` at top of `src/index.ts`).
  - Ensure the Postgres container/service is running and reachable (e.g., `docker ps`, check host/port and credentials).
- `Invalid credentials` — returned by the `login` mutation when authentication fails.

**Notes**
- The mutation returns a `User` object (id, email, name). The `login` mutation returns an `AuthPayload` with `token` and `user`.
- Passwords are hashed before storage; client should never send plain passwords to anything other than the GraphQL `register` flow.

**Next steps / optional additions**
- Add an example `Postman` collection or an OpenAPI-like doc for non-GraphQL clients (not required for GraphQL-first APIs).
- Document response codes and validation rules (e.g., password strength, email uniqueness) as you add validations.
