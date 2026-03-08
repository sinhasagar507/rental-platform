import Lease from '../models/Lease.js';
import VisitRequest from '../models/VisitRequest.js';

export const getMyLeases = async (req, res) => {
  try {
    const leases = await Lease.find({ tenantId: req.user._id })
      .populate('listingId', 'title address price')
      .sort({ createdAt: -1 });
    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeases = async (req, res) => {
  try {
    const leases = await Lease.find()
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile')
      .sort({ createdAt: -1 });
    res.json(leases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaseById = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    if (!lease) return res.status(404).json({ message: 'Lease not found' });

    const isTenant = lease.tenantId._id.toString() === req.user._id.toString();
    const isAdmin = ['admin', 'landlord'].includes(req.user.role);
    if (!isTenant && !isAdmin) return res.status(403).json({ message: 'Access denied' });

    res.json(lease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLease = async (req, res) => {
  try {
    const { listingId, tenantId, visitRequestId, startDate, endDate } = req.body;
    if (!listingId || !tenantId || !startDate || !endDate) {
      return res.status(400).json({ message: 'listingId, tenantId, startDate, endDate required' });
    }

    const lease = await Lease.create({
      listingId,
      tenantId,
      visitRequestId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: 'pending',
    });

    const populated = await Lease.findById(lease._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChecklist = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (lease.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(lease.moveInChecklist || { documents: [], agreementConfirmed: false, inventoryList: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (lease.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { type, url } = req.body;
    if (!type || !url) return res.status(400).json({ message: 'type and url required' });

    if (!lease.moveInChecklist) lease.moveInChecklist = { documents: [], agreementConfirmed: false, inventoryList: [] };
    lease.moveInChecklist.documents.push({ type, url });
    await lease.save();

    res.json(lease.moveInChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmAgreement = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (lease.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!lease.moveInChecklist) lease.moveInChecklist = { documents: [], agreementConfirmed: false, inventoryList: [] };
    lease.moveInChecklist.agreementConfirmed = true;

    const allDone =
      lease.moveInChecklist.documents?.length > 0 &&
      lease.moveInChecklist.agreementConfirmed &&
      lease.moveInChecklist.inventoryList?.length > 0;
    if (allDone) lease.moveInChecklist.completedAt = new Date();
    if (allDone) lease.status = 'active';

    await lease.save();
    res.json(lease.moveInChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateInventory = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (lease.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { inventoryList } = req.body;
    if (!Array.isArray(inventoryList)) return res.status(400).json({ message: 'inventoryList array required' });

    if (!lease.moveInChecklist) lease.moveInChecklist = { documents: [], agreementConfirmed: false, inventoryList: [] };
    lease.moveInChecklist.inventoryList = inventoryList;

    const allDone =
      lease.moveInChecklist.documents?.length > 0 &&
      lease.moveInChecklist.agreementConfirmed &&
      lease.moveInChecklist.inventoryList?.length > 0;
    if (allDone) lease.moveInChecklist.completedAt = new Date();
    if (allDone) lease.status = 'active';

    await lease.save();
    res.json(lease.moveInChecklist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestExtension = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (lease.tenantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { requestedEndDate, reason } = req.body;
    if (!requestedEndDate) return res.status(400).json({ message: 'requestedEndDate required' });

    if (lease.extensionRequest?.status === 'pending') {
      return res.status(400).json({ message: 'Extension already requested' });
    }

    lease.extensionRequest = {
      requestedEndDate: new Date(requestedEndDate),
      reason: reason || '',
      status: 'pending',
    };
    await lease.save();

    const populated = await Lease.findById(lease._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewExtension = async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) return res.status(404).json({ message: 'Lease not found' });
    if (!lease.extensionRequest || lease.extensionRequest.status !== 'pending') {
      return res.status(400).json({ message: 'No pending extension' });
    }

    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    lease.extensionRequest.status = status;
    lease.extensionRequest.reviewedBy = req.user._id;
    lease.extensionRequest.reviewedAt = new Date();
    if (status === 'approved') {
      lease.endDate = lease.extensionRequest.requestedEndDate;
      lease.status = 'extended';
    }
    await lease.save();

    const populated = await Lease.findById(lease._id)
      .populate('listingId', 'title address price')
      .populate('tenantId', 'email profile');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
