import { AppError } from "../utils/errors.js";
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
      throw new AppError("Candidate already exists");
    }

    return await candidateRepository.createCandidate(candidateData);
  }

    async getAllCandidates(){

        const candidates = await candidateRepository.getAllCandidates()
        return candidates
    }
    async getCandidateById(id){
        const candidate = await candidateRepository.getCandidateById(id)
        return candidate
    }
    async updateCandidate(id,updateData){

        const candidate = await candidateRepository.updateCandidate(id,updateData)
        return candidate
    }
    async deleteCandidate(id){
        const candidate = await candidateRepository.deleteCandidate(id)
        return candidate
    }
}

export default new candidateService