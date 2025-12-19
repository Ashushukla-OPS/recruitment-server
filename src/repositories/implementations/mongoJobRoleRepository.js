import IJobRoleRepository from "../contracts/IJobRoleRepository.js";
import JobRole from "../../models/jobRole.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoJobRoleRepository extends IJobRoleRepository {
  async createJobRole(jobRoleData) {
    try {
      const jobRole = new JobRole(jobRoleData);
      return await jobRole.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to create job role", 500);
    }
  }

  async findJobRoleById(id , userId) {
    try {
      const result = await JobRole.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        }
      },

      {
        $addFields: {
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
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $project:{
            applications:0
         }
      },
        {
          $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: true }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: true }
        }
      ]);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new AppError("Failed to find job role", 500);
    }
  }

async findAllJobRoles(filter = {} , userId ) {
  try {
    const matchStage = {};

    if (filter.clientId) {
      matchStage.clientId = new mongoose.Types.ObjectId(filter.clientId);
    }

    if (filter.category) {
      matchStage.category = new mongoose.Types.ObjectId(filter.category);
    }

    if (filter.title) {
      matchStage.title = { $regex: filter.title, $options: "i" };
    }

    const now = new Date();
    if (filter.expiry === "active") {
      matchStage.$or = [
        { expiry: { $exists: false } }, 
        { expiry: { $gte: now } }  
      ];
    } else if (filter.expiry === "expired") {
      matchStage.expiry = { $lt: now };
    } else {
      matchStage.$or = [
        { expiry: { $exists: false } },
        { expiry: { $gte: now } }
      ];
    }

    const jobs = await JobRole.aggregate([
      { $match: matchStage },
      {
        $lookup: {
          from: "jobapplications",
          localField: "_id",
          foreignField: "jobId",
          as: "applications",
        }
      },

      {
        $addFields: {
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
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
          pipeline: [{ $project: { name: 1, email: 1 } }]
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "clientId",
          foreignField: "_id",
          as: "client",
          pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
        }
      },
      {
        $lookup: {
          from: "jobcategories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      {
        $lookup: {
          from: "skills",
          localField: "skills",
          foreignField: "_id",
          as: "skills"
        }
      },
      {
         $project:{
             applications:0
         }
      },
      { $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$client", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } }
    ]);
    return jobs;
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to fetch job roles", 500);
  }
}

  async updateJobRole(id, jobRoleData) {
    try {
      return await JobRole.findByIdAndUpdate(id, jobRoleData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to update job role", 500);
    }
  }

  async deleteJobRole(id) {
    try {
      return await JobRole.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete job role", 500);
    }
  }

  async findJobRolesByClient(clientId) {
    try {
      return await JobRole.aggregate([
        { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
        },
        { $sort: { createdAt: -1 } }
      ]);
    } catch (error) {
      throw new AppError("Failed to fetch client job roles", 500);
    }
  }

  async findJobRolesByCategory(categoryId) {
    try {
      return await JobRole.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: true }
        },
        { $sort: { createdAt: -1 } }
      ]);
    } catch (error) {
      throw new AppError("Failed to fetch category job roles", 500);
    }
  }
//  async findJobRolesBySearch(q, location) {
//   try {
//     const filter = {};

//     //  Title search
//     if (q) {
//       filter.title = { $regex: q, $options: "i" };
//     }

//     // Location search (city / state / country)
//     if (location) {
//       filter.$or = [
//         { "location.city": { $regex: location, $options: "i" } },
//         { "location.state": { $regex: location, $options: "i" } },
//         { "location.country": { $regex: location, $options: "i" } },
//       ];
//     }

//     const jobs = await JobRole.find(filter)
//       .populate("skills")
//       .populate("category")
//       .lean();

//     return jobs;
//   } catch (error) {
//     throw new AppError("Failed to fetch jobs.", 500);
//   }
// }

async findJobRolesBySearch(q, location) {
  try {
    const pipeline = [];

    const matchStage = {};

    // Title search
    if (q) {
      matchStage.title = { $regex: q, $options: "i" };
    }

    // Location search (city / state / country)
    if (location) {
      matchStage.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.state": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }

    // Apply match only if filters exist
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Populate skills
    pipeline.push({
      $lookup: {
        from: "skills", // collection name
        localField: "skills",
        foreignField: "_id",
        as: "skills",
      },
    });

    // Populate category
    pipeline.push({
      $lookup: {
        from: "categories", // collection name
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    });

    // Convert category array to object (optional but common)
    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true,
      },
    });

    const jobs = await JobRole.aggregate(pipeline);

    return jobs;
  } catch (error) {
    throw new AppError("Failed to fetch jobs.", 500);
  }
}


}

export default MongoJobRoleRepository;
