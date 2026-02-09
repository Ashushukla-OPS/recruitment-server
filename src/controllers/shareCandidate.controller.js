
import ShareCandidateService from '../services/shareCandidate.service.js';
class ShareCandidateController {
  constructor (){
    this.shareCandidateService = new ShareCandidateService()
  }

  createShareCandidate = async (req,res,next)=>{
    try {
     const { users, groupName } = req.body;

      const response = await this.shareCandidateService.createShareUsers({
        groupName,
        selectedUsers: users 
      })
       res.status(201).json({
      message: 'Group created & Link generated',
      shareLink:response.shareLink,  // Return the share link
       });
    } 
    catch (error) {
      next(error)
    }
  }

  // get all group memebers

  getAllGroups = async(req, res,next)=>{
    try{

      const groups = await this.shareCandidateService.getAllGroups();
      res.status(200).json({
        success: true,
        count: groups.length,
        data: groups
      })

    }
    catch(error){
      next(error)
    }
  }

  // update group

  updateGroup = async(req,res,next)=>{
    try{
      const {id} = req.params; //
      const updatedGroup = await this.shareCandidateService.updateGroup(id,req.body);

      res.status(200).json({
        success: true,
        message: 'Group updated successfully',
        data: updatedGroup

      })


    }
    catch(error){
      next(error)
    }
  }

  // delete groupp

  deleteGroup = async(req,res,next)=>{
    try{
      const {id} = req.params;
      await this.shareCandidateService.deleteGroup(id);
      res.status(200).json({
        success: true,
        message: 'Group deleted successfully',
        
      })

    }
    catch(error){
      next(error)
    }
  }

  // delete user from group

  removeUserFromGroup = async(req, res, next)=>{
    try{
      const {groupId, userId} = req.params;

      const updatedGroup = await this.shareCandidateService.removeUserFromGroup(groupId, userId);

      res.status(200).json({
        success: true,
        message: "user removed from group successfully",
        data: updatedGroup
      })


    }
    catch(error){
      next(error);
    }
  }

  shareShareCandidate = async (req,res,next)=>{
    try {
      const { shareId } = req.params;

        const response = await this.shareCandidateService.shareShareUser(shareId)
       return res.status(200).json({
       message: 'Shared candidates fetched successfully',
       count: response.count,
       data: response.data,
    });
      
    } catch (error) {
      next(error)
    }
  }
}

export default ShareCandidateController