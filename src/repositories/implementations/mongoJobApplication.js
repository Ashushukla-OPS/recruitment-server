import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";
import mongoose, { mongo } from "mongoose";

class MongoApplicationRespository extends IJobApplicationRepository {


  async createJobApplication(jobAppData) {
    try {
      const jobApplication = new jobAppModel(jobAppData);
      const savedApplication = await jobApplication.save();
      return savedApplication;
    } catch (error) {
      console.error("Error creating job application:", error);
      throw new AppError(`Failed to create job application: ${error.message}`, 500, error);
    }
  }

  async findByUserAndJob(candidateId, jobId) {
    const result = await jobAppModel.aggregate([
      {
        $match: {
          candidateId: new mongoose.Types.ObjectId(candidateId),
          jobId: new mongoose.Types.ObjectId(jobId)
        }
      },

      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidate"
        }
      },
      { $unwind: "$candidate" },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      { $unwind: "$job" },

      {
        $project: {
          status: 1,
          resumeUrl: 1,
          createdAt: 1,

          "candidate.firstName": 1,
          "candidate.lastName": 1,
          "candidate.email": 1,

          "job.title": 1,
          "job.description": 1
        }
      }
    ]);

    return result[0] || null;
  }


  async updateApplicationStatus(candidateId, status) {
    try {
      const updated = await jobAppModel.findByIdAndUpdate(
        candidateId,
        { status },
        { new: true, runValidators: true }
      );

      if (!updated) throw new AppError("Application not found", 404);

      return updated;
    } catch (error) {
      throw new AppError("Failed to update application status", 500);
    }
  }

  async bulkUpdateApplicationStatus(applicationIds, status){
    try {
      if(!applicationIds || applicationIds.length === 0){
        throw new AppError("No Application IDs provided", 400)
      }
      const ObjectIds = applicationIds.map(id=>{
        if(!mongoose.Types.ObjectId.isValid(id)){
          throw new AppError(`Invalid application id: ${id}`, 400)
        }
        return new mongoose.Types.ObjectId(id);
      });
      const result = await jobAppModel.updateMany(
        {_id:{$in: ObjectIds}, status:{$ne: status}},
        {$set: {status}},
        {runValidators: true}
      );
      if(result.matchedCount===0){
        throw new AppError("No application found for given IDs", 404)
      }
      return {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    } catch (error) {
      console.error(error)
      if(error instanceof AppError) throw error;
      throw new AppError("Failed to bulk update application statuses", 500);
    }
  }

 
  async getAllApplications() {
    return await jobAppModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      { $unwind: "$candidateDetails" },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          coverletter: 1,
          status: 1,
          createdAt: 1,
          appliedAt: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1,
          "jobDetails.description": 1,
          "jobDetails.requiredExperience": 1
        }
      }
    ]);
  }


  async filterApplications(status) {
    const matchStage = {};
    if (status) matchStage.status = status;

    return await jobAppModel.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      { $unwind: "$candidateDetails" },

      // JOIN JOB DETAILS
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      // JOIN EXPERIENCE MODEL
      {
        $lookup: {
          from: "experiences",
          localField: "candidateId",
          foreignField: "candidateId",
          as: "experienceList"
        }
      },

      // CALCULATE TOTAL EXPERIENCE IN YEARS
      {
        $addFields: {
          totalExperienceYears: {
            $sum: {
              $map: {
                input: "$experienceList",
                as: "exp",
                in: {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $ifNull: [
                            "$$exp.endDate",
                            {
                              $cond: [
                                { $eq: ["$$exp.isCurrent", true] },
                                new Date(),          // IF CURRENTLY WORKING
                                "$$exp.startDate"    // fallback
                              ]
                            }
                          ]
                        },
                        "$$exp.startDate"
                      ]
                    },
                    1000 * 60 * 60 * 24 * 365
                  ]
                }
              }
            }
          }
        }
      },

      // ROUND EXPERIENCE
      {
        $addFields: {
          totalExperienceYears: { $round: ["$totalExperienceYears", 1] }
        }
      },

      // FINAL OUTPUT
      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          coverletter: 1,
          status: 1,
          createdAt: 1,
          appliedAt: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1,
          "jobDetails.description": 1,
          "jobDetails.requiredExperience": 1,

          totalExperienceYears: 1
        }
      }

    ]);
  }

  async getApplicantsByJobId(jobId) {
    return jobAppModel.aggregate([
      {
        $match: {
          jobId: new mongoose.Types.ObjectId(jobId)
        }
      },

      // JOIN USERS
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      { $unwind: "$candidateDetails" },

      // JOIN JOB DETAILS
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      { $unwind: "$jobDetails" },

      // JOIN EXPERIENCE MODEL
      {
        $lookup: {
          from: "experiences",
          localField: "candidateId",
          foreignField: "candidateId",
          as: "experienceList"
        }
      },

      // CALCULATE total experience in YEARS
      {
        $addFields: {
          totalExperienceYears: {
            $sum: {
              $map: {
                input: "$experienceList",
                as: "exp",
                in: {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $ifNull: [
                            "$$exp.endDate",
                            {
                              $cond: [
                                { $eq: ["$$exp.isCurrent", true] },
                                new Date(),         // currently working
                                "$$exp.startDate"   // fallback (never happens but safe)
                              ]
                            }
                          ]
                        },
                        "$$exp.startDate"
                      ]
                    },
                    1000 * 60 * 60 * 24 * 365
                  ]
                }
              }
            }
          }
        }
      },
      // ROUND EXPERIENCE TO 1 DECIMAL
      {
        $addFields: {
          totalExperienceYears: { $round: ["$totalExperienceYears", 1] }
        }
      },

      // FINAL OUTPUT
      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          coverletter: 1,
          status: 1,
          createdAt: 1,
          appliedAt: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1,
          "jobDetails.description": 1,
          "jobDetails.requiredExperience": 1,

          totalExperienceYears: 1
        }
      }
    ]);
  }
}

export default MongoApplicationRespository;
