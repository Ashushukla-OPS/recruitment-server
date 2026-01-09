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

      await jobRoleModel.findByIdAndUpdate(jobId, { hasQuestions: true });

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

  async updateApplicationAnswers(applicationId, answers, candidateId) {
    try {
      const application = await jobApplicationModel.findOne({
        _id: applicationId,
        candidateId,
      });
      if (!application) {
        throw new AppError("Job Application not found", 500);
      }
      const questions = await JobApplicationQuestions.find({
        jobId: application.jobId,
      });

      const questionMap = new Map();
      questions.forEach((q) => questionMap.set(q._id.toString(), q));

      let status = application.status;

      const formattedAnswers = [];

      // 3️⃣ Validate answers
      for (const a of answers) {
        const question = questionMap.get(a.questionId);

        if (!question) {
          return res.status(400).json({
            message: "Invalid question ID detected",
          });
        }

        // Knockout logic
        if (
          question.isKnockout &&
          String(a.answer).toLowerCase() ===
            String(question.knockoutValue).toLowerCase()
        ) {
          status = "rejected";
        }

        formattedAnswers.push({
          questionId: question._id,
          question: question.title,
          answer: a.answer,
        });
      }

      // 4️⃣ Required question validation
      for (const q of questions) {
        if (q.isRequired) {
          const answered = formattedAnswers.find(
            (a) => a.questionId.toString() === q._id.toString()
          );
          if (!answered) {
            return res.status(400).json({
              message: `Answer required for question: ${q.title}`,
            });
          }
        }
      }

      // 5️⃣ Save answers
      application.answers = formattedAnswers;
      application.status = status;

      await application.save();

      return application;
    } catch (error) {
      throw new AppError("Error in saving jobApplication answers", 500, error);
    }
  }
}

export default mongoJobApplicationQuesRepository;
