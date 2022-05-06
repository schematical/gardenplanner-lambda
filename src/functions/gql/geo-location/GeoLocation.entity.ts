import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {GraphQLJSONObject} from "graphql-type-json";
import {CropSpecies} from "../crop-species/CropSpecies.entity";
import mongoose from "mongoose";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
@index({ location: '2dsphere' })
export class GeoLocation extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    importId?: string;

    @prop({ type: () => String })
    @Field(() => String)
    city: string;

    @prop({ type: () => String })
    @Field(() => String)
    state: string;

    @prop({ type: () => String })
    @Field(() => String)
    country: string;

    @prop({ type: [Number], dim: 2 })
    @Field(() => [Number], { nullable: true })
    location?: number[]; //  TypegooseLocation;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true })
    nearestMatchDist?: number;

    @Field(() => ID, { nullable: true })
    @prop({ ref: () => GeoLocation })
    nearestMatchGeoLocationId?: Ref<GeoLocation>

    @Field(() => GraphQLJSONObject, { nullable: true })
    @prop({ type: () => Schema.Types.Mixed })
    exactMatch?: { [key: string]: any };



}

// 3. Create a Model.
export const GeoLocationModel = getModelForClass(GeoLocation);
Container.set('GeoLocationModel', GeoLocationModel);


export const enum GeoLocationSewMethods {
    IN_GARDEN = 'in_garden'
}
@InputType()
export class GeoLocationCreateInput implements Partial<GeoLocation>{
    @Field(() => String)
    city: string;
}
@InputType()
export class GeoLocationUpdateInput extends GeoLocationCreateInput implements Partial<GeoLocation>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class GeoLocationFilterInput implements FilterQuery<GeoLocation>{
    @Field(() => String)
    city?: string;
}
@ObjectType()
export class CropSpecieDataByGeoLocationResponseEntry {
    @Field(() => CropSpecies)
    cropSpecies: CropSpecies;

    @Field(() => Number)
    earlyStartMonth: number;

    @Field(() => Number)
    lateStartMonth: number;
}
@InputType()
export class CropSpecieDataByGeoLocationInput{
    @Field(() => ID)
    geoLocationId: mongoose.Schema.Types.ObjectId;

    @Field(() => [ID])
    cropSpeciesIds: mongoose.Schema.Types.ObjectId[];
}