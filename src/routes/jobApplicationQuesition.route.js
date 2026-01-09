import express from "express";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import jobApplicationQuestionController from "../controllers/jobApplicatonQuestion.controller.js"

const router = express.Router();


router.post("/createjobquestions/:id",authenticateJWT,authorize("admin"),jobApplicationQuestionController.createApplicationQuestion);

router.get("/getjobquestions/:id",authenticateJWT,authorize("admin"),jobApplicationQuestionController.getApplicationQuestion);

router.post("/updatejobquestion/:id",authenticateJWT,authorize("admin"),jobApplicationQuestionController.updateApplicationQuestion)


export default router;