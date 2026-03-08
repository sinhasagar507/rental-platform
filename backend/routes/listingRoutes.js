import express from 'express';
import {
  getListings,
  getListingById,
  compareListings,
} from '../controllers/listingController.js';
import { protect } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getListings);
router.get('/compare', protect, compareListings);
router.get('/:id', optionalAuth, getListingById);

export default router;
