import { emailQueue } from "../queues/emailQueue.js";
import MongoEnrollmentsRespository from "../repositories/implementations/mongoEnrollmentsRepository.js";
import logger from "../utils/logger.js";



class TestEnrollmentService {
  constructor() {
    this.testEnrollmentRepository = new MongoEnrollmentsRespository();
  }

  async enrollUser(testId, email) {
    const existingEnrollment =
      await this.testEnrollmentRepository.findEnrollment(testId, email);
    if (existingEnrollment) {
      console.log("return from already exist enroll candidate")
      return existingEnrollment;
    }

    const res = await this.testEnrollmentRepository.enrollUser(testId, email);

    try {
      // ADD JOB TO BULLMQ QUEUE — NOT SEND EMAIL DIRECTLY
      await emailQueue.add(
        "enroll-candidate",
        {
          to: email.toLowerCase().trim(),
          name: "Candidate",
          testId: res?.testId.toString(),
        },
        {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 5000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        }
      );

      logger.info(`test enroll email job queued for ${email}`, {
        testId: res?.testId.toString(),
      });
    } catch (error) {
      logger.warn("Failed to queue enroll email", {
        email: email,
        testId: res?.testId.toString(),
        error: error.message,
      });
      console.log(error)
    }

    return res;
  }

  async getAssignedTests(email) {
    return await this.testEnrollmentRepository.findEnrollmentsByUser(email);
  }

  async enrollUsersBulk(testId, emails) {
    const result = await this.testEnrollmentRepository.bulkCreateEnrollment(testId, emails);
    try {
      const jobs = emails.map(email => ({
        name: "enroll-candidate",
        data: { 
          to: email.toLowerCase().trim(),
          name: "Candidate",
          testId: testId.toString(),
        },
        opts: {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
          removeOnComplete: true,
          removeOnFail: false,
        },
      }));

      await emailQueue.addBulk(jobs);
      logger.info(`Queued ${jobs.length} bulk enrollment emails`, { testId });
    } catch (error) {
      logger.warn("Failed to queue bulk emails", { testId, error: error.message });
    }

    return {
      success: true,
      insertedCount: result.insertedCount || result.nInserted || emails.length,
      totalProvided: emails.length,
    };
  }


}

export default TestEnrollmentService;
