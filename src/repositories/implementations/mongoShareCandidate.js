import { CandidateProfile } from "../../models/candidateProfile.model.js";
import shareCandidateModel from "../../models/shareCandidate.model.js";
import IshareCandidate from "../contracts/IShareCandidate.js";
import mongoose from 'mongoose';
import {AppError} from "../../utils/errors.js";
import MongoCandidateProfileRepository from "./mongoCandidateProfileRepository.js";


class MongoShareCandidate extends IshareCandidate {

  // create group and generate share linkk
  async createCandidate(users) {
     // MongoCandidateProfileRepository._getProfileAggregationPipeline(users.selectedUsers[0])

   try {
     const share = await shareCandidateModel.create({  //
      groupName: users.groupName,
      selectedUsers: users.selectedUsers, // Assuming this is an array of user IDs
    });

    const shareLink = `hire.sheriyans.com/api/share/${share._id}`; // Construct the shareable link using the share ID
    return {
      shareLink, // You can also return the share ID if needed
      group: share  // Return the created share document


   } 
  } 
  catch (error) {
    throw new AppError(
        `Failed to  create group: ${error.message}`,
        500,
        error
      );
   }
  }

  // get single group
  async getSingleGroup(id) {
    try {
      const group = await shareCandidateModel.findById(id)
        .populate('selectedUsers', 'firstName lastName email role');
      return group;
    } catch (error) {
      throw new AppError(
        `Failed to fetch single group: ${error.message}`,
        500,
        error
      );
    }
  }

  

  // Get all groups with member count
  async getAllGroups() {
    try {
      const groups = await shareCandidateModel.aggregate([
        {
          $project: {
            _id: 1,
            groupName: 1,
            createdAt: 1,
            updatedAt: 1,
            // 👇 THIS IS THE NEW PART
            // It calculates the size of the 'selectedUsers' array instantly
            memberCount: { $size: { $ifNull: ["$selectedUsers", []] } } 
          }
        },
        { 
          $sort: { createdAt: -1 } // Sort by newest first
        }
      ]);

      return groups;

    } catch (error) {
      throw new AppError(
        `Failed to fetch groups: ${error.message}`,
        500,
        error
      );
    }
  }

  // update group

  async updateGroup(id , users){
    try{
      const updatedGroup = await shareCandidateModel.findByIdAndUpdate(id, users,{new:true})
      .populate('selectedUsers', 'firstName lastName email ');

      if(!updatedGroup) throw new AppError('Group not found', 404);
      return updatedGroup;


    }
    catch(error){
      throw new AppError(
        `Failed to update group: ${error.message}`,
        500,
        error
      );
    }
  }


  // delete group

  async deleteGroup(id){
    try{

      const deleteGroup = await  shareCandidateModel.findByIdAndDelete(id);
      if(!deleteGroup) throw new AppError('Group not found', 404);

      return deleteGroup;
      
    }
    catch(error){
      throw new AppError(
        `Failed to delete group: ${error.message}`,
        500,
        error
      );
    }
  }


  // delete user from group
   async removeUserFromGroup(groupId, userId) {
        try {
            const updatedGroup = await shareCandidateModel.findByIdAndUpdate(
                groupId,
                { 
                    $pull: { selectedUsers: userId }  // Removes ONLY this userId from the array
                },
                { new: true } // Return the updated group so we can see the change
            ).populate('selectedUsers', 'firstName lastName email role');

            if (!updatedGroup) {
                throw new AppError('Group not found', 404);
            }

            return updatedGroup;
        } catch (error) {
            throw new AppError(`Failed to remove user: ${error.message}`, 500);
        }
    }

    // add user to existing group

    async addUserToGroup(groupId, userId) {
        try {
            const updatedGroup = await shareCandidateModel.findByIdAndUpdate(
                groupId,
                { 
                    $addToSet: { selectedUsers: userId } //  Key Logic: Adds only if not already there
                },
                { new: true }
            ).populate('selectedUsers', 'firstName lastName email role');

            if (!updatedGroup) {
                throw new AppError('Group not found', 404);
            }

            return updatedGroup;
        } catch (error) {
            throw new AppError(`Failed to add user: ${error.message}`, 500);
        }
    }

  async shareCandidate(shareId) {
    try {


      const share = await shareCandidateModel.findById(shareId)
      .populate('selectedUsers', 'firstName lastName email role phoneNumber address'); // Populate the selectedUsers with their details

      if (!share) {
         throw new AppError('Invalid or expired link', 404);

      }

        
      
      const candidateRepo = new MongoCandidateProfileRepository();


const profilesPromises = share.selectedUsers.map(async (user) => {  
    // 1. Get the pipeline for this specific user

    const pipeline = candidateRepo._getProfileAggregationPipeline(user._id);
    
    // 2. Run the pipeline
    const result = await CandidateProfile.aggregate(pipeline);
    
    // 3. Return the user object (it's inside an array, so we return index 0)
    if(result && result.length >0){
    
    return result[0]; }

    return{
      userId: user._id,
      user:{
        id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      

    },

   
   socialLinks: { linkedin: "", github: "", portfolio: "", twitter: "" },
    resumeFile: null ,// or you can set it to a default value if needed
    experiences: [],
    skills:[],
    contactInfo: { phone: user.phoneNumber || "", address: user.address || "" }
  };
});

// Wait for all the profiles to finish fetching!
// Then filter out any 'null' or 'undefined' results just in case.
const profiles = (await Promise.all(profilesPromises)).filter(Boolean);

      const finalData = profiles.length > 0 ? profiles : share.selectedUsers;
      // 3. Send response
    
      return ({ 
            groupName: share.groupName,
            count: share.selectedUsers.length,
            data: finalData
        }) 
      
      
      // Return count and data in the response because the frontend needs both to display the data and show the count of shared candidates.
    } catch (error) {
      console.error(error);
      throw new AppError(  `Failed to update test attempt: ${error.message}`,   500,  error );
    }
  }
}


export default MongoShareCandidate