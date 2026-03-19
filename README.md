# Team Tasks API

> A production-ready GraphQL API showcasing Node.js, TypeScript, Prisma and PostgreSQL, with a Vite + React UI in `ui/`.

---

## Features

- GraphQL API (Apollo Server) at `/graphql`
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Team and Task management (teams, members, tasks, assignments)
- Separate Vite React UI (in `ui/`)

## Tech Stack

- Node.js + TypeScript
- Apollo Server (GraphQL)
- Express
- Prisma (PostgreSQL)
- Vite + React for the frontend (in `ui/`)
- Docker Compose for local Postgres

## Prerequisites

- Node.js 18+ and npm
- Docker & Docker Compose (recommended for running Postgres locally)

## Environment

Create a `.env` file in the project root (copy from your secrets manager). Example values for local development:

```
DATABASE_URL="postgresql://devuser:devpass@localhost:5432/db_team_tasks?schema=public"
JWT_SECRET="replace_with_a_strong_secret"
PORT=4000
```

Notes:
- The repository includes `docker-compose.yml` that starts a Postgres instance with user `devuser`, password `devpass`, and database `db_team_tasks`.
- Prisma client generator outputs to `generated/prisma` as configured in `prisma/schema.prisma`.

## Local development

1. Start Postgres (Docker Compose):

```bash
docker-compose up -d
```

2. Install dependencies:

```bash
npm install
cd ui && npm install   # to install frontend deps (optional if you only work on API)
```

3. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate   # runs `prisma migrate dev --name init`
```

4. Start the backend server (dev mode):

```bash
npm run dev
```

5. Start the frontend (dev mode) in another terminal:

```bash
npm run dev:ui
# or: cd ui && npm run dev
```

The GraphQL Playground / GraphQL endpoint will be available at `http://localhost:4000/graphql` (or `PORT`).

## Build & Production

1. Build the backend TypeScript:

```bash
npm run build
```

2. Build the frontend:

```bash
npm run build:ui
```

3. Start the compiled server (after `npm run build`):

```bash
npm start
```

Production notes:
- The project does not include a production-ready process manager or Dockerfile by default. For production, containerize the app or use a process manager (PM2, systemd), serve the built `ui/dist` with a static server or CDN, and ensure HTTPS termination.

## Prisma & Database

- Schema: `prisma/schema.prisma` (Postgres provider). Models include `User`, `Team`, `TeamMember`, and `Task`.
- Generated client path: `generated/prisma`
- Common commands:

```bash
npm run prisma:generate
npm run prisma:migrate
```

If you need to reset the local DB during development:

```bash
npx prisma migrate reset
```

## GraphQL Usage / Examples

Endpoint: `POST /graphql`

Example mutation: register a user

```
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    email
    name
  }
}

# variables
{
  "input": { "email": "alice@example.com", "password": "secret", "name": "Alice" }
}
```

Example mutation: login (returns JWT token)

```
mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user { id email name }
  }
}
```

Example query: get team with tasks

```
query Team($id: String!) {
  team(id: $id) {
    id
    name
    members { user { id email name } }
    tasks { id title status assignee { id name } }
  }
}
```

When making authenticated requests, include the header:

```
Authorization: Bearer <JWT_TOKEN>
```

Refer to the GraphQL type definitions under `src/modules/*/*.ts` for exact field names and available operations.

## Environment & Secrets

- Keep `JWT_SECRET` secret and rotate it regularly.
- For production, use a secure secret store or environment management (Vault, AWS Secrets Manager, etc.).

## Health, Monitoring & Security

- Use structured logs and a monitoring stack (Prometheus + Grafana, Datadog, etc.).
- Ensure TLS termination at the load balancer or reverse proxy.
- Validate inputs, set reasonable CORS policies, and rate-limit public endpoints.

## Deployment suggestions

- Containerize the app with a multi-stage Dockerfile, include `npm run build` and run `node dist/index.js` in the final image.
- Use managed Postgres for production and set `DATABASE_URL` accordingly.
- Run database migrations as part of the deployment pipeline (with backups and review).

## Contributing

- Fork, create a feature branch, open a PR with tests and a clear description.

## License

This project does not include a license file. Add one if you plan to open-source it.

---

If you'd like, I can:

- add a Dockerfile for the backend and a sample GitHub Actions workflow for CI/CD,
- or generate a `.env.example` and a small `Makefile` with common commands.

Let me know which of those you'd like next.
