import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  available: { type: Boolean, default: true },
});

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      locationText: String,
    },
    price: {
      monthly: { type: Number, required: true },
      deposit: { type: Number, default: 0 },
    },
    budgetRange: {
      min: Number,
      max: Number,
    },
    propertyType: { type: String, default: 'apartment' },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    sqft: { type: Number, default: 0 },
    amenities: [{ type: String }],
    rules: [{ type: String }],
    gallery: [{ type: String }],
    availabilityTimeline: [availabilitySchema],
    status: {
      type: String,
      enum: ['draft', 'review', 'published'],
      default: 'draft',
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishedAt: Date,
  },
  { timestamps: true }
);

listingSchema.index({ status: 1 });
listingSchema.index({ 'address.city': 1 });
listingSchema.index({ 'price.monthly': 1 });
listingSchema.index({ 'availabilityTimeline.startDate': 1 });

export default mongoose.model('Listing', listingSchema);
