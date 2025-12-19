import MongoscheduleInterviewRepository  from "../repositories/implementations/mongoscheduleInterviewRepository.js";
import { AppError } from "../utils/errors.js";

class ScheduleInterviewService {
  constructor() {
    this.scheduleInterviewRepository = new MongoscheduleInterviewRepository() ;
  }
    async createInterview(data) {
        return await this.scheduleInterviewRepository.createInterview(data);
    }
    async getMyInterviews(candidateId){
        return await this.scheduleInterviewRepository.getMyInterview(candidateId)
    }
    async getAllInterviews(){
        return await this.scheduleInterviewRepository.getAllInterviews()
    }

    async getInterviewById(id){
         console.log("SERVICE HIT - Interview ID:", id);
       const interview = await this.scheduleInterviewRepository.getInterviewById(id);
       console.log("Interview found:", interview);
       if(!interview){
        throw new AppError('Interview not found', 404)
       }
       return interview
    }
    async getInterviewsByJobId(jobId){
      const interview = await this.scheduleInterviewRepository.getInterviewsByJobId(jobId); 
    if(!interview){
        throw new AppError('Interview not found', 404)
    }
    return interview;
}


    async updateInterviewStatus(id, status){
        const updated = await this.scheduleInterviewRepository.updateInterviewStatus(id, status);
        if(!updated){
            throw new AppError('Interview not found', 404)
        }
        return updated;
    }
    async deleteInterview(id){
        const deleted = await this.scheduleInterviewRepository.deleteInterview(id);
       
    }
  }

  export default ScheduleInterviewService;

