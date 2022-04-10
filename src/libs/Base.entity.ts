import 'reflect-metadata';
// import {prop } from "@typegoose/typegoose";
import {Field, ID, ObjectType} from "type-graphql";
import {Schema } from 'mongoose';
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";

@ObjectType()
class BaseEntity {

    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}

export {
    BaseEntity
}