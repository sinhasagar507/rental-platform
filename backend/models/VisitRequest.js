import mongoose from 'mongoose';

const visitRequestSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['requested', 'scheduled', 'visited', 'decision'],
      default: 'requested',
    },
    requestedDate: { type: Date, default: Date.now },
    scheduledDate: Date,
    visitedDate: Date,
    decision: { type: String, enum: ['accepted', 'rejected'], default: null },
    notes: [{ type: String }],
  },
  { timestamps: true }
);

visitRequestSchema.index({ tenantId: 1 });
visitRequestSchema.index({ listingId: 1 });
visitRequestSchema.index({ status: 1 });

export default mongoose.model('VisitRequest', visitRequestSchema);
