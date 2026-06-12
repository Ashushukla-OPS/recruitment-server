import express from "express"   
import candidateController from "../controllers/candidateController.js"
import validate from "../middlewares/validators/validate.js"
import candidateSchema from "../middlewares/validators/candidate.validator.js"
import updateCandidateSchema from "../middlewares/validators/candidateUpdateSchema.js"
import {asyncHandler} from "../../Auth/src/utils/AsyncHandler.js"

const router = express.Router()

router.post("/",validate(candidateSchema),asyncHandler(candidateController.createCandidate.bind(candidateController)))
router.get("/",asyncHandler(candidateController.getAllCandidates.bind(candidateController)))
router.get("/:id",asyncHandler(candidateController.getCandidateById.bind(candidateController)))
router.patch("/:id",validate(updateCandidateSchema),asyncHandler(candidateController.updateCandidate.bind(candidateController)))
router.delete("/:id",asyncHandler(candidateController.deleteCandidate.bind(candidateController))) 
export default router   
