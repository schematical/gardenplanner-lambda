import 'reflect-metadata';
import { Inject, Service} from "typedi";

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
}
console.log("AuthService", AuthService);