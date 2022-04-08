import 'reflect-metadata';
import {Query, Resolver} from "type-graphql";

import { Service} from "typedi";
import {AuthService} from "./Auth.service";
import {User} from "./User.entity";
@Resolver(() => User)
@Service()
export class UserResolver {
    // dependency injection

    constructor(
        // @Inject('AuthService')
        private authService: AuthService
    ) {
        console.log('constructor: ', this.authService);
    }


    @Query(() => {
        return [User];
    })
    users() {
        /*const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];*/

        return this.authService.find();
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