import mongoose from 'mongoose';

const leaseSchema = new mongoose.Schema(
  {
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    visitRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'VisitRequest' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'active', 'extended', 'ended'],
      default: 'pending',
    },
    extensionRequest: {
      requestedEndDate: Date,
      reason: String,
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: null },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
    },
    moveInChecklist: {
      documents: [{ type: { type: String }, url: String, uploadedAt: { type: Date, default: Date.now } }],
      agreementConfirmed: { type: Boolean, default: false },
      inventoryList: [{ item: String, condition: String, notes: String }],
      completedAt: Date,
    },
  },
  { timestamps: true }
);

leaseSchema.index({ tenantId: 1 });
leaseSchema.index({ listingId: 1 });

export default mongoose.model('Lease', leaseSchema);
