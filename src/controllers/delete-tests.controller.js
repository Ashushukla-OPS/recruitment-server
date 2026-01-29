import DeleteTestsService from "../services/delete-tests.service.js";

class DeleteTestsController {
  constructor() {
    this.deleteTestsService = new DeleteTestsService();
  }

  async deleteTest(req, res, next) {
    try {
      const deleted = await this.deleteTestsService.deleteTest(
        req.params.testId
      );

      res.status(200).json({
        success: true,
        message: "Test deleted successfully",
        data: deleted,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DeleteTestsController();
