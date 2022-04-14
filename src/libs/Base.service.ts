import {BaseEntity} from "./Base.entity";

import {Inject} from "typedi";
import {AnyParamConstructor, BeAnObject, ReturnModelType} from "@typegoose/typegoose/lib/types";
import {FilterQuery} from "mongoose";
import {Type} from "@libs/util";
export interface iBaseService<EntityT extends BaseEntity> {
    find(query: FilterQuery<EntityT>);
    createOne(input: Partial<EntityT>): Promise<EntityT>;
}
export function BaseService<EntityT extends BaseEntity>(
    Entity: Type<EntityT>
): Type<iBaseService<EntityT>> {
    class BaseServiceClass<T> {
        @Inject(Entity.name + 'Model')
        private model: ReturnModelType<AnyParamConstructor<EntityT>, BeAnObject>;

        find(query: FilterQuery<EntityT>) {
            return this.model.find(query);
        }
        createOne(input: Partial<EntityT>): Promise<EntityT> {
            return this.model.create(input);
        }
    }

    return BaseServiceClass;
}