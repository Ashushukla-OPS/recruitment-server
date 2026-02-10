import express from 'express';
import ShareCandidateController from '../controllers/shareCandidate.controller.js';

import { authorize } from '../middlewares/role.middleware.js';

import { authenticateJWT } from '../middlewares/auth.middleware.js';
// import { createShare, getSharedCandidates } from '../controllers/shareCandidate.controller.js';

const router = express.Router();



// router.get('/:shareId', ShareCandidateController.shareShareCandidate);
const shareCandidateController = new ShareCandidateController();

router.post('/', authenticateJWT,authorize('admin'), shareCandidateController.createShareCandidate);


router.get('/', shareCandidateController.getAllGroups);

router.put('/:id', authenticateJWT,authorize('admin'), shareCandidateController.updateGroup);

router.delete('/:id', authenticateJWT, authorize('admin'), shareCandidateController.deleteGroup);

router.get('/:shareId', shareCandidateController.shareShareCandidate);

router.delete('/:groupId/user/:userId', authenticateJWT, authorize('admin'), shareCandidateController.removeUserFromGroup);

export default router;
