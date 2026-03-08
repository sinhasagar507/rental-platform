import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import adminListingRoutes from './routes/adminListingRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import shortlistRoutes from './routes/shortlistRoutes.js';
import leaseRoutes from './routes/leaseRoutes.js';
import adminLeaseRoutes from './routes/adminLeaseRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/admin/listings', adminListingRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/shortlists', shortlistRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/admin/leases', adminLeaseRoutes);
app.use('/api/tickets', ticketRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
