import jobAppModel from "../../models/jobApplication.model.js";
import { AppError } from "../../utils/errors.js";
import IJobApplicationRepository from "../contracts/IJobApplicationRepository.js";
import mongoose from "mongoose";
import { paginateAggregation } from "../../utils/pagination.util.js";

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
      {
        $unwind: {
          path: "$candidate",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job"
        }
      },
      {
        $unwind: {
          path: "$job",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $project: {
          status: 1,
          resumeUrl: 1,
          createdAt: 1,

          "candidate.firstName": 1,
          "candidate.lastName": 1,
          "candidate.email": 1,

          "job.title": 1,
          "job.description": 1,
          "job.location": 1
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

  async getAllApplications(page = 1, limit = 10) {
    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      {
        $unwind: {
          path: "$candidateDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

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
          "jobDetails.location": 1
        }
      }
    ];

    pipeline.push({ $sort: { createdAt: -1 } });

    return await paginateAggregation(jobAppModel, pipeline, { page, limit });
  }


  async filterApplications(status, page = 1, limit = 10) {
    const matchStage = {};
    if (status) matchStage.status = status;

    const pipeline = [
      { $match: matchStage },

      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails"
        }
      },
      {
        $unwind: {
          path: "$candidateDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // JOIN JOB DETAILS
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails"
        }
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

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
          "jobDetails.location": 1,
        }
      }
    ];

    // Add sorting before pagination
    pipeline.push({ $sort: { createdAt: -1 } });

    return await paginateAggregation(jobAppModel, pipeline, { page, limit });
  }

  async getCandidateAllApplications(candidateId, page = 1, limit = 10) {
    const pipeline = [
      {
        $match: {
          candidateId: new mongoose.Types.ObjectId(candidateId),
        },
      },
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      {
        $unwind: {
          path: "$job",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          status: 1,
          createdAt: 1,
          jobTitle: "$job.title",
          location: "$job.location",
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    return await paginateAggregation(jobAppModel, pipeline, { page, limit });
  }

 async getApplicantsByJobId(jobId) {
  try {
    const pipeline = [
      {
        $match: {
          jobId: new mongoose.Types.ObjectId(jobId),
        },
      },

      // JOIN CANDIDATE DETAILS
      {
        $lookup: {
          from: "users",
          localField: "candidateId",
          foreignField: "_id",
          as: "candidateDetails",
        },
      },
      {
        $unwind: {
          path: "$candidateDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // JOIN JOB DETAILS
      {
        $lookup: {
          from: "jobroles",
          localField: "jobId",
          foreignField: "_id",
          as: "jobDetails",
        },
      },
      {
        $unwind: {
          path: "$jobDetails",
          preserveNullAndEmptyArrays: true,
        },
      },

      // EXPERIENCE (optional but your UI uses it)
      {
        $lookup: {
          from: "experiences",
          localField: "candidateId",
          foreignField: "candidateId",
          as: "experienceList",
        },
      },

      {
        $addFields: {
          totalExperienceYears: {
            $round: [
              {
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
                                    new Date(),
                                    "$$exp.startDate",
                                  ],
                                },
                              ],
                            },
                            "$$exp.startDate",
                          ],
                        },
                        1000 * 60 * 60 * 24 * 365,
                      ],
                    },
                  },
                },
              },
              1,
            ],
          },
        },
      },

      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          status: 1,
          createdAt: 1,
          appliedAt: 1,
          totalExperienceYears: 1,

          "candidateDetails.firstName": 1,
          "candidateDetails.lastName": 1,
          "candidateDetails.email": 1,

          "jobDetails.title": 1,
          "jobDetails.requiredExperience": 1,
        },
      },

      { $sort: { createdAt: -1 } },
    ];

    const applicants = await jobAppModel.aggregate(pipeline);

    return {
      applicants,
    };
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to fetch applicants by job id", 500);
  }
}
}

export default MongoApplicationRespository;
