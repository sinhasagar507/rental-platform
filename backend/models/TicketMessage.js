import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    ticketId: { type: mongoose.Schema.Types.ObjectId, ref: 'SupportTicket', required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, default: 'tenant' },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    parentMessageId: { type: mongoose.Schema.Types.ObjectId, ref: 'TicketMessage', default: null },
  },
  { timestamps: true }
);

messageSchema.index({ ticketId: 1 });
messageSchema.index({ parentMessageId: 1 });

export default mongoose.model('TicketMessage', messageSchema);
