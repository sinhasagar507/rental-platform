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
        gallery: ['https://placehold.co/600x400/1a1a1a/666?text=Living+Room', 'https://placehold.co/600x400/1a1a1a/666?text=Bedroom'],
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
        gallery: ['https://placehold.co/600x400/1a1a1a/666?text=Studio'],
        availabilityTimeline: [
          { startDate: new Date('2025-03-15'), endDate: new Date('2025-10-31'), available: true },
        ],
        status: 'published',
        createdBy: admin._id,
        publishedAt: new Date(),
      },
    ];

    for (const data of sampleListings) {
      const exists = await Listing.findOne({ title: data.title });
      if (!exists) {
        await Listing.create(data);
        console.log('Created listing:', data.title);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedAdmin();
