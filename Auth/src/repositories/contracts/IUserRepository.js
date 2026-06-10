import {ApiError} from '../../utils/ApiError.js'

class IUserRepository{
   async createUser(userData){
        new ApiError(501, "Method not implimented")
   }
   async updateUser(id, userData){
         new ApiError(501, "Method not implimented")
   }
   async getUserById(id){
        new ApiError(501, "Method not implimented")
   }
   async getUserByEmail(email){
        new ApiError(501, "Method not implimented")
   }
   async deleteUser(id, email){
     new ApiError(501, "Method not implimented")
   }
}

export default IUserRepository