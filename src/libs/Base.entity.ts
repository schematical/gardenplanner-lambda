
import 'reflect-metadata';
import {prop} from "@typegoose/typegoose";
import {Field, ID} from "type-graphql";
import {Schema } from 'mongoose';
class BaseEntity {
    @prop({ type: () => Schema.Types.ObjectId })
    @Field(() => ID)
    id: Schema.Types.ObjectId;
}
export {
    BaseEntity
}