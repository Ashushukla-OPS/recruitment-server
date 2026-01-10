import JobApplicationQuestions from "../../models/JobApplicationQuestions.js";
import { AppError } from "../../utils/errors.js";
import { IJobApplicationQuestion } from "../contracts/IJobApplicationQuestion.js";

class mongoJobApplicationQuesRepository extends IJobApplicationQuestion {
  
  // Creates or Overwrites the entire list of questions for a job
  async createApplicationQuestion(jobId, questions) {
    try {
      const formattedQuestions = questions.map((q, index) => ({
        ...q,
        order: q.order ?? index + 1,
      }));

      // Find the document for this jobId and update it, or create if it doesn't exist (upsert)
      const result = await JobApplicationQuestions.findOneAndUpdate(
        { jobId },
        { $set: { questions: formattedQuestions } },
        { new: true, upsert: true, runValidators: true }
      );

      return result.questions;
    } catch (error) {
      console.error(error);
      throw new AppError("Error in Creating job application Questions", 500);
    }
  }

  async getApplicationQuestion(jobId) {
    try {
      const doc = await JobApplicationQuestions.findOne({ jobId });
      if (!doc) return [];
      
      // Sort the sub-documents by order manually or via logic
      return doc.questions.sort((a, b) => a.order - b.order);
    } catch (error) {
      throw new AppError("Error in fetching job application Question", 500);
    }
  }

  async updateApplicationQuestion(jobId, questionId, data) {
    try {
      // 1. Try to update an existing question within the array
      const updatedDoc = await JobApplicationQuestions.findOneAndUpdate(
        { jobId, "questions._id": questionId },
        { 
          $set: { "questions.$": { ...data, _id: questionId } } 
        },
        { new: true, runValidators: true }
      );

      if (updatedDoc) {
        // Return only the specific updated question
        return updatedDoc.questions.id(questionId);
      }

      // 2. If questionId wasn't found in the array, treat it as "Add New"
      const parentDoc = await JobApplicationQuestions.findOne({ jobId });
      
      if (!parentDoc) {
        throw new AppError("Job Questions document not found", 404);
      }

      const nextOrder = parentDoc.questions.length > 0 
        ? Math.max(...parentDoc.questions.map(q => q.order)) + 1 
        : 1;

      const newQuestion = { ...data, order: nextOrder };
      
      parentDoc.questions.push(newQuestion);
      await parentDoc.save();

      return parentDoc.questions[parentDoc.questions.length - 1];

    } catch (error) {
      console.error(error);
      throw new AppError(error.message || "Error in updating question", 500);
    }
  }
}

export default mongoJobApplicationQuesRepository;