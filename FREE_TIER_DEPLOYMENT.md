# 🆓 MediCore EMR v2 - Free Tier Deployment Guide

## 100% Free Deployment - No Credit Card Required!

This guide will help you deploy MediCore EMR v2 completely free using:
- ✅ **Vercel** (Frontend & Backend) - Free
- ✅ **Neon** (PostgreSQL) - Free 500MB
- ✅ **Upstash** (Redis) - Free 10K commands/day
- ✅ **Total Cost**: $0/month

---

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free) - https://vercel.com/signup
- Neon account (free) - https://neon.tech
- Upstash account (free) - https://upstash.com

---

## 🚀 Step-by-Step Deployment

### Step 1: Setup Neon PostgreSQL Database (2 minutes)

1. **Go to Neon**: https://neon.tech
2. **Sign up** with GitHub (free, no credit card)
3. **Create new project**:
   - Name: `medicore-emr`
   - Region: Choose closest to you
   - PostgreSQL version: 15
4. **Copy connection string**:
   - Click "Connection Details"
   - Copy the connection string (starts with `postgresql://`)
   - Example: `postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb`
5. **Save this** - you'll need it later!

---

### Step 2: Setup Upstash Redis (2 minutes)

1. **Go to Upstash**: https://upstash.com
2. **Sign up** with GitHub (free, no credit card)
3. **Create Redis database**:
   - Name: `medicore-redis`
   - Type: Regional
   - Region: Choose closest to you
4. **Copy connection string**:
   - Click on your database
   - Copy "UPSTASH_REDIS_REST_URL"
   - Example: `https://xxx.upstash.io`
5. **Save this** - you'll need it later!

---

### Step 3: Deploy Backend to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository**:
   - Click "Add New" → "Project"
   - Select "Import Git Repository"
   - Choose: `vaibhaviimcal-web/medicore-emr-v2`
   - Click "Import"

3. **Configure Backend**:
   ```
   Project Name: medicore-backend
   Framework Preset: Other
   Root Directory: backend
   Build Command: npm install && npx prisma generate && npm run build
   Output Directory: dist
   Install Command: npm install
   Development Command: npm run dev
   ```

4. **Add Environment Variables**:
   Click "Environment Variables" and add these:

   ```env
   NODE_ENV=production
   PORT=5000
   
   # Database (from Step 1 - Neon)
   DATABASE_URL=postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   
   # Redis (from Step 2 - Upstash)
   REDIS_URL=https://xxx.upstash.io
   
   # JWT Secret (generate a random 32+ character string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-32-chars
   JWT_EXPIRES_IN=7d
   
   # Frontend URL (we'll update this after frontend deployment)
   FRONTEND_URL=https://medicore-emr-v2.vercel.app
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

   **Optional (for AI features - requires OpenAI account)**:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

   **Optional (for video calls - requires Agora account)**:
   ```env
   AGORA_APP_ID=your-agora-app-id
   AGORA_APP_CERTIFICATE=your-agora-certificate
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy your backend URL (e.g., `https://medicore-backend.vercel.app`)

6. **Run Database Migrations**:
   - After deployment, go to your project
   - Click "Deployments" → Latest deployment → "..." → "Redeploy"
   - This will run Prisma migrations automatically

---

### Step 4: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Repository Again**:
   - Click "Add New" → "Project"
   - Select: `vaibhaviimcal-web/medicore-emr-v2`
   - Click "Import"

3. **Configure Frontend**:
   ```
   Project Name: medicore-emr-v2
   Framework Preset: Next.js
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   Development Command: npm run dev
   ```

4. **Add Environment Variables**:
   ```env
   # Backend URL (from Step 3)
   NEXT_PUBLIC_API_URL=https://medicore-backend.vercel.app
   ```

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app will be live!

---

### Step 5: Update Backend CORS (1 minute)

1. **Go to Backend Project** on Vercel
2. **Settings** → "Environment Variables"
3. **Update FRONTEND_URL**:
   ```env
   FRONTEND_URL=https://medicore-emr-v2.vercel.app
   ```
   (Use your actual frontend URL)
4. **Redeploy** backend for changes to take effect

---

## 🎉 Deployment Complete!

Your MediCore EMR is now live!

**Frontend URL**: `https://medicore-emr-v2.vercel.app`
**Backend URL**: `https://medicore-backend.vercel.app`
**Health Check**: `https://medicore-backend.vercel.app/health`

---

## 🧪 Testing Your Deployment

### 1. Test Health Endpoint
Open in browser:
```
https://medicore-backend.vercel.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-04T...",
  "uptime": 123.45,
  "environment": "production",
  "version": "2.0.0"
}
```

### 2. Test Frontend
Open in browser:
```
https://medicore-emr-v2.vercel.app
```

You should see the MediCore EMR landing page!

### 3. Test Login
1. Go to: `https://medicore-emr-v2.vercel.app/login`
2. Use demo credentials:
   ```
   Email: doctor@medicore.com
   Password: demo123456
   ```
3. You should see the dashboard!

---

## 🔧 Post-Deployment Setup

### Create First User (Doctor)

Since this is a fresh deployment, you need to create your first user:

**Option 1: Using API (Recommended)**

```bash
curl -X POST https://medicore-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@medicore.com",
    "password": "demo123456",
    "firstName": "Dr. John",
    "lastName": "Doe",
    "role": "DOCTOR",
    "licenseNumber": "DOC123456",
    "specialty": "General Medicine"
  }'
```

**Option 2: Using Postman/Insomnia**
- Method: POST
- URL: `https://medicore-backend.vercel.app/api/auth/register`
- Body (JSON):
```json
{
  "email": "doctor@medicore.com",
  "password": "demo123456",
  "firstName": "Dr. John",
  "lastName": "Doe",
  "role": "DOCTOR",
  "licenseNumber": "DOC123456",
  "specialty": "General Medicine"
}
```

---

## 📊 Free Tier Limits

### Vercel (Free Hobby Plan)
- ✅ 100GB Bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ✅ Custom domains
- ⚠️ 100 serverless function executions/day
- ⚠️ 10 second function timeout

### Neon PostgreSQL (Free Tier)
- ✅ 500MB storage
- ✅ 1 project
- ✅ Unlimited queries
- ⚠️ Database sleeps after 5 minutes of inactivity
- ⚠️ 1 concurrent connection

### Upstash Redis (Free Tier)
- ✅ 10,000 commands/day
- ✅ 256MB storage
- ✅ Global replication
- ⚠️ 1 database

**Perfect for:**
- ✅ Testing and development
- ✅ Small clinics (1-5 doctors)
- ✅ Up to 100 patients
- ✅ Demo purposes

---

## 🚀 Upgrading to Production

When you're ready to scale:

### Vercel Pro ($20/month)
- Unlimited serverless executions
- 60 second function timeout
- Team collaboration
- Advanced analytics

### Neon Pro ($19/month)
- 10GB storage
- Always-on databases
- Point-in-time recovery
- Multiple projects

### Upstash Pro ($10/month)
- 100,000 commands/day
- 1GB storage
- Multiple databases

**Total Production Cost**: ~$50/month

---

## 🔐 Security Checklist

- [x] HTTPS enabled (automatic on Vercel)
- [x] Environment variables secured
- [x] Database connection encrypted
- [ ] Change JWT_SECRET to a strong random value
- [ ] Create strong passwords for users
- [ ] Enable 2FA for Vercel account
- [ ] Regular backups (Neon has automatic backups)

---

## 🐛 Troubleshooting

### Issue: "Database connection failed"
**Solution**:
1. Check DATABASE_URL is correct
2. Ensure `?sslmode=require` is at the end
3. Verify Neon database is active
4. Check Vercel logs for detailed error

### Issue: "CORS error"
**Solution**:
1. Verify FRONTEND_URL in backend matches your frontend URL
2. Redeploy backend after changing environment variables
3. Clear browser cache

### Issue: "Function timeout"
**Solution**:
- Free tier has 10s timeout
- Optimize slow queries
- Consider upgrading to Pro for 60s timeout

### Issue: "Database sleeps"
**Solution**:
- Neon free tier sleeps after 5 min inactivity
- First request after sleep takes ~1-2 seconds
- Upgrade to Pro for always-on database

---

## 📈 Monitoring

### Vercel Analytics (Free)
1. Go to your project on Vercel
2. Click "Analytics"
3. View real-time traffic and performance

### Neon Monitoring (Free)
1. Go to Neon dashboard
2. Click your database
3. View queries, connections, storage

### Upstash Monitoring (Free)
1. Go to Upstash dashboard
2. Click your database
3. View commands, latency, storage

---

## 🎯 Next Steps

1. ✅ **Customize branding**
   - Update logo and colors
   - Add your clinic name

2. ✅ **Add users**
   - Create doctor accounts
   - Add staff members

3. ✅ **Configure features**
   - Enable AI (add OpenAI key)
   - Enable video calls (add Agora credentials)

4. ✅ **Custom domain** (optional)
   - Add your domain in Vercel
   - Configure DNS

5. ✅ **Go live!**
   - Share with your team
   - Start using the system

---

## 📞 Support

**Issues?**
- GitHub Issues: https://github.com/vaibhaviimcal-web/medicore-emr-v2/issues
- Documentation: See README.md

**Need help?**
- Check DEPLOYMENT_INSTRUCTIONS.md
- Review DEPLOYMENT.md for advanced options

---

## 🎉 Congratulations!

Your MediCore EMR v2 is now deployed and running on 100% free tier!

**Your URLs:**
- Frontend: `https://medicore-emr-v2.vercel.app`
- Backend: `https://medicore-backend.vercel.app`
- Health: `https://medicore-backend.vercel.app/health`

**Demo Login:**
```
Email: doctor@medicore.com
Password: demo123456
```

---

**Built with ❤️ for Healthcare Professionals**

**Total Cost: $0/month** 🎉
