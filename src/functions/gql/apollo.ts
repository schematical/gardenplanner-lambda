import config from "config";
import {connect} from "mongoose";
import {buildSchema} from "type-graphql";
import {UserResolver} from "@functions/gql/user/User.resolver";
import {CropSpeciesResolver} from "@functions/gql/crop-species/CropSpecies.resolver";
import {Container} from "typedi";

export const getApolloConfig = async () => {
    const url = config.get<string>('db.host');
    await connect(
        url,
        {}
    );
    const schema = await buildSchema({
        resolvers: [UserResolver, CropSpeciesResolver],
        container: Container,
    });
    const apolloConfig = {
        schema,
        introspection: true,
        playground: {
            endpoint: '/dev/graphql',
        },
        debug: true,
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    }
    return apolloConfig;
}