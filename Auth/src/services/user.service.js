import {mongoUserRepository} from '../repositories/implementation/mongoUserRepository.js'
import { ApiError } from '../utils/ApiError.js'
import jwt from 'jsonwebtoken'
import config  from '../config/environment.js'
const {REFRESH_SECRET, REFRESH_EXPIRES_IN, JWT_SECRET, JWT_EXPIRES_IN, EMAIL_USER, EMAIL_PASSWORD}=config

class userService{
    constructor(){
        this.userRepository = new mongoUserRepository(); 
    }

    async userRegister(userDatas){
        const {firstName, lastName, username, email, password,}=userDatas;
        const isAnyFieldEmpty = Object.values(userDatas).some((values)=>!values || values.toString().trim() === "")
        if(isAnyFieldEmpty) new ApiError(400, "All field required");

        const isExistedUser = await this.userRepository.findUserByIdOrEmail(email);
        if (isExistedUser) {
        throw new ApiError(400, "User already exists!");
        }
        const savedUser = await this.userRepository.createUser(userDatas);
        return savedUser;
    }
    async updateUserById(id, userObjectData){
        if(!id && !userObjectData) new ApiError(401, "Both data are required");
            const userData = await this.userRepository.updateUserById(id, userObjectData);
            return userData;
    }

    async getAllUser(){
        const usersGetAll = await this.userRepository.getAllUser();
        if(!usersGetAll) new ApiError(404, "Not found users data.");
        return usersGetAll;
    }

    async deleteUserByIdOrEmail(id, email){
        const find = await this.userRepository.findUserByIdOrEmail(id, email)
        if(!find) new ApiError(404, "This userId doesn't exist database.")
        const userData = await this.userRepository.deleteUserByIdOrEmail(id,email)
        return userData
    }
}
export {userService}