import 'reflect-metadata';
import { Inject, Service} from "typedi";
import {User} from "./User.entity";

@Service()
export class AuthService {

    constructor(
        @Inject('UserModel')
        private userModel
    ) {

    }
    async find() {
        const response = await this.userModel.find();
        console.log("RESPONSE: ", response);
        return response;
    }

    test() {
        return {
            "hello": "world"
        }
    }

    async create() {
        const user = new User();
        user.lastName = 'Shabado';
        user.firstName = 'Joey';
        const response = await this.userModel.create(user);
        console.log("RESPONSE: ", response);
        return response;
    }
}