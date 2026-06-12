import candidateService from "../services/candidate.service.js";

class candidateController {
    async createCandidate(req,res ){
        
       
        const candidate = await candidateService.createCandidate(req.body)

        res.status(201).json({
            success:true,
            message:"Candidate created successfully",
            data:candidate
        })  
    }
    async getAllCandidates(req,res) {
      
            const candidates = await candidateService.getAllCandidates(req.query)
            res.status(200).json({
                success:true,
                message:"Candidates fetched successfully",
                data:candidates
            })
      
        
    }
    async getCandidateById(req,res){
        
           const candidate = await candidateService.getCandidateById(req.params.id)  
           res.status(200).json({
            success:true,
            message:"Candidate fetched successfully",
            data:candidate
           })
        
    }
    async updateCandidate(req,res){
       
            const candidate = await candidateService.updateCandidate(req.params.id,req.body)  
            res.status(200).json({
                success:true,
                message:"Candidate updated successfully",
                data:candidate
            })
            
        
    }
    async deleteCandidate(req,res){
      
            const candidate = await candidateService.deleteCandidate(req.params.id)
            res.status(200).json({
                success:true,
                message:"Candidate deleted successfully",
                data:candidate
            })  
       
    }       

    
}
export default new candidateController()