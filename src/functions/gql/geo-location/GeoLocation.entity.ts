import 'reflect-metadata';
import {Field, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
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
    country: string;

    @Field(() => GeoLocation)
    @prop({ ref: () => GeoLocation })
    public parentGeoLocation?: Ref<GeoLocation>;


    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    harvestDayMax?: number;

    @Field(() => [GeoLocation], { nullable: true })
    @prop({ ref: () => GeoLocation })
    compatibleGeoLocation?: Ref<GeoLocation>[];

    @prop({ type: Number, dim: 2 })
    @Field(() => [[Number]], { nullable: true })
    location?: number[][];

    @prop({ type: Number, dim: 1 })
    @Field(() => [Number], { nullable: true })
    monthMap?: number[];
}

// 3. Create a Model.
export const GeoLocationModel = getModelForClass(GeoLocation);
Container.set('GeoLocationModel', GeoLocationModel);

