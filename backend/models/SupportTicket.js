import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    leaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lease' },
    subject: { type: String, required: true },
    category: { type: String, default: 'general' },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  },
  { timestamps: true }
);

ticketSchema.index({ tenantId: 1 });
ticketSchema.index({ status: 1 });

export default mongoose.model('SupportTicket', ticketSchema);
