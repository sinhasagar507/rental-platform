import express from 'express';
import { getShortlist, updateShortlist } from '../controllers/shortlistController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('tenant'));

router.get('/', getShortlist);
router.put('/', updateShortlist);

export default router;
