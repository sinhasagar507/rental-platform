import mongoose from 'mongoose';

const shortlistSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    listingIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  },
  { timestamps: true }
);

shortlistSchema.index({ tenantId: 1 });

export default mongoose.model('Shortlist', shortlistSchema);
