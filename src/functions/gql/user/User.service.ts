import 'reflect-metadata';
import { Inject, Service} from "typedi";
import {User} from "./User.entity";
import {BaseService} from "../../../libs/Base.service";

@Service('UserService')
export class UserService extends BaseService(User){
    @Inject('UserModel')
    private userModel
    constructor(
    ) {
        super();
    }

}