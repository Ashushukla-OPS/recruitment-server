import ICandidateRepository from "../contracts/candidateRepository.js" 
import CandidateModel from "../../models/candidate.model.js"

class MongoCandidateRepository extends ICandidateRepository{
   async createCandidate(candidateData) {
    const candidate = await  CandidateModel.create(candidateData);
    return candidate;
  }
 async getCandidateByEmail(email){
   return await CandidateModel.findOne({email})
 }
 async getAllCandidates(){
    const candidates = await CandidateModel.find()
    return candidates
 }  
 async getCandidateById(id){
    const candidate = await CandidateModel.findById(id)
    return candidate
 }
 async updateCandidate(id,updateData){
    const candidate = await CandidateModel.findByIdAndUpdate(id,updateData,{new:true})
    return candidate
 }
 async deleteCandidate(id){
    const candidate = await CandidateModel.findByIdAndDelete(id)
    return candidate
 }  
}

export default MongoCandidateRepository