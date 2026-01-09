export class IJobApplicationQuestion{
    async createApplicationQuestion(jobId,data){
        throw new Error("Method createQuestion must be implemented");
    }
    async getApplicationQuestion(jobId){
        throw new Error("Method getApplication must be implemented");
    }
    async updateApplicationQuestion(jobid,questionId,data){
        throw new Error("Method updateApplicationQuestion must be implemented");
        
    }
    async updateApplicationAnswers(ApplicationId,data,CandidateaId){
        throw new Error("Method updateApplicationAnswers must be implemented");

    }

}