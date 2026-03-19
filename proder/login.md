**User Login (GraphQL)**

- **Path**: `/graphql` (POST)
- **Operation**: GraphQL mutation `login`
- **Purpose**: Authenticate an existing user. Returns an `AuthPayload` containing a JWT `token` and the `user` object.

**Mutation**

```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      id
      email
      name
    }
  }
}
```

**Variables (example)**

```json
{
  "email": "alice@example.com",
  "password": "s3cretPass!"
}
```

**Success Response (example)**

```json
{
  "data": {
    "login": {
      "token": "eyJhbGciOi...",
      "user": {
        "id": "cl4x....",
        "email": "alice@example.com",
        "name": "Alice"
      }
    }
  }
}
```

**How to use the token**
- For subsequent authenticated requests, include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

In GraphQL Studio / Playground, add under `Headers`:

```json
{
  "Authorization": "Bearer eyJhbGciOi..."
}
```

**cURL Example**

```bash
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation Login($email: String!, $password: String!){ login(email:$email,password:$password){ token user{ id email name }}}","variables":{"email":"alice@example.com","password":"s3cretPass!"}}'
```

**Errors**
- `Invalid credentials` — returned when email is not found or password verification fails.
- `INTERNAL_SERVER_ERROR` — indicates a server/database issue (see registration doc for common DB troubleshooting).

**Notes & Security**
- Tokens are signed with `JWT_SECRET` from the environment. Keep that secret safe and rotate as needed.
- The `login` mutation does not return the raw password; passwords are compared using secure bcrypt verification.

**Next steps (optional)**
- Add expiry/refresh token flow and document token lifetime.
- Add rate-limiting or brute-force protection to the login mutation.
