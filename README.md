# Rental Listings & Move-in Platform

A full-stack MERN rental housing platform for property discovery, visit scheduling, and move-in workflows.

## Features

### Tenant Side
- Browse listings with filters (location, budget range, move-in date)
- View detailed property pages (gallery, amenities, rules, availability timeline)
- Request property visits
- Track visit status: Requested -> Scheduled -> Visited -> Decision
- Shortlist properties
- Compare 2-3 properties side-by-side
- Move-in checklist (document uploads, agreement confirmation, inventory list)
- Support ticket system with threaded messages
- Request stay extension

### Admin Side
- Review and publish listings (Draft -> Review -> Published)
- Manage support tickets
- Manage visit requests and scheduling
- Create leases and manage extension requests

## Tech Stack

- **Frontend**: React, Vite, React Query, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Auth**: JWT + bcrypt

## Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGODB_URI and JWT_SECRET
npm install
npm run seed   # Creates admin user and sample listings
npm run dev
```

Backend runs on http://localhost:5000

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:3000 (proxies API to backend)

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT signing

**Frontend (.env)**
- `VITE_API_URL` - API base URL (default /api for proxy, use full URL for production)

## Deployment

### Backend (Render)

1. Create a Web Service on Render
2. Connect your GitHub repo
3. Set build command: `cd backend && npm install`
4. Set start command: `cd backend && npm start`
5. Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `PORT`

### Frontend (Vercel)

1. Import repo on Vercel
2. Set root directory to `client`
3. Add environment variable: `VITE_API_URL` = your Render backend URL
4. Deploy

### MongoDB Atlas

1. Create a cluster at mongodb.com/atlas
2. Create a database user
3. Whitelist 0.0.0.0/0 for Render access (or add Render IPs)
4. Copy connection URI to `MONGODB_URI`

## Demo Credentials

- **Admin**: admin@rentalplatform.com / admin123
- **Tenant**: Register a new account

## Full Guide

See **[GETTING_STARTED.md](GETTING_STARTED.md)** for step-by-step instructions on setup, registration, login, and using all features (listings, visits, shortlist, compare, move-in checklist, support tickets, admin workflows).

## Deploy for Free

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for deploying to Vercel (frontend) + Render (backend) + MongoDB Atlas. Includes setup, env vars, and how to update after deployment.

## Project Structure

```
backend/
  config/       - DB connection
  controllers/  - Route handlers
  middleware/   - Auth, role check
  models/       - Mongoose schemas
  routes/       - API routes
  scripts/      - Seed script

client/
  src/
    api/        - API client
    components/ - Reusable components
    context/    - Auth context
    pages/      - Page components
```

## License

MIT
