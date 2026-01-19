import express from 'express';
import { createShare, getSharedCandidates } from '../controllers/shareCandidate.controller.js';

const router = express.Router();

router.post('/', createShare);

router.get('/test', (req, res) => {
  res.send('share route working');
});

router.get('/:shareId', getSharedCandidates);

export default router;
