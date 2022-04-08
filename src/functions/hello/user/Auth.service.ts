import 'reflect-metadata';
import { Inject, Service} from "typedi";

@Service('AuthService')
export class AuthService {
    @Inject('UserModel')
    private userModel;
    constructor(

    ) {

    }
    find() {
        return this.userModel.find();
    }

    test() {
        return {
            "hello": "world"
        }
    }
}