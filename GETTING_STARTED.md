# Getting Started - Rental Platform

Complete step-by-step guide to run the app and use all features.

---

## Part 1: Setup (One-time)

### Step 1.1: Install MongoDB

You need a MongoDB database. Choose one option:

**Option A - MongoDB Atlas (Free, no local install)**

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" and create an account
3. Create a free M0 cluster (choose a region, keep defaults)
4. Create a database user: Security > Database Access > Add New
   - Username: `rentaluser` (or any name)
   - Password: create one and save it
5. Allow network access: Security > Network Access > Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for development
6. Get connection string: Database > Connect > Connect your application
   - Copy the URI (looks like `mongodb+srv://rentaluser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<password>` with your actual password

**Option B - MongoDB locally (Mac with Homebrew)**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Step 1.2: Configure environment

1. Open `backend/.env` in a text editor
2. Set `MONGODB_URI`:
   - **Atlas:** Paste your full connection string, e.g. `MONGODB_URI=mongodb+srv://rentaluser:YourPassword@cluster0.xxxxx.mongodb.net/rental-platform?retryWrites=true&w=majority`
   - **Local:** Use `MONGODB_URI=mongodb://localhost:27017/rental-platform`
3. Leave `JWT_SECRET` and `PORT` as-is for local dev

### Step 1.3: Install and seed

Open a terminal in the project folder and run:

```bash
# Install all dependencies
npm run install:all

# Seed database (creates admin user + 2 sample listings)
npm run seed

# Start both backend and frontend
npm run dev
```

### Step 1.4: Open the app

When you see "VITE ready" and "Server running on port 5001", open your browser to:

**http://localhost:3000**

(If 3000 is busy, try http://localhost:3001)

---

## Part 2: Using the App

### As a Tenant (Renter)

#### 2.1 Register

1. Click **Register** (or go to http://localhost:3000/register)
2. Enter:
   - Name: Your name
   - Email: e.g. `tenant@example.com`
   - Password: At least 6 characters
3. Click **Register**
4. You are logged in and redirected to Listings

#### 2.2 Browse listings

1. You land on **Browse Listings**
2. Use filters (optional):
   - **Location:** City, zip, or area (e.g. "New York", "Brooklyn")
   - **Min budget:** Minimum monthly rent
   - **Max budget:** Maximum monthly rent
   - **Move-in date:** When you plan to move in
3. Click a listing card to see details

#### 2.3 View listing details

On a listing page you see:

- Gallery images
- Price, deposit, bedrooms, bathrooms
- Description, amenities, rules
- Availability timeline

Actions:

- **Request Visit** – Request a property visit
- **Add to Shortlist** – Save for later
- **Compare** – Add to compare view

#### 2.4 Request a visit

1. On a listing, click **Request Visit**
2. Go to **My Visits** in the nav
3. Visit status: **Requested** (waiting for admin to schedule)

#### 2.5 Shortlist and compare

1. On listings, click **Add to Shortlist**
2. Go to **Shortlist**
3. Click **Compare Properties** to compare 2–3 listings side-by-side
4. Or go to **Compare** and add IDs from the shortlist

#### 2.6 Track visit status

In **My Visits**:

- **Requested** – Waiting for admin to schedule
- **Scheduled** – Admin set a date; click **Mark Visited** after you visit
- **Visited** – Click **Accept** or **Reject**
- **Decision** – Shows your choice

#### 2.7 Move-in checklist (after lease)

1. Admin creates a lease for you (after you accept a visit)
2. Go to **My Leases**
3. Click **Move-in Checklist** for a lease
4. Complete:
   - **Documents:** Add type (e.g. ID, lease) and URL
   - **Agreement:** Click **Confirm Agreement**
   - **Inventory:** Add items with condition and notes
5. When all are done, the lease becomes active

#### 2.8 Support tickets

1. Go to **Support**
2. Click **New Ticket**
3. Enter subject and category
4. Click **Create Ticket**
5. Open the ticket to add messages
6. Use **Reply** on messages for threaded replies

#### 2.9 Request stay extension

1. Go to **My Leases** > **Move-in Checklist** for an active lease
2. Scroll to **Request Stay Extension**
3. Enter new end date and reason
4. Click **Request Extension**
5. Admin approves or rejects

---

### As Admin

#### 2.10 Admin login

1. Go to http://localhost:3000/login
2. Use:
   - Email: `admin@rentalplatform.com`
   - Password: `admin123`
3. Click **Sign In**

#### 2.11 Admin dashboard

1. Click **Admin** in the nav
2. Dashboard shows:
   - Total listings, draft, in review, published
   - Pending visits
   - Open tickets

#### 2.12 Create and publish listings

1. Go to **Admin** > **Listings**
2. Click **Create Listing**
3. Fill in:
   - Title, description
   - Address (street, city, state, zip, location text)
   - Monthly rent, deposit
   - Bedrooms, bathrooms, sqft
   - Amenities (add one by one)
   - Rules (add one by one)
   - Gallery URLs (image URLs)
   - Availability (start/end dates)
4. Click **Create** (saved as Draft)
5. Back on Listings, click **Submit for Review**
6. Click **Publish** to make it live for tenants

#### 2.13 Manage visits

1. Go to **Admin** > **Visits**
2. For each **Requested** visit:
   - Pick a date
   - Click **Schedule Visit**
3. Tenant will see it as **Scheduled**

#### 2.14 Manage support tickets

1. Go to **Admin** > **Tickets**
2. Click a ticket to open it
3. Add replies in the message thread
4. Use **Start**, **Resolve**, or **Close** to update status

#### 2.15 Create leases

1. Go to **Admin** > **Leases**
2. Click **Create Lease**
3. Fill in:
   - Listing ID (from a listing)
   - Tenant ID (from the tenant’s profile or visit)
   - Start and end dates
4. Or use **Quick fill** from accepted visits
5. Click **Create Lease**
6. Tenant will see it under **My Leases**

#### 2.16 Approve extension requests

1. Go to **Admin** > **Leases**
2. Find leases with **Extension requested**
3. Click **Approve** or **Reject**

---

## Part 3: Quick Reference

### URLs

| Page        | URL                    |
|------------|------------------------|
| Login      | /login                 |
| Register   | /register              |
| Listings   | /listings              |
| My Visits  | /visits                |
| Shortlist  | /shortlist             |
| Compare    | /compare               |
| My Leases  | /leases                |
| Support    | /tickets               |
| Admin      | /admin                 |

### Demo accounts

| Role   | Email                     | Password  |
|--------|---------------------------|-----------|
| Admin  | admin@rentalplatform.com  | admin123  |
| Tenant | (register your own)       | (your pw) |

### Common issues

**"MongoDB connection error"**

- Check `MONGODB_URI` in `backend/.env`
- For Atlas: correct password, IP whitelist, network access
- For local: MongoDB service running (`brew services start mongodb-community`)

**"Port already in use"**

- Stop other Node processes or change `PORT` in `backend/.env`
- Restart with `npm run dev`

**Empty listings**

- Run `npm run seed` again
- Or create listings as admin

**401 / logged out**

- Token may have expired; log in again
