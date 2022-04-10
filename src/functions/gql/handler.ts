import 'reflect-metadata';
import { Container } from 'typedi';
import { ApolloServer } from 'apollo-server-lambda';
// import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import {buildSchema} from "type-graphql";
import { UserResolver } from './user/User.resolver';
import { connect } from 'mongoose';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, Context} from "aws-lambda";
import {CropSpeciesResolver} from "./crop-species/CropSpecies.resolver";
import * as config from 'config';

let handeler = null;
export const main = async (
    event: APIGatewayProxyEvent,
    context: Context,
    // callback: APIGatewayProxyCallback
): Promise<APIGatewayProxyHandler> => {
  if (!handeler) {
    const url = config.get<string>('db.host');
    await connect(
        url,
        { }
    );
    const schema = await buildSchema({
      resolvers: [UserResolver, CropSpeciesResolver],
      container: Container,
    });
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground:  {
        endpoint: '/dev/graphql',
      },
      debug: true,
      // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    handeler = server.createHandler();
  }
  event.path = '/graphql';
  return handeler(event, context);
};
