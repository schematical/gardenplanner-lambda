import 'reflect-metadata';
import {Field, ObjectType} from "type-graphql";
import {BaseEntity} from "../../../libs/Base.entity";
import {getModelForClass, prop, Ref} from '@typegoose/typegoose';
import {Container} from "typedi";
// 1. Create an interface representing a document in MongoDB.
@ObjectType()
export class CropSpecies extends BaseEntity {

    @prop({ type: () => String })
    @Field(() => String)
    importId?: string;

    @prop({ type: () => String })
    @Field(() => String)
    name: string;

    @Field(() => CropSpecies)
    @prop({ ref: () => CropSpecies })
    public parentCropSpecies?: Ref<CropSpecies>;

    @prop({ type: () => [String] })
    @Field(() => [String], { nullable: true})
    otherNames?: string[];

    @prop({ type: () => [String] })
    @Field(() => [String], { nullable: true})
    sewingMethods?: string[];

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    lowTemp?: number;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    highTemp?: number;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    minSpacingInCM?: number;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    maxSpacingInCM?: number;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    harvestDayMin?: number;

    @prop({ type: () => Number })
    @Field(() => Number, { nullable: true})
    harvestDayMax?: number;

    @Field(() => [CropSpecies], { nullable: true })
    @prop({ ref: () => CropSpecies })
    public compatibleCropSpecieIds?: Ref<CropSpecies>[];

}

// 3. Create a Model.
export const CropSpeciesModel = getModelForClass(CropSpecies);
Container.set('CropSpeciesModel', CropSpeciesModel);

export const enum CropSpeciesSewMethods {
    IN_GARDEN = 'in_garden'
}