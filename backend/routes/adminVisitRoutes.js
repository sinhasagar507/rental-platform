import express from 'express';
import { getAllVisits, updateVisit } from '../controllers/visitController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin', 'landlord'));

router.get('/', getAllVisits);
router.put('/:id', updateVisit);

export default router;
