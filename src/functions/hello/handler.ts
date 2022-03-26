import { Container } from 'typedi';
import { ApolloServer, gql } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import {buildSchema} from "type-graphql";
import { UserResolver } from './user/User.resolver';
import { connect } from 'mongoose';


export const main = async () => {
  await connect('mongodb://localhost:27017/test');
  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [ UserResolver ],
      container: Container
    }),
    introspection: true,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  });
  return server.createHandler();
};
