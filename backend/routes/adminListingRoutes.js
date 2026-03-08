import express from 'express';
import {
  adminGetListings,
  adminCreateListing,
  adminUpdateListing,
  adminUpdateStatus,
} from '../controllers/listingController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin', 'landlord'));

router.get('/', adminGetListings);
router.post('/', adminCreateListing);
router.put('/:id', adminUpdateListing);
router.put('/:id/status', adminUpdateStatus);

export default router;
