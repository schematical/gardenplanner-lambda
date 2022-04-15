import config from "config";
import {connect} from "mongoose";
import {buildSchema} from "type-graphql";
import {UserResolver} from "./user/User.resolver";
import {CropSpeciesResolver} from "./crop-species/CropSpecies.resolver";
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