import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, index, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {User} from "@functions/gql/user/User.entity";
import {GeoLocation} from "@functions/gql/geo-location/GeoLocation.entity";
import {Property} from "@functions/gql/property/Property.entity";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class CropSpeciesPlacement extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    name: string;

    @Field(() => User)
    @prop({ ref: () => User })
    public ownerUserId?: Ref<User>;

    @Field(() => Property)
    @prop({ ref: () => Property })
    public property?: Ref<Property>;

    @Field(() => CropSpecies)
    @prop({ ref: () => CropSpecies })
    public cropSpecies?: Ref<CropSpecies>;

}

// 3. Create a Model.
export const CropSpeciesPlacementModel = getModelForClass(CropSpeciesPlacement);
Container.set('CropSpeciesPlacementModel', CropSpeciesPlacementModel);

@InputType()
export class CropSpeciesPlacementCreateInput implements Partial<CropSpeciesPlacement>{
    @Field(() => String)
    name: string;
}
@InputType()
export class CropSpeciesPlacementUpdateInput extends CropSpeciesPlacementCreateInput implements Partial<CropSpeciesPlacement>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class CropSpeciesPlacementFilterInput implements FilterQuery<CropSpeciesPlacement>{
    @Field(() => String, { nullable: true})
    name?: string;
}