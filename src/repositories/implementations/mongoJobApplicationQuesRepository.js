import jobApplicationModel from "../../models/jobApplication.model.js";
import JobApplicationQuestions from "../../models/JobApplicationQuestions.js";
import jobRoleModel from "../../models/jobRole.model.js";
import { AppError } from "../../utils/errors.js";
import { IJobApplicationQuestion } from "../contracts/IJobApplicationQuestion.js";

class mongoJobApplicationQuesRepository extends IJobApplicationQuestion {
  
  async createApplicationQuestion(jobId, questions) {
    try {
      const formattedQuestions = questions.map((q, index) => ({
        ...q,
        jobId,
        order: q.order ?? index + 1,
      }));

      const createdQuestions = await JobApplicationQuestions.insertMany(
        formattedQuestions,
        { ordered: true }
      );


      return createdQuestions;
    } catch (error) {
      throw new AppError("Error in Creating job application Question", 500);
    }
  }

  async getApplicationQuestion(jobId) {
    try {
      let questions = await JobApplicationQuestions.find({ jobId }).sort({
        order: 1,
      });
      return questions;
    } catch (error) {
      throw new AppError("Error in fetching job application Question", 500);
    }
  }

  async updateApplicationQuestion(jobId, questionId, data) {
    try {
      const questionExists = await JobApplicationQuestions.findById(questionId);
      if (questionExists) {
        //Update Question
        const updated = await JobApplicationQuestions.findOneAndUpdate(
          { _id: questionId, jobId },
          data,
          { new: true, runValidators: true }
        );

        if (!updated) {
          throw new AppError("Question not found", 404);
        }
        console.log("upper");
        return updated;
      } else {

        // Add new Question
        const lastQuestion = await JobApplicationQuestions.findOne({ jobId })
          .sort({ order: -1 })
          .select("order");

        const nextOrder = lastQuestion ? lastQuestion.order + 1 : 1;

        const newQuestion = await JobApplicationQuestions.create({
          jobId,
          ...data,
          order: nextOrder,
        });
        console.log("lower");
        

        return newQuestion;

      }
    } catch (error) {
      throw new AppError("Error in updating question", 500);
    }
  }
}

export default mongoJobApplicationQuesRepository;
