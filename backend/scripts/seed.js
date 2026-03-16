import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    const adminEmail = 'admin@rentalplatform.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const passwordHash = await User.hashPassword('admin123');
      admin = await User.create({
        email: adminEmail,
        passwordHash,
        role: 'admin',
        profile: { name: 'Platform Admin', phone: '' },
      });
      console.log('Admin user created:', admin.email);
    } else {
      console.log('Admin user already exists');
    }

    const sampleListings = [
      {
        title: 'Cozy Downtown Apartment',
        description: 'Spacious 2-bedroom apartment in the heart of the city. Walking distance to shops and restaurants.',
        address: { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', locationText: 'New York Manhattan' },
        price: { monthly: 2200, deposit: 2200 },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 1,
        sqft: 950,
        amenities: ['Parking', 'Laundry', 'Gym', 'Doorman'],
        rules: ['No pets', 'No smoking'],
        gallery: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f527f?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop',
        ],
        availabilityTimeline: [
          { startDate: new Date('2025-04-01'), endDate: new Date('2025-12-31'), available: true },
        ],
        status: 'published',
        createdBy: admin._id,
        publishedAt: new Date(),
      },
      {
        title: 'Modern Studio Near Transit',
        description: 'Efficient studio with modern finishes. Steps from subway.',
        address: { street: '456 Oak Ave', city: 'Brooklyn', state: 'NY', zip: '11201', locationText: 'Brooklyn NY' },
        price: { monthly: 1650, deposit: 1650 },
        propertyType: 'apartment',
        bedrooms: 1,
        bathrooms: 1,
        sqft: 550,
        amenities: ['Laundry', 'Bike storage'],
        rules: ['No pets'],
        gallery: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&h=400&fit=crop',
        ],
        availabilityTimeline: [
          { startDate: new Date('2025-03-15'), endDate: new Date('2025-10-31'), available: true },
        ],
        status: 'published',
        createdBy: admin._id,
        publishedAt: new Date(),
      },
      {
        title: 'Bright Loft with City Views',
        description: 'Open-plan loft with floor-to-ceiling windows. Stunning skyline views.',
        address: { street: '789 Park Ave', city: 'Manhattan', state: 'NY', zip: '10021', locationText: 'Manhattan NY' },
        price: { monthly: 3200, deposit: 3200 },
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200,
        amenities: ['Gym', 'Rooftop', 'Concierge', 'Parking'],
        rules: ['No smoking'],
        gallery: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
        ],
        availabilityTimeline: [
          { startDate: new Date('2025-05-01'), endDate: new Date('2025-11-30'), available: true },
        ],
        status: 'published',
        createdBy: admin._id,
        publishedAt: new Date(),
      },
    ];

    for (const data of sampleListings) {
      await Listing.findOneAndUpdate(
        { title: data.title },
        { $set: { ...data, updatedAt: new Date() } },
        { upsert: true, new: true }
      );
      console.log('Created/updated listing:', data.title);
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
