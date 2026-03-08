import Listing from '../models/Listing.js';

export const getListings = async (req, res) => {
  try {
    const { location, minBudget, maxBudget, moveInDate, status = 'published' } = req.query;
    const filter = { status };

    if (location) {
      filter.$or = [
        { 'address.locationText': new RegExp(location, 'i') },
        { 'address.city': new RegExp(location, 'i') },
        { 'address.state': new RegExp(location, 'i') },
        { 'address.zip': new RegExp(location, 'i') },
      ];
    }

    if (minBudget || maxBudget) {
      filter['price.monthly'] = {};
      if (minBudget) filter['price.monthly'].$gte = Number(minBudget);
      if (maxBudget) filter['price.monthly'].$lte = Number(maxBudget);
    }

    if (moveInDate) {
      filter['availabilityTimeline'] = {
        $elemMatch: {
          startDate: { $lte: new Date(moveInDate) },
          endDate: { $gte: new Date(moveInDate) },
          available: true,
        },
      };
    }

    const listings = await Listing.find(filter)
      .populate('createdBy', 'email profile')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('createdBy', 'email profile');
    if (!listing) return res.status(404).json({ message: 'Listing not found' });

    const canViewDraft = ['admin', 'landlord'].includes(req.user?.role);
    if (listing.status !== 'published' && !canViewDraft) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const compareListings = async (req, res) => {
  try {
    const ids = (req.query.ids || '').split(',').filter(Boolean).slice(0, 3);
    if (ids.length === 0) return res.status(400).json({ message: 'Provide ids query param' });

    const listings = await Listing.find({
      _id: { $in: ids },
      status: 'published',
    }).populate('createdBy', 'email profile');

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminGetListings = async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('createdBy', 'email profile')
      .sort({ updatedAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminCreateListing = async (req, res) => {
  try {
    const listing = await Listing.create({
      ...req.body,
      createdBy: req.user._id,
      status: 'draft',
    });
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateListing = async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminUpdateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['draft', 'review', 'published'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const update = { status };
    if (status === 'published') update.publishedAt = new Date();

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );
    if (!listing) return res.status(404).json({ message: 'Listing not found' });
    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
