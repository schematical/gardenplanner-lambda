import 'reflect-metadata';
import {Mutation, Query, Resolver} from "type-graphql";

import { Service} from "typedi";
import {GeoLocationService} from "./GeoLocation.service";
import {GeoLocation} from "./GeoLocation.entity";
@Resolver(() => GeoLocation)
@Service()
export class GeoLocationResolver {
    // dependency injection

    constructor(
        private geoLocationService: GeoLocationService
    ) {
    }


    @Query(() => {
        return [GeoLocation];
    })
    GeoLocation() {
        /*const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];*/

        return this.geoLocationService.find();
    }
    @Mutation(() => {
        return GeoLocation;
    })
    createGeoLocation() {
        /*const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];*/

        return this.geoLocationService.create();
    }
    @Query(() => {
        return [GeoLocation];
    })
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