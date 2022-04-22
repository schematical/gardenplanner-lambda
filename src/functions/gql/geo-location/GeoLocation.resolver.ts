import 'reflect-metadata';
import {Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";

import {Inject, Service} from "typedi";
import {GeoLocationService} from "./GeoLocation.service";
import {BaseResolver} from "../../../libs/Base.resolver";
import {
    GeoLocation,
    GeoLocationCreateInput,
    GeoLocationFilterInput, GeoLocationUpdateInput
} from "./GeoLocation.entity";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
import {HydratedDocument} from "mongoose";
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
            query.city = {$regex: new RegExp(`^${query.city}`) };
        }
        console.log(query);
        return this.geoLocationService.find(query);
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