import { AppError } from "../../utils/errors.js"

class ICandidateRepository{
    async createCandidate(candidateData){
        throw new AppError("Method not implemented")
    }

    async updateCandidate(id,updateData){
        throw new AppError("Method not implemented")
    }

    async deleteCandidate(id){
        throw new AppError("Method not implemented")
    }

        async getAllCandidates(skip,limit){
            throw new Error("Method not implemented")
        }

    async getCandidateById(id){
        throw new Error("Method not implemented")
    }     
    async getCandidateByEmail(email){
        throw new Error("Method not implemented")
    }    
    async getCandidateByPhone(phone) {
   throw new Error("Method not implemented")
}   
}

export default ICandidateRepository