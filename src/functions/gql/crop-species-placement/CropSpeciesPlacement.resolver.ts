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
  CropSpeciesPlacement,
  CropSpeciesPlacementCreateInput,
  CropSpeciesPlacementFilterInput,
  CropSpeciesPlacementUpdateInput,
} from "./CropSpeciesPlacement.entity";
import { CropSpeciesPlacementService } from "./CropSpeciesPlacement.service";

import DataLoader from "dataloader";
import { HydratedDocument } from "mongoose";
import { BaseResolver } from "../../../libs/Base.resolver";
import {
  GeoLocation,
  GeoLocationFilterInput,
} from "@functions/gql/geo-location/GeoLocation.entity";
@Service()
@Resolver(() => CropSpeciesPlacement)
export class CropSpeciesPlacementResolver extends BaseResolver(
  CropSpeciesPlacement,
  CropSpeciesPlacementService,
  CropSpeciesPlacementFilterInput,
  CropSpeciesPlacementCreateInput,
  CropSpeciesPlacementUpdateInput
) {
  @Inject("CropSpeciesPlacementService")
  private CropSpeciesPlacementService;
  constructor() {
    super();
  }
/*

  @Query(
    () => {
      return [CropSpeciesPlacement];
    },
    {
      name: "list" + CropSpeciesPlacement.name,
    }
  )
  list(
    @Ctx() ctx,
    @Arg(
      "input",
      () => {
        return CropSpeciesPlacementFilterInput;
      },
      { nullable: true }
    )
    input
  ) {
    let query: any = input || {};
    if (query.name) {
      query.name = { $regex: new RegExp(`^${query.name}`, "i") };
    } else {
      delete(query.name);
    }
    console.log(query);
    return this.CropSpeciesPlacementService.find(query);
  }
*/


}
