import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  getMessages,
  addMessage,
  updateTicket,
} from '../controllers/ticketController.js';
import { protect } from '../middleware/auth.js';
import { requireRole } from '../middleware/roleCheck.js';

const router = express.Router();

router.use(protect);

router.post('/', requireRole('tenant'), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', addMessage);
router.put('/:id', requireRole('admin', 'landlord'), updateTicket);

export default router;
