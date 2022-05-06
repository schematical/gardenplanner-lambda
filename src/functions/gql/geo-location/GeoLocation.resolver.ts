import 'reflect-metadata';
import {Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root} from "type-graphql";

import {Inject, Service} from "typedi";
import {GeoLocationService} from "./GeoLocation.service";
import {BaseResolver} from "../../../libs/Base.resolver";
import {
    CropSpecieDataByGeoLocationInput,
    CropSpecieDataByGeoLocationResponseEntry,
    GeoLocation,
    GeoLocationCreateInput,
    GeoLocationFilterInput, GeoLocationUpdateInput
} from "./GeoLocation.entity";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
import {HydratedDocument} from "mongoose";
import * as mongoose from "mongoose";
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
            name: 'list' + GeoLocation.name
        }
    )
    list(
        @Ctx() ctx,
        @Arg("input", () => {
            return GeoLocationFilterInput;
        }, { nullable: true}) input
    ) {
        let query: any = input || {};
        if (query.city) {
            query.city = {$regex:  new RegExp(`^${query.city}`, "i") };
        }
        console.log(query);
        return this.geoLocationService.find(query);
    }

    @Query(
        () => {
            return [CropSpecieDataByGeoLocationResponseEntry];
        },
        {
            name: 'getCropSpecieDataByGeoLocation'
        }
    )
    getCropSpecieDataByGeoLocation(
        @Ctx() ctx,
        @Arg("input", () => {
            return CropSpecieDataByGeoLocationInput;
        }, { nullable: true}) input: CropSpecieDataByGeoLocationInput
    ) {
        return this.geoLocationService.getCropSpecieDataByGeoLocation(ctx, input);
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
    @FieldResolver(() => GeoLocation, {nullable: true})
    async nearestMatch(
        @Ctx() ctx,
        @Root() geoLocation: HydratedDocument<GeoLocation>
    ): Promise<GeoLocation> {

        if (!geoLocation.nearestMatchGeoLocationId) {
            return Promise.resolve(null);
        }

        const dataLoader = this.geoLocationService.initDataLoader(ctx);
        const avoidCropSpecies = await dataLoader.load(geoLocation.nearestMatchGeoLocationId);
        return avoidCropSpecies;
    }
}