import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
dotenv.config();

const app = express();

async function start() {
  const server = new ApolloServer({ typeDefs: '', resolvers: {} } as any);
  await server.start();
  server.applyMiddleware({ app: app as any, path: '/graphql' });
  app.listen(process.env.PORT || 4000, () =>
    console.log('Server ready at http://localhost:' + (process.env.PORT || 4000) + '/graphql')
  );
}

start();
