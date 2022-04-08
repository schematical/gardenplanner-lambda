import 'reflect-metadata';
import {Query, Resolver} from "type-graphql";
import {User} from "./User.entity";
import {Inject, Service} from "typedi";
import {AuthService} from "./Auth.service";
@Resolver(() => User)
@Service()
export class UserResolver {
    // dependency injection
    @Inject('AuthService')
    private authService: AuthService
    constructor(

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
        console.log('resolver.users', this.authService);
        return this.authService.test();
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