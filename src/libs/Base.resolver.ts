import {BaseEntity} from "@libs/Base.entity";
import {BaseService, iBaseService} from "@libs/Base.service";
import {Inject, Service} from "typedi";
import {Query, Resolver} from "type-graphql";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";

export interface Type<T> extends Function {
    new (...args: any[]): T;
}
export function BaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>>(
    E: Type<EntityT>,
    S: Type<ServiceT>,
) {
    @Service()
    @Resolver(() => E)
   class BaseResolverClass {

        @Inject(S)
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

        }
   }
   return BaseResolverClass;
}