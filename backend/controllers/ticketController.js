import SupportTicket from '../models/SupportTicket.js';
import TicketMessage from '../models/TicketMessage.js';

export const createTicket = async (req, res) => {
  try {
    const { subject, category, leaseId } = req.body;
    if (!subject) return res.status(400).json({ message: 'subject required' });

    const ticket = await SupportTicket.create({
      tenantId: req.user._id,
      leaseId: leaseId || null,
      subject,
      category: category || 'general',
      status: 'open',
    });

    const populated = await SupportTicket.findById(ticket._id)
      .populate('tenantId', 'email profile');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTickets = async (req, res) => {
  try {
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    const filter = isAdmin ? {} : { tenantId: req.user._id };

    const tickets = await SupportTicket.find(filter)
      .populate('tenantId', 'email profile')
      .populate('leaseId', 'startDate endDate')
      .sort({ updatedAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('tenantId', 'email profile')
      .populate('leaseId', 'startDate endDate')
      .populate('listingId');
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isTenant = ticket.tenantId._id.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isTenant && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isTenant = ticket.tenantId.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isTenant && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const messages = await TicketMessage.find({ ticketId: req.params.id })
      .populate('senderId', 'email profile')
      .sort({ createdAt: 1 });

    const byParent = {};
    messages.forEach((m) => {
      const pid = m.parentMessageId?.toString() || 'root';
      if (!byParent[pid]) byParent[pid] = [];
      byParent[pid].push(m);
    });

    const buildTree = (pid) => {
      return (byParent[pid] || []).map((m) => ({
        ...m.toObject(),
        replies: buildTree(m._id.toString()),
      }));
    };

    const threaded = buildTree('root');
    res.json(threaded);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMessage = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isTenant = ticket.tenantId.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isTenant && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    const { content, parentMessageId } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'content required' });

    const message = await TicketMessage.create({
      ticketId: req.params.id,
      senderId: req.user._id,
      senderRole: req.user.role,
      content: content.trim(),
      parentMessageId: parentMessageId || null,
    });

    if (isAdmin && ticket.status === 'open') {
      ticket.status = 'in_progress';
      await ticket.save();
    }

    const populated = await TicketMessage.findById(message._id)
      .populate('senderId', 'email profile');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isAdmin) return res.status(403).json({ message: 'Access denied' });

    const { status } = req.body;
    if (status && ['open', 'in_progress', 'resolved', 'closed'].includes(status)) {
      ticket.status = status;
      await ticket.save();
    }

    const updated = await SupportTicket.findById(ticket._id)
      .populate('tenantId', 'email profile');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
