import 'reflect-metadata';
import {Arg, Ctx, Mutation, Query, Resolver} from "type-graphql";

import {Inject, Service} from "typedi";
import {UserService} from "./User.service";
import {User, UserCreateInput, UserFilterInput, UserSignupPartialInput, UserUpdateInput} from "./User.entity";
import {BaseResolver} from "../../../libs/Base.resolver";
import {CropSpecies, CropSpeciesFilterInput} from "@functions/gql/crop-species/CropSpecies.entity";


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
    @Mutation(() => {
        return Boolean;
    })
    signUpPartial(
        @Ctx() ctx,
        @Arg(
            "input",
            () => {
                return UserSignupPartialInput;
            },
            { nullable: false }
        )
        input
    ) {
        return this.userService.signUpPartial(input);
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