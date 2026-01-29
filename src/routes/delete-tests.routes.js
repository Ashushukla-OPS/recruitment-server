import express from "express";
import deleteTestsController from "../controllers/delete-tests.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.delete(
  "/:testId",
  authenticateJWT,
  deleteTestsController.deleteTest.bind(deleteTestsController)
);

export default router;
