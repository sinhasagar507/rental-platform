import express from 'express';
import {
  createVisit,
  getVisits,
  updateVisit,
  setDecision,
} from '../controllers/visitController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', protect, requireRole('tenant'), createVisit);
router.get('/', protect, getVisits);
router.put('/:id', protect, updateVisit);
router.put('/:id/decision', protect, requireRole('tenant'), setDecision);

export default router;
