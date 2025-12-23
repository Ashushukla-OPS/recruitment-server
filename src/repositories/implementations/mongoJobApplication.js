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
          status: 1,
          createdAt: 1,

          "candidateDetails.firstName": 1,
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

 async getCandidateAllApplications(candidateId) {
  return await jobAppModel.aggregate([
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
      $lookup: {
        from: "skills",
        localField: "job.skills",
        foreignField: "_id",
        as: "job.skills",
      },
    },
    {
      $lookup: {
        from: "jobcategories",
        localField: "job.category",
        foreignField: "_id",
        as: "job.category",
      },
    },
    {
      $unwind: {
        path: "$job.category",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        // :key: APPLICATION INFO
        _id: 1,
        jobId: "$job._id",        // :white_check_mark: MAIN FIX (DO NOT REMOVE)
        status: 1,
        createdAt: 1,
        // :key: BASIC JOB INFO
        jobTitle: "$job.title",
        location: "$job.location",
        // :key: EXTRA DETAILS
        category: "$job.category.name",
        experience: "$job.requiredExperience",
        education: "$job.education",
        description: "$job.description",
        expiry: {
          $dateToString: {
            format: "%d/%m/%Y",
            date: "$job.expiry",
          },
        },
        // :key: SKILLS ARRAY
        skills: {
          $map: {
            input: "$job.skills",
            as: "skill",
            in: "$$skill.name",
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
}
}

export default MongoApplicationRespository;
