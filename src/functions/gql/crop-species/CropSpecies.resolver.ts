import 'reflect-metadata';
import {Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import _ from 'underscore';
import { Service} from "typedi";
import {CropSpeciesService} from "./CropSpecies.service";
import {CropSpecies} from "./CropSpecies.entity";
import * as DataLoader from "dataloader";
import { HydratedDocument } from 'mongoose';
@Service()
@Resolver(() => CropSpecies)
export class CropSpeciesResolver {

    constructor(
        private cropSpeciesService: CropSpeciesService
    ) {
    }


    @Query(
        () => {
            return [CropSpecies];
        },
        {
            name: 'cropSpecies'
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
    @FieldResolver(() => [CropSpecies])
    async compatibleCropSpecies(
        @Root() cropSpecies: HydratedDocument<CropSpecies>,
        @Ctx() ctx
    ): Promise<CropSpecies[]> {
        console.log("YYYYY:", cropSpecies.name, cropSpecies.compatibleCropSpecieIds);
        if (!cropSpecies.compatibleCropSpecieIds) {
            return Promise.resolve([]);
        }
        const dataLoaderNamespace = 'CropSpecies:compatibleCropSpecies';
        ctx.dataLoaders = ctx.dataLoaders || [];
        ctx.dataLoaders[dataLoaderNamespace] = ctx.dataLoaders[dataLoaderNamespace] || new DataLoader(async (cropSpeciesIds) => {
            const queryCropSpeciesIds = _.flatten(cropSpeciesIds);
            console.log("SEARCH: ", cropSpeciesIds);
            const compatibleCropSpecies = await this.cropSpeciesService.find({
                _id: {
                    $in: queryCropSpeciesIds
                }
            });
            console.log("compatibleCropSpecies", compatibleCropSpecies);
            return cropSpeciesIds.map((ids:any) => {
                return ids.map((id) => {
                    const foundCropSpecies = compatibleCropSpecies.find((c: CropSpecies) => {
                        return id.equals(c._id);
                    });
                    if (!foundCropSpecies) {
                        throw new Error("Could not find a species for: " + id);
                    }
                    console.log('foundCropSpecies: ' , foundCropSpecies);
                    return foundCropSpecies;
                });

            });
        });
        const compatibleCropSpecies = await ctx.dataLoaders[dataLoaderNamespace].load(cropSpecies.compatibleCropSpecieIds);
        console.log("FOUND: ", compatibleCropSpecies);
        return compatibleCropSpecies;
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