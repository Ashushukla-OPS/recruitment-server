import DeleteTestsRepository from "../repositories/implementations/mongoDelete-testsRepository.js";
import { AppError } from "../utils/errors.js";

class DeleteTestsService {
  constructor() {
    this.deleteTestsRepository = new DeleteTestsRepository();
  }

  async deleteTest(testId) {
    const deleted = await this.deleteTestsRepository.deleteTest(testId);

    if (!deleted) {
      throw new AppError("Test not found or already deleted", 404);
    }

    return deleted;
  }
}

export default DeleteTestsService;
