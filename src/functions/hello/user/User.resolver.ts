import {Query, Resolver} from "type-graphql";
import { User } from "./User.entity";
import {Inject} from "typedi";
@Resolver(User)
export class UserResolver {
    // dependency injection
    constructor(
        @Inject('UserModel')
        private readonly userModel
    ) {}
    @Query(() => {
        return [User];
    })

    users() {
        const user = new User();
        user.firstName = "Hell0";
        user.lastName = "World";
        return [
            user
        ];
        // return this.userModel.find();
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