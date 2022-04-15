import {BaseEntity} from "./Base.entity";
import {BaseService, DeleteResponse, iBaseService} from "./Base.service";
import {Inject, Service} from "typedi";
import {Arg, Ctx, ID, Mutation, Query, Resolver} from "type-graphql";
import {Type} from "./util";
import {FilterQuery} from "mongoose";
import DataLoader from "dataloader";
import {CropSpecies} from "@functions/gql/crop-species/CropSpecies.entity";
import _ from "lodash";

export interface iBaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>> {
    list(
        ctx: any,
        input: Type<FilterQuery<EntityT>>
    );
    createOne(
        ctx: any,
        input: Type<Partial<EntityT>>
    ): Promise<EntityT>
    updateOne(
        ctx: any,
        input: Type<Partial<EntityT>>
    ): Promise<EntityT>
    deleteOne(
        ctx: any,
        input: string
    ): Promise<DeleteResponse>
    initManyToManyDataLoader(ctx, dataLoaderNamespace?: string);
}

export function BaseResolver<EntityT extends BaseEntity, ServiceT extends iBaseService<EntityT>>(
    E: Type<EntityT>,
    S: Type<ServiceT>,
    FilterInput: Type<FilterQuery<EntityT>>,
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
            @Ctx() ctx,
            @Arg("input", () => {
                return FilterInput;
            }, { nullable: true}) input
        ) {
            return this.service.find(input);
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


        /*
        HELPERS
         */
        initManyToManyDataLoader(ctx, dataLoaderNamespace?: string) {
            dataLoaderNamespace = dataLoaderNamespace || E.name + ':ManyToManyDataLoader';
            ctx.dataLoaders = ctx.dataLoaders || [];
            ctx.dataLoaders[dataLoaderNamespace] = ctx.dataLoaders[dataLoaderNamespace] || new DataLoader(async (ids) => {
                const flatIds = _.flatten(ids);

                const entities = await this.service.find({
                    _id: {
                        $in: flatIds
                    }
                });

                return ids.map((ids:any) => {
                    return ids.map((id) => {
                        const foundEntity = entities.find((c: CropSpecies) => {
                            return id.equals(c._id);
                        });
                        if (!foundEntity) {
                            throw new Error("Could not find a species for: " + id);
                        }
                        return foundEntity;
                    });

                });
            });
            return ctx.dataLoaders[dataLoaderNamespace];
        }
   }
   return BaseResolverClass;
}