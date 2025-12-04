# 🚀 One-Click Deploy - MediCore EMR v2

## ✅ Vercel Projects Already Created!

Your Vercel projects are ready:
- **Backend**: `medicore-backend`
- **Frontend**: `medicore-frontend-v2`

---

## 🎯 Deploy in 3 Clicks (Literally!)

### Click 1: Deploy Backend

[![Deploy Backend to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vaibhaviimcal-web/medicore-emr-v2/tree/main/backend)

**After clicking:**
1. Select your Vercel account
2. Project name: `medicore-backend`
3. Root Directory: `backend`
4. Click "Deploy"

**Environment Variables** (you'll be prompted):
```
DATABASE_URL=postgresql://neondb_owner:your-password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=medicore-secret-key-32-characters-minimum
FRONTEND_URL=https://medicore-frontend-v2.vercel.app
NODE_ENV=production
```

---

### Click 2: Deploy Frontend

[![Deploy Frontend to Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/vaibhaviimcal-web/medicore-emr-v2/tree/main/frontend)

**After clicking:**
1. Select your Vercel account
2. Project name: `medicore-frontend-v2`
3. Root Directory: `frontend`
4. Click "Deploy"

**Environment Variables** (you'll be prompted):
```
NEXT_PUBLIC_API_URL=https://medicore-backend.vercel.app
```

---

### Click 3: Setup Database (Free)

**Option A: Neon (Recommended)**

1. Go to: https://console.neon.tech/app/projects
2. Click "New Project"
3. Name: `medicore-emr`
4. Click "Create"
5. Copy connection string
6. Add to Vercel backend environment variables

**Option B: Supabase (Alternative)**

1. Go to: https://supabase.com/dashboard/projects
2. Click "New Project"
3. Name: `medicore-emr`
4. Database Password: (create one)
5. Click "Create"
6. Go to Settings → Database
7. Copy connection string
8. Add to Vercel backend environment variables

---

## 🎉 That's It!

Your app is deployed!

**Access your app:**
- Frontend: Check Vercel dashboard for URL
- Backend: Check Vercel dashboard for URL

---

## 🧪 Quick Test

### Create First User (Copy & Paste)

Replace `YOUR-BACKEND-URL` with your actual backend URL:

```bash
curl -X POST https://YOUR-BACKEND-URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@medicore.com",
    "password": "Admin@123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  }'
```

### Login

1. Go to your frontend URL
2. Click "Login"
3. Email: `admin@medicore.com`
4. Password: `Admin@123456`

---

## 📊 Free Tier Limits

**Vercel**: 100GB bandwidth/month
**Neon**: 500MB database
**Total Cost**: $0/month

**Perfect for:**
- Small clinics
- Testing
- MVP launch
- Up to 100 patients

---

## 🆘 Need Help?

**Can't find your URLs?**
- Go to: https://vercel.com/dashboard
- Click on your project
- See the URL at the top

**Database connection error?**
- Make sure connection string ends with `?sslmode=require`
- Check database is active in Neon/Supabase

**CORS error?**
- Update FRONTEND_URL in backend environment variables
- Redeploy backend

---

## 🎯 What's Next?

1. ✅ Add more users
2. ✅ Customize branding
3. ✅ Add custom domain
4. ✅ Enable AI features (optional)
5. ✅ Enable video calls (optional)

---

**Total Deployment Time**: 5 minutes
**Total Cost**: $0/month
**Difficulty**: Easy

**Built with ❤️ for Healthcare Professionals**
