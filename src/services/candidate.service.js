import { AppError } from "../utils/errors.js";
import mongoose from "mongoose"


import  MongoCandidateRepository  from "../repositories/implementations/mongoCandidateRepository.js";
const candidateRepository = new MongoCandidateRepository()


    
   class candidateService {

  async createCandidate(candidateData) {

    
    if (!candidateData.email) {
      throw new AppError("Email is required");
    }

   const existingCandidate =
  await candidateRepository.getCandidateByEmail(candidateData.email);


    if (existingCandidate) {
      throw new AppError("Candidate already exists",409);
    }

    const existingPhone =
   await candidateRepository.getCandidateByPhone(candidateData.phone)

if(existingPhone){
   throw new AppError(
      "Phone already exists",
      409
   )
}

    return await candidateRepository.createCandidate(candidateData);
  }

    async getAllCandidates(query){
      const page =
      parseInt(query.page) || 1

   const limit =
      parseInt(query.limit) || 10

   const skip =
      (page - 1) * limit

        const result = await candidateRepository.getAllCandidates(skip,limit)
       return {

      page,

      limit,

      total: result.total,

      totalPages:
         Math.ceil(result.total / limit),

      candidates:
         result.candidates

   }

    }

    async getCandidateById(id){
    if (!mongoose.Types.ObjectId.isValid(id)) {
   throw new AppError(
      "Invalid candidate id",
      400
   )
}
        const candidate = await candidateRepository.getCandidateById(id)

        if(!candidate){
            throw new AppError(
         "Candidate not found",
         404
      )
        }

        return candidate
    }
    async updateCandidate(id,updateData){
   if (!mongoose.Types.ObjectId.isValid(id)) {
   throw new AppError(
      "Invalid candidate id",
      400
   )
}


   if(updateData.email){

      const existingEmail =
         await candidateRepository
            .getCandidateByEmail(updateData.email)

      if(
         existingEmail &&
         existingEmail._id.toString() !== id
      ){

         throw new AppError(
            "Email already exists",
            409
         )

      }

   }

   if(updateData.phone){

      const existingPhone =
         await candidateRepository
            .getCandidateByPhone(updateData.phone)

      if(
         existingPhone &&
         existingPhone._id.toString() !== id
      ){

         throw new AppError(
            "Phone already exists",
            409
         )

      }

   }

        const candidate = await candidateRepository.updateCandidate(id,updateData)
         if(!candidate){
      throw new AppError(
         "Candidate not found",
         404
      )
   }
        return candidate
    }
    async deleteCandidate(id){
      if (!mongoose.Types.ObjectId.isValid(id)) {
   throw new AppError(
      "Invalid candidate id",
      400
   )
}
        const candidate = await candidateRepository.deleteCandidate(id)
         if(!candidate){
      throw new AppError(
         "Candidate not found",
         404
      )
   }
        return candidate
    }
}

export default new candidateService