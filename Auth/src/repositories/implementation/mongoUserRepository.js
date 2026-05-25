import IUserRepository from "../contracts/IUserRepository.js";
import {User} from "../../models/user.model.js";

class mongoUserRepository extends IUserRepository{
    async createUser(userData){
        const user = new User(userData)
        const savedUser = await user.save()
        return savedUser
    }

    async updateUserById(id, userObjectData){
        return await User.findByIdAndUpdate(id, userObjectData, {new :true})
    }

    async findUserByIdOrEmail({id, email}){
        return await User.findById({
            $or:[
            {_id: id},{email:email}
        ]
        })
    }
    async getAllUser(){
        return await User.find().select("-password")
    }

    async deleteUserByIdOrEmail({id, email}){
        
       return await User.findOneAndDelete({
        $or:[
            {_id: id},{email:email}
        ]
       })

    }
}

export {mongoUserRepository}