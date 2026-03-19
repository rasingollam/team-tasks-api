import 'dotenv/config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { typeDefs, resolvers } from './graphql/schema';
import { createContext } from './context';

const app = express();
async function start() {
  const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }: { req: any }) => createContext({ req }) } as any);
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });

  const port = process.env.PORT || 4000;
  app.listen(port, () => console.log('Server ready at http://localhost:' + port + '/graphql'));
}

start();
