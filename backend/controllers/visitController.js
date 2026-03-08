import VisitRequest from '../models/VisitRequest.js';
import Listing from '../models/Listing.js';

export const createVisit = async (req, res) => {
  try {
    const { listingId } = req.body;
    if (!listingId) return res.status(400).json({ message: 'listingId required' });

    const listing = await Listing.findById(listingId);
    if (!listing || listing.status !== 'published') {
      return res.status(404).json({ message: 'Listing not found' });
    }

    const existing = await VisitRequest.findOne({
      listingId,
      tenantId: req.user._id,
      status: { $in: ['requested', 'scheduled'] },
    });
    if (existing) {
      return res.status(400).json({ message: 'Visit already requested' });
    }

    const visit = await VisitRequest.create({
      listingId,
      tenantId: req.user._id,
      status: 'requested',
    });

    const populated = await VisitRequest.findById(visit._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVisits = async (req, res) => {
  try {
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    const filter = isAdmin ? {} : { tenantId: req.user._id };
    const visits = await VisitRequest.find(filter)
      .populate('listingId', 'title address price gallery')
      .populate('tenantId', 'email profile')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllVisits = async (req, res) => {
  try {
    const visits = await VisitRequest.find()
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile')
      .sort({ createdAt: -1 });
    res.json(visits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVisit = async (req, res) => {
  try {
    const { status, scheduledDate } = req.body;
    const visit = await VisitRequest.findById(req.params.id);
    if (!visit) return res.status(404).json({ message: 'Visit not found' });

    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isAdmin && visit.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (status) {
      const valid = ['requested', 'scheduled', 'visited', 'decision'];
      if (!valid.includes(status)) return res.status(400).json({ message: 'Invalid status' });
      if (!isAdmin && !['visited'].includes(status)) {
        return res.status(403).json({ message: 'Only admin can set this status' });
      }
      visit.status = status;
      if (status === 'scheduled' && scheduledDate) visit.scheduledDate = new Date(scheduledDate);
      if (status === 'visited') visit.visitedDate = new Date();
    }

    await visit.save();
    const updated = await VisitRequest.findById(visit._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const setDecision = async (req, res) => {
  try {
    const { decision } = req.body;
    if (!['accepted', 'rejected'].includes(decision)) {
      return res.status(400).json({ message: 'Invalid decision' });
    }

    const visit = await VisitRequest.findOne({
      _id: req.params.id,
      tenantId: req.user._id,
    });
    if (!visit) return res.status(404).json({ message: 'Visit not found' });
    if (visit.status !== 'visited') {
      return res.status(400).json({ message: 'Mark visit as visited first' });
    }

    visit.status = 'decision';
    visit.decision = decision;
    await visit.save();

    const updated = await VisitRequest.findById(visit._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
