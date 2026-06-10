import candidateService from "../services/candidate.service.js";

class candidateController {
    async createCandidate(req,res ){
        try{
       
        const candidate = await candidateService.createCandidate(req.body)
        res.status(201).json({
            success:true,
            message:"Candidate created successfully",
            data:candidate
        })
        }
        catch(error){
            console.error("Error in createCandidate:",error);
            res.status(400).json({
                success:false,
                message:error.message,
                data:null
            })
        }
    }
    async getAllCandidates(req,res) {
        try{
            const candidates = await candidateService.getAllCandidates()
            res.status(200).json({
                success:true,
                message:"Candidates fetched successfully",
                data:candidates
            })
        }
        catch(error){
            console.error("Error in getAllCandidates:",error);
            res.status(400).json({
                success:false,
                message:error.message,
                data:null
            })
        }
    }
    async getCandidateById(req,res){
        try {
           const candidate = await candidateService.getCandidateById(req.params.id)  
           res.status(200).json({
            success:true,
            message:"Candidate fetched successfully",
            data:candidate
           })
        } catch (error) {
            console.error("Error in getCandidateById:",error);
            res.status(400).json({
                success:false,
                message:error.message,
                data:null
            })
        }
    }
    async updateCandidate(req,res){
        try {
            const candidate = await candidateService.updateCandidate(req.params.id,req.body)  
            res.status(200).json({
                success:true,
                message:"Candidate updated successfully",
                data:candidate
            })
            
        } catch (error) {
            console.error("Error in updateCandidate:",error);  
            res.status(400).json({
                success:false,
                message:error.message,
                data:null
            })
        }
    }
    async deleteCandidate(req,res){
        try {
            const candidate = await candidateService.deleteCandidate(req.params.id)
            res.status(200).json({
                success:true,
                message:"Candidate deleted successfully",
                data:candidate
            })  
        } catch (error) {
            console.error("Error in deleteCandidate:",error);  
            res.status(400).json({
                success:false,
                message:error.message,
                data:null
            })
        }
    }       

    
}
export default new candidateController