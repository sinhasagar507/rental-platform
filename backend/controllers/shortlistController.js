import Shortlist from '../models/Shortlist.js';
import Listing from '../models/Listing.js';

export const getShortlist = async (req, res) => {
  try {
    let shortlist = await Shortlist.findOne({ tenantId: req.user._id })
      .populate('listingIds', 'title address price gallery bedrooms bathrooms');
    if (!shortlist) {
      shortlist = await Shortlist.create({ tenantId: req.user._id, listingIds: [] });
    }
    res.json(shortlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateShortlist = async (req, res) => {
  try {
    const { listingIds } = req.body;
    if (!Array.isArray(listingIds)) {
      return res.status(400).json({ message: 'listingIds must be an array' });
    }

    const shortlist = await Shortlist.findOneAndUpdate(
      { tenantId: req.user._id },
      { $set: { listingIds: listingIds.slice(0, 10) } },
      { new: true, upsert: true }
    ).populate('listingIds', 'title address price gallery bedrooms bathrooms');

    res.json(shortlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
