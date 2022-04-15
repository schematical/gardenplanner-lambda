import 'reflect-metadata';
import {Mutation, Query, Resolver} from "type-graphql";

import {Inject, Service} from "typedi";
import {UserService} from "./User.service";
import {User, UserCreateInput, UserFilterInput, UserUpdateInput} from "./User.entity";
import {BaseResolver} from "../../../libs/Base.resolver";


@Resolver(() => User)
@Service()
export class UserResolver  extends BaseResolver(
    User,
    UserService,
    UserFilterInput,
    UserCreateInput,
    UserUpdateInput
){
    @Inject('UserService')
    private userService: UserService;
    // dependency injection

    constructor(

    ) {
      super();
    }



/*
    @Mutation()
    @Authorized(Roles.Admin) // auth guard
    removeRecipe(@Arg("id") id: string): boolean {
        return this.recipeService.removeById(id);
    }

    @FieldResolver()
    averageRating(@Root() recipe: Recipe) {
        return recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length;
    }*/
}