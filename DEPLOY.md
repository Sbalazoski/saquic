# SAQUIC — Deploy to Vercel + Supabase (Free)
# Complete step-by-step guide

---

## STEP 1 — Create your Supabase database (free)

1. Go to https://supabase.com and click **Start your project** (free)
2. Sign in with GitHub
3. Click **New Project**
   - Name: `saquic`
   - Database password: (save this somewhere safe)
   - Region: pick closest to you (e.g. US East)
4. Wait ~2 minutes for the project to spin up
5. Go to **SQL Editor** in the left sidebar
6. Click **New Query**
7. Open the file `supabase-schema.sql` from this project
8. Paste the entire contents into the SQL editor
9. Click **Run** — you should see "Success"

Now get your API keys:
1. Go to **Project Settings** → **API**
2. Copy **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy **anon / public** key (long string)

---

## STEP 2 — Deploy to Vercel (free)

### Option A — Vercel CLI (fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Go to project folder
cd saquic

# Deploy
vercel

# When prompted:
# - Set up and deploy? → Y
# - Which scope? → your account
# - Link to existing project? → N
# - Project name? → saquic
# - In which directory? → ./
# - Override settings? → N
```

After first deploy, set environment variables:

```bash
vercel env add VITE_SUPABASE_URL
# paste your Supabase URL, press Enter

vercel env add VITE_SUPABASE_ANON_KEY  
# paste your anon key, press Enter

# Redeploy with env vars
vercel --prod
```

### Option B — GitHub + Vercel dashboard

1. Push this project to a GitHub repo:
```bash
git init
git add .
git commit -m "Initial SAQUIC deploy"
git remote add origin https://github.com/YOUR_USERNAME/saquic.git
git push -u origin main
```

2. Go to https://vercel.com → **Add New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
5. Click **Deploy**

Your app will be live at `https://saquic.vercel.app` (or similar)

---

## STEP 3 — Add to phone home screen (PWA)

### iPhone (Safari):
1. Open your Vercel URL in Safari
2. Tap the Share button (box with arrow)
3. Tap **Add to Home Screen**
4. Name it **SAQUIC** → tap **Add**

### Android (Chrome):
1. Open your Vercel URL in Chrome
2. Tap the 3-dot menu
3. Tap **Add to Home Screen**
4. Tap **Add**

The app will open full-screen like a native app.

---

## FREE TIER LIMITS (both services)

**Supabase free tier:**
- 500 MB database
- 1 GB file storage
- 5 GB bandwidth
- 50,000 monthly active users
- More than enough for a personal breeder app

**Vercel free tier:**
- Unlimited deployments
- 100 GB bandwidth/month
- Custom domain support
- Automatic HTTPS

---

## CUSTOM DOMAIN (optional, free)

In Vercel dashboard → your project → **Settings** → **Domains**
Add your domain (e.g. `saquic.com`) — Vercel handles SSL automatically.

---

## UPDATE THE APP

Whenever you make changes:
```bash
vercel --prod
```
Or just push to GitHub — Vercel auto-deploys on every commit.
