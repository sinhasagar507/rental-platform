import express from 'express';
import {
  getMyLeases,
  getLeaseById,
  getChecklist,
  uploadDocument,
  confirmAgreement,
  updateInventory,
  requestExtension,
} from '../controllers/leaseController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);

router.get('/', requireRole('tenant'), getMyLeases);
router.get('/:id', getLeaseById);
router.get('/:id/checklist', requireRole('tenant'), getChecklist);
router.post('/:id/checklist/documents', requireRole('tenant'), uploadDocument);
router.put('/:id/checklist/agreement', requireRole('tenant'), confirmAgreement);
router.put('/:id/checklist/inventory', requireRole('tenant'), updateInventory);
router.post('/:id/extension', requireRole('tenant'), requestExtension);

export default router;
