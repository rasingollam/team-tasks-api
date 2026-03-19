import 'dotenv/config';
import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/schema';
import { createContext } from './context';

const app = express();

// Serve UI static files from the project `ui/` folder
app.use(express.static(path.join(process.cwd(), 'ui')));

async function start() {
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }: { req: any }) => createContext({ req }) } as any);
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  // SPA fallback: serve index.html for unknown routes (so client-side routing works)
  app.get('*', (_req, res) => {
    res.sendFile(path.join(process.cwd(), 'ui', 'index.html'));
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log('Server ready at http://localhost:' + port + '/graphql — UI served at http://localhost:' + port)
  );
}

start();
