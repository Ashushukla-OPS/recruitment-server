import mongoose from "mongoose";
import Tests from "../../models/Tests.js";
import TestAttempt from "../../models/TestAttempt.js";
import { AppError } from "../../utils/errors.js";

class DeleteTestsRepository {
  async deleteTest(id) {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) return null;

      const test = await Tests.findById(id);
      if (!test) return null;

      // 🧹 Cleanup related collections
      await TestAttempt.deleteMany({ testId: id });

      await mongoose.connection
        .collection("testenrollments")
        .deleteMany({ testId: new mongoose.Types.ObjectId(id) });

      await Tests.findByIdAndDelete(id);

      return test;
    } catch (error) {
      throw new AppError(`Failed to delete test: ${error.message}`, 500);
    }
  }
}

export default DeleteTestsRepository;
