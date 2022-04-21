import 'reflect-metadata';
import {Mutation, Query, Resolver} from "type-graphql";

import {Inject, Service} from "typedi";
import {GeoLocationService} from "./GeoLocation.service";
import {BaseResolver} from "../../../libs/Base.resolver";
import {
    GeoLocation,
    GeoLocationCreateInput,
    GeoLocationFilterInput, GeoLocationUpdateInput
} from "./GeoLocation.entity";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
@Resolver(() => GeoLocation)
@Service()
export class GeoLocationResolver extends BaseResolver(
    GeoLocation,
    GeoLocationService,
    GeoLocationFilterInput,
    GeoLocationCreateInput,
    GeoLocationUpdateInput,
){
    @Inject('GeoLocationService')
    private geoLocationService: GeoLocationService;
    constructor(

    ) {
        super();
    }
    @Query(
        () => {
            return [GeoLocation];
        },
        {
            name: 'geoLocationImportTest'
        }
    )
    importTest() {
        return this.geoLocationService.importTest();
    }
    
/*
    @Mutation()
    @Authorized(Roles.Admin) // auth guard
    removeRecipe(@Arg("id") id: string): boolean {
        return this.recipeService.removeById(id);
    }

    @FieldResolver()
    averageRating(@Root() recipe: Recipe) {
        return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
    }*/
}