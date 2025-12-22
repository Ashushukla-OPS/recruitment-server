import express from "express";
import ScheduleInterviewController from "../controllers/scheduleInterview.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

router.post("/", authenticateJWT ,authorize("admin"),  ScheduleInterviewController.createInterview);

router.get("/me", authenticateJWT, ScheduleInterviewController.getMyInterviews);

router.get("/all", authenticateJWT, authorize("admin"), ScheduleInterviewController.getAllInterviews);

router.get("/:id", authenticateJWT, authorize("admin"), ScheduleInterviewController.getInterviewById);

router.get("/job/:jobId", authenticateJWT, authorize("admin"), ScheduleInterviewController.getInterviewByJobId);

router.patch("/:id/status", authenticateJWT,  authorize("admin"), ScheduleInterviewController.updateInterviewStatus);

router.delete("/:id", authenticateJWT, authorize("admin"), ScheduleInterviewController.deleteInterview);

export default router;

