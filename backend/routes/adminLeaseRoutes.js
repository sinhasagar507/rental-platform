import express from 'express';
import {
  getAllLeases,
  createLease,
  reviewExtension,
} from '../controllers/leaseController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin', 'landlord'));

router.get('/', getAllLeases);
router.post('/', createLease);
router.put('/:id/extension', reviewExtension);

export default router;
