import 'reflect-metadata';
import { Container } from 'typedi';
// import { Container } from 'typeorm-typedi-extensions';
import { ApolloServer } from 'apollo-server-lambda';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import {buildSchema} from "type-graphql";
import { UserResolver } from './user/User.resolver';
import { connect } from 'mongoose';
import {APIGatewayProxyCallback, APIGatewayProxyEvent, APIGatewayProxyHandler, Context} from "aws-lambda";

let handeler = null;
export const main = async (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyHandler> => {
  if (!handeler) {
    await connect(
        'mongodb://localhost:27017/test',
        { }
    );
    const schema = await buildSchema({
      resolvers: [UserResolver],
      container: Container,
    });
    const server = new ApolloServer({
      schema,
      introspection: true,
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });
    event.path = '/graphql';
    handeler = server.createHandler();
  }
  return handeler(event, context, callback);
};
