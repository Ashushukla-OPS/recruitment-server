import express from "express"   
import candidateController from "../controllers/candidateController.js"
import validate from "../middlewares/validators/validate.js"
import candidateSchema from "../middlewares/validators/candidate.validator.js"
const router = express.Router()

router.post("/create",validate(candidateSchema),candidateController.createCandidate)
router.get("/getall",candidateController.getAllCandidates)
router.get("/getbyid/:id",candidateController.getCandidateById)
router.patch("/update/:id",candidateController.updateCandidate)
router.delete("/delete/:id",candidateController.deleteCandidate) 
export default router   
