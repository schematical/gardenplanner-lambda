import 'reflect-metadata';
import {Field, ID, InputType, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
import {FilterQuery, Schema} from "mongoose";
import {GeoLocation} from "../geo-location/GeoLocation.entity";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class User extends BaseEntity {
    @prop({ type: () => String })
    @Field(() => String)
    email: string;

    @prop({ type: () => String })
    @Field(() => String)
    firstName: string;

    @prop({ type: () => String })
    @Field(() => String)
    lastName: string;

    @prop({ type: () => GeoLocation })
    @Field(() => GeoLocation)
    defaultGeoLocation: Ref<GeoLocation>;

}

// 3. Create a Model.
export const UserModel = getModelForClass(User);
Container.set('UserModel', UserModel);

@InputType()
export class UserCreateInput implements Partial<User>{
    @Field(() => String)
    firstName: string;

    @Field(() => String)
    lastName: string;
}
@InputType()
export class UserUpdateInput extends UserCreateInput implements Partial<User>{
    @Field(() => ID, { nullable: true})
    _id: Schema.Types.ObjectId;
}
@InputType()
export class UserFilterInput implements  FilterQuery<User>{
    @Field(() => String)
    firstName?: string;

    @Field(() => String)
    lastName?: string;
}
@InputType()
export class UserSignupPartialInput implements  Partial<User>{
    @Field(() => String)
    email?: string;
}