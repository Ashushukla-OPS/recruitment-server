import ICandidateRepository from "../contracts/IcandidateRepository.js" 
import CandidateModel from "../../models/candidate.model.js"

class MongoCandidateRepository extends ICandidateRepository{
   async createCandidate(candidateData) {
    const candidate = await  CandidateModel.create(candidateData);
    return candidate;
  }
 async getCandidateByEmail(email){
   return await CandidateModel.findOne({email}).lean()
 }
 async getAllCandidates(skip,limit){
    const candidates = await CandidateModel.find().skip(skip).limit(limit).lean()
    const total = await CandidateModel.countDocuments()
    return {candidates,total}
 }  
 async getCandidateById(id){
    const candidate = await CandidateModel.findById(id).lean()
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
 async getCandidateByPhone(phone) {
   return await CandidateModel.findOne({ phone }).lean()
}
}

export default MongoCandidateRepository