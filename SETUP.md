# Quick Setup Guide

## Option A: MongoDB Atlas (Recommended - No local install)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a free cluster (M0)
3. Click "Connect" -> "Connect your application" -> Copy the connection string
4. Replace `<password>` in the string with your database user password
5. Copy the full URI and paste it into `backend/.env` as `MONGODB_URI=your-uri-here`

## Option B: MongoDB locally (Homebrew on Mac)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

The default `backend/.env` already uses `mongodb://localhost:27017/rental-platform`.

## Run the app

```bash
# 1. Install all dependencies
npm run install:all

# 2. Seed the database (creates admin user + sample listings)
npm run seed

# 3. Start both backend and frontend
npm run dev
```

Then open **http://localhost:3000** (or 3001 if 3000 is in use) in your browser.

- **Admin login**: admin@rentalplatform.com / admin123
- **Tenant**: Register a new account
