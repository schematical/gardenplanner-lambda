import "reflect-metadata";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import _ from "underscore";
import { Inject, Service } from "typedi";
import {
  CropSpecies,
  CropSpeciesCreateInput,
  CropSpeciesFilterInput,
  CropSpeciesImportKCalResponse,
  CropSpeciesUpdateInput,
} from "./CropSpecies.entity";
import { CropSpeciesService } from "./CropSpecies.service";

import DataLoader from "dataloader";
import { HydratedDocument } from "mongoose";
import { BaseResolver } from "../../../libs/Base.resolver";
import {
  GeoLocation,
  GeoLocationFilterInput,
} from "@functions/gql/geo-location/GeoLocation.entity";
import { GraphQLJSONObject } from "graphql-type-json";
@Service()
@Resolver(() => CropSpecies)
export class CropSpeciesResolver extends BaseResolver(
  CropSpecies,
  CropSpeciesService,
  CropSpeciesFilterInput,
  CropSpeciesCreateInput,
  CropSpeciesUpdateInput
) {
  @Inject("CropSpeciesService")
  private cropSpeciesService: CropSpeciesService;
  constructor() {
    super();
  }

  @Query(
    () => {
      return [CropSpecies];
    },
    {
      name: "list" + CropSpecies.name,
    }
  )
  list(
    @Ctx() ctx,
    @Arg(
      "input",
      () => {
        return CropSpeciesFilterInput;
      },
      { nullable: true }
    )
    input
  ) {
    let query: any = input || {};
    if (query.name) {
      query.name = { $regex: new RegExp(`^${query.name}`, "i") };
    } else {
      delete query.name;
    }
    console.log(query);
    return this.cropSpeciesService.find(query);
  }

  @Query(() => {
    return [CropSpecies];
  })
  importTest() {
    return this.cropSpeciesService.importTest();
  }
  @Query(() => [CropSpecies])
  importCal() {
    return this.cropSpeciesService.importCal();
  }
  @Query(() => CropSpeciesImportKCalResponse)
  importOneKCal() {
    return this.cropSpeciesService.importOneKCal();
  }
  @FieldResolver(() => [CropSpecies])
  async compatibleCropSpecies(
    @Root() cropSpecies: HydratedDocument<CropSpecies>,
    @Ctx() ctx
  ): Promise<CropSpecies[]> {
    if (!cropSpecies.compatibleCropSpecieIds) {
      return Promise.resolve([]);
    }
    const dataLoaderNamespace = "CropSpecies:compatibleCropSpecies";
    const dataLoader = this.cropSpeciesService.initManyToManyDataLoader(
      ctx,
      dataLoaderNamespace
    );
    const compatibleCropSpecies = await dataLoader.load(
      cropSpecies.compatibleCropSpecieIds
    );
    return compatibleCropSpecies;
  }
  @FieldResolver(() => [CropSpecies])
  async avoidCropSpecies(
    @Root() cropSpecies: HydratedDocument<CropSpecies>,
    @Ctx() ctx
  ): Promise<CropSpecies[]> {
    if (!cropSpecies.compatibleCropSpecieIds) {
      return Promise.resolve([]);
    }
    const dataLoaderNamespace = "CropSpecies:compatibleCropSpecies";
    const dataLoader = this.cropSpeciesService.initManyToManyDataLoader(
      ctx,
      dataLoaderNamespace
    );
    const avoidCropSpecies = await dataLoader.load(
      cropSpecies.avoidCropSpecieIds
    );
    return avoidCropSpecies;
  }

  @FieldResolver(() => GraphQLJSONObject, { nullable: true })
  async nutrition(
    @Root() cropSpecies: HydratedDocument<CropSpecies>,
    @Ctx() ctx
  ): Promise<any> {
    const dataLoader =
      this.cropSpeciesService.testPopulateNutritionDataLoader(ctx);
    const foodData = await dataLoader.load(cropSpecies);
    console.log("{ foodData }", { foodData });
    return { foodData };
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
