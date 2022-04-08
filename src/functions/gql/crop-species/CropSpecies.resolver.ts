import 'reflect-metadata';
import {Mutation, Query, Resolver} from "type-graphql";

import { Service} from "typedi";
import {CropSpeciesService} from "./CropSpecies.service";
import {CropSpecies} from "./CropSpecies.entity";
@Resolver(() => CropSpecies)
@Service()
export class CropSpeciesResolver {
    // dependency injection

    constructor(
        private cropSpeciesService: CropSpeciesService
    ) {
    }


    @Query(() => {
        return [CropSpecies];
    })
    cropSpecies() {
        /*const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];*/

        return this.cropSpeciesService.find();
    }
    @Mutation(() => {
        return CropSpecies;
    })
    createCropSpecies() {
        /*const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];*/

        return this.cropSpeciesService.create();
    }
    @Query(() => {
        return [CropSpecies];
    })
    importTest() {
        return this.cropSpeciesService.importTest();
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