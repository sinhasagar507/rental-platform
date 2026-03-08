# Free Deployment Guide

Deploy your Rental Platform for free using **Vercel** (frontend) + **Render** (backend) + **MongoDB Atlas** (database).

---

## Prerequisites

1. **GitHub account** - [github.com](https://github.com)
2. **Vercel account** - [vercel.com](https://vercel.com) (sign up with GitHub)
3. **Render account** - [render.com](https://render.com) (sign up with GitHub)
4. **MongoDB Atlas** - Already set up

---

## Step 1: Push to GitHub

1. Create a new repository on GitHub (e.g. `rental-platform`)
2. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/rental-platform.git
git push -u origin main
```

**Important:** Ensure `backend/.env` is in `.gitignore` (it should be). Never commit secrets to GitHub.

---

## Step 2: MongoDB Atlas - Allow Render Access

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) > Your Project > **Network Access**
2. Click **Add IP Address**
3. Select **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

This lets Render's servers connect to your database.

---

## Step 3: Deploy Backend to Render

The repo includes a `render.yaml` blueprint. You can deploy in two ways:

**Option A - Blueprint (recommended)**

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** > **Blueprint**
3. Connect your GitHub repo (`rental-platform`)
4. Render will detect `render.yaml` and create the backend service
5. Add the environment variable values when prompted (or in Dashboard > Environment):
   - `MONGODB_URI` - Your full Atlas connection string
   - `JWT_SECRET` - A long random string (e.g. randomkeygen.com)
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` - If using image uploads
6. Click **Apply**
7. Wait for deployment (2-5 minutes)
8. Copy your backend URL (e.g. `https://rental-platform-api.onrender.com`)

**Option B - Manual Web Service**

1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** > **Web Service**
3. Connect your GitHub repo (`rental-platform`)
4. Configure:
   - **Name:** `rental-platform-api` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables:** `MONGODB_URI`, `JWT_SECRET`, Cloudinary vars (if needed)
6. Click **Create Web Service**
7. Wait for deployment (2-5 minutes)
8. Copy your backend URL (e.g. `https://rental-platform-api.onrender.com`)

**Note:** Render free tier spins down after 15 min of inactivity. First request after that may take 30-60 seconds (cold start).

---

## Step 4: Deploy Frontend to Vercel

The repo includes `client/vercel.json` for SPA routing. To deploy:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** > **Project**
3. Import your `rental-platform` repo
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
5. Add **Environment Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://YOUR-RENDER-URL.onrender.com/api`
   
   Example: `https://rental-platform-api.onrender.com/api`

6. Click **Deploy**
7. Wait for deployment (1-2 minutes)
8. Your app will be live at `https://your-project.vercel.app`

---

## Step 5: Seed Production Database (Optional)

Your production MongoDB is empty. To add the admin user and sample listings:

**Option A - Run seed locally pointing to production DB**

1. Temporarily set `MONGODB_URI` in `backend/.env` to your Atlas URI (same as Render)
2. Run: `npm run seed`
3. Restore your local `.env` if you use local MongoDB for development

**Option B - Add a seed endpoint (for one-time use)**

You could add a protected `/api/seed` route that runs the seed logic. Then call it once after deploy. (Not implemented by default - Option A is simpler.)

---

## Step 6: Test Your Deployment

1. Open your Vercel URL (e.g. `https://rental-platform.vercel.app`)
2. Register a new tenant account
3. Log in as admin: `admin@rentalplatform.com` / `admin123` (after seeding)
4. Browse listings, request visits, etc.

---

## Summary - Your URLs

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://your-project.vercel.app |
| Backend (Render) | https://your-api.onrender.com |
| API Health Check | https://your-api.onrender.com/api/health |

---

## Making Changes After Deployment

1. Edit your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```
3. **Vercel** and **Render** auto-deploy on every push to `main`
4. Wait 1-3 minutes for both to rebuild

---

## Free Tier Limits

| Service | Limit |
|---------|-------|
| **Vercel** | 100GB bandwidth/month, unlimited deployments |
| **Render** | 750 hours/month, spins down after 15 min idle |
| **MongoDB Atlas** | 512MB storage, shared cluster |

---

## Troubleshooting

**"Failed to fetch" or API errors**
- Check `VITE_API_URL` in Vercel matches your Render URL + `/api`
- Ensure Render service is running (visit the Render dashboard)
- Check CORS - backend allows all origins by default

**Render "Service Unavailable"**
- Free tier spins down. First request wakes it up (may take 30-60 sec)
- Or upgrade to paid tier for always-on

**MongoDB connection failed**
- Verify Network Access allows 0.0.0.0/0
- Check connection string in Render env vars
- Ensure password has no unencoded special characters
