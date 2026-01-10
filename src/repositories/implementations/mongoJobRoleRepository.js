import IJobRoleRepository from "../contracts/IJobRoleRepository.js";
import JobRole from "../../models/jobRole.model.js";
import { AppError } from "../../utils/errors.js";
import { paginateAggregation } from "../../utils/pagination.util.js";
import mongoose from "mongoose";

class MongoJobRoleRepository extends IJobRoleRepository {


 buildJobRolePipeline({
    match = {},
    userId = null,
    includeQuestions = false,
    includeApplicantsCount = false,
    sort = { createdAt: -1 }
  } = {}) {

    return [
      { $match: match },

      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications"
        }
      },

      {
        $addFields: {
          ...(includeApplicantsCount && {
            applicantsCount: { $size: "$applications" }
          }),

          applied: {
            $cond: {
              if: userId
                ? {
                    $in: [
                      new mongoose.Types.ObjectId(userId),
                      "$applications.candidateId"
                    ]
                  }
                : false,
              then: true,
              else: false
            }
          }
        }
      },

      { $project: { applications: 0 } },

      // Created By
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },

      // Client
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
          pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
        }
      },

      // Category
      {
        $lookup: {
          from: "jobcategories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },

      // Skills
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills"
        }
      },

      // --- UPDATED QUESTIONS LOGIC ---
      ...(includeQuestions
        ? [
            {
              $lookup: {
                from: "jobapplicationquestions", // Check your collection name (usually plural)
                localField: "_id",
                foreignField: "jobId",
                as: "questionDoc"
              }
            },
            {
              $addFields: {
                // Extracts the 'questions' array from the first matching document
                questions: { 
                  $ifNull: [{ $arrayElemAt: ["$questionDoc.questions", 0] }, []] 
                }
              }
            },
            { $project: { questionDoc: 0 } } // Clean up the temporary field
          ]
        : []),
      // -------------------------------

      { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

      { $sort: sort }
    ];
  }


  async createJobRole(data) {
    try {
      return await JobRole.create(data);
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to create job role", 500);
    }
  }

  async findJobRoleById(id, userId) {
    try {
      const pipeline = this.buildJobRolePipeline({
        match: { _id: new mongoose.Types.ObjectId(id) },
        userId,
        includeQuestions: true
      });

      const result = await JobRole.aggregate(pipeline);
      return result[0] || null;
    } catch {
      throw new AppError("Failed to find job role", 500);
    }
  }

  async findAllJobRoles(filter = {}, userId, page = 1, limit = 10) {
    try {
      const match = {};

      if (filter.clientId)
        match.clientId = new mongoose.Types.ObjectId(filter.clientId);

      if (filter.category)
        match.category = new mongoose.Types.ObjectId(filter.category);

      if (filter.title)
        match.title = { $regex: filter.title, $options: "i" };

      const now = new Date();
      match.$or = [
        { expiry: { $exists: false } },
        { expiry: { $gte: now } }
      ];

      const pipeline = this.buildJobRolePipeline({
        match,
        userId,
        includeApplicantsCount: true
      });

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch {
      throw new AppError("Failed to fetch job roles", 500);
    }
  }

  async findJobRolesByCategory(categoryId, page, limit, userId) {
    try {
      const pipeline = this.buildJobRolePipeline({
        match: { category: new mongoose.Types.ObjectId(categoryId) },
        userId
      });

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch {
      throw new AppError("Failed to fetch category job roles", 500);
    }
  }

  async findJobRolesBySearch(q, location, page, limit, userId) {
    try {
      const match = {};

      if (q)
        match.title = { $regex: q, $options: "i" };

      if (location) {
        match.$or = [
          { "location.city": { $regex: location, $options: "i" } },
          { "location.state": { $regex: location, $options: "i" } },
          { "location.country": { $regex: location, $options: "i" } }
        ];
      }

      const pipeline = this.buildJobRolePipeline({
        match,
        userId
      });

      return await paginateAggregation(JobRole, pipeline, { page, limit });
    } catch {
      throw new AppError("Failed to fetch jobs", 500);
    }
  }

}

export default MongoJobRoleRepository;
