import {BaseEntity} from "@libs/Base.entity";
import {BaseService, iBaseService} from "@libs/Base.service";
import {Inject, Service} from "typedi";
import {Query, Resolver} from "type-graphql";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
import {Type} from "./util";
import {FilterQuery} from "mongoose";

export interface iBaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>> {
    list();
}

export function BaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>>(
    E: Type<EntityT>,
    S: Type<ServiceT>,
): Type<iBaseResolver<EntityT, ServiceT>>  {
    @Service()
    @Resolver(() => E)
   class BaseResolverClass {

        @Inject(S.name)
        public readonly service: ServiceT;

        @Query(
            () => {
                return [E];
            },
            {
                name: 'list' + E.name
            }
        )
        list() {
            return this.service.find({});
        }
   }
   return BaseResolverClass;
}