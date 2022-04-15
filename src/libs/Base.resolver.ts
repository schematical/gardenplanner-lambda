import {BaseEntity} from "./Base.entity";
import {BaseService, DeleteResponse, iBaseService} from "./Base.service";
import {Inject, Service} from "typedi";
import {Arg, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
import {Type} from "./util";
import {FilterQuery} from "mongoose";

export interface iBaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>> {
    list(
        ctx: any
    );
    createOne(
        ctx: any,
        input: Type<Partial<EntityT>>
    ): Promise<EntityT>
}

export function BaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>>(
    E: Type<EntityT>,
    S: Type<ServiceT>,
    CreateInput: Type<Partial<EntityT>>,
    UpdateInput: Type<Partial<EntityT>>
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
        list(
            @Ctx() ctx
        ) {
            return this.service.find({});
        }

        @Mutation(
            () => {
                return E;
            },
            {
                name: 'create' + E.name
            }
        )
        createOne(
            @Ctx() ctx,
            @Arg("input", () => {
                return CreateInput;
            }) input
        ) {
            return this.service.createOne(input);
        }
        @Mutation(
            () => {
                return E;
            },
            {
                name: 'update' + E.name
            }
        )
        updateOne(
            @Ctx() ctx,
            @Arg("input", () => {
                return UpdateInput;
            }) input
        ) {
            return this.service.updateOne(input);
        }
        @Mutation(
            () => {
                return DeleteResponse;
            },
            {
                name: 'delete' + E.name
            }
        )
        deleteOne(
            @Ctx() ctx,
            @Arg("id", () => {
                return ID;
            }) input
        ) {
            return this.service.deleteOne(input);
        }
   }
   return BaseResolverClass;
}