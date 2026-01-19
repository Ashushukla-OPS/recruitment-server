import mongoose from 'mongoose';
import ShareCandidate from '../models/shareCandidate.model.js';
import { CandidateProfile } from '../models/candidateProfile.model.js';

export const createShare = async (req, res) => {
  try {
    const { users } = req.body;
    console.log(`backdend conroller users data from body ${users}`);

    const share = await ShareCandidate.create({
      selectedUsers: users,
    });

    const shareLink = `http://localhost:9000/api/share/${share._id}`;

    res.status(201).json({
      message: 'Share link created',
      shareLink,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSharedCandidates = async (req, res) => {
  try {
    const { shareId } = req.params;

    const share = await ShareCandidate.findById(shareId);

    if (!share) {
      return res.status(404).json({ message: 'Invalid or expired link' });
    }

    const profiles = await CandidateProfile.aggregate([
      {
        $match: {
          userId: {
            $in: share.selectedUsers.map(id => new mongoose.Types.ObjectId(id)),
          },
        },
      },

      // Populate user
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },

      // Populate skills
      {
        $lookup: {
          from: 'skills',
          localField: 'skills',
          foreignField: '_id',
          as: 'skillDocs',
        },
      },

      // Populate experiences
      {
        $lookup: {
          from: 'experiences',
          localField: '_id',
          foreignField: 'candidateId',
          as: 'experiences',
        },
      },

      // Sort experiences
      {
        $addFields: {
          experiences: {
            $sortArray: {
              input: '$experiences',
              sortBy: { isCurrent: -1, startDate: -1 },
            },
          },
        },
      },

      // Final shape
      {
        $project: {
          _id: 1,
          userId: 1,
          availability: 1,
          linkedinUrl: 1,
          githubUrl: 1,
          portfolioUrl: 1,
          highestEducation: 1,
          resumeFile: 1,
          resumeScore: 1,
          createdAt: 1,
          updatedAt: 1,

          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            email: '$user.email',
          },

          skills: {
            $map: {
              input: '$skillDocs',
              as: 'skill',
              in: {
                _id: '$$skill._id',
                name: '$$skill.name',
              },
            },
          },

          experiences: {
            $map: {
              input: '$experiences',
              as: 'exp',
              in: {
                _id: '$$exp._id',
                company: '$$exp.company',
                title: '$$exp.title',
                location: '$$exp.location',
                description: '$$exp.description',
                startDate: '$$exp.startDate',
                endDate: '$$exp.endDate',
                isCurrent: '$$exp.isCurrent',
              },
            },
          },
        },
      },
    ]);

    // 3. Send response
    return res.status(200).json({
      message: 'Shared candidates fetched successfully',
      count: profiles.length,
      data: profiles,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
