# ⚡ Quick Deploy - MediCore EMR v2 (5 Minutes)

## 🎯 Fastest Way to Deploy (100% Free)

Follow these exact steps to deploy in 5 minutes:

---

## Step 1: Setup Database (2 min)

### Neon PostgreSQL (Free)
1. Go to: https://neon.tech
2. Click "Sign Up" → Sign in with GitHub
3. Click "Create Project"
4. Name: `medicore-emr`
5. Click "Create Project"
6. **COPY** the connection string shown
7. **SAVE IT** - looks like: `postgresql://user:pass@ep-xxx.neon.tech/neondb`

### Upstash Redis (Free)
1. Go to: https://upstash.com
2. Click "Sign Up" → Sign in with GitHub
3. Click "Create Database"
4. Name: `medicore-redis`
5. Region: Choose closest
6. Click "Create"
7. **COPY** the REST URL
8. **SAVE IT** - looks like: `https://xxx.upstash.io`

---

## Step 2: Deploy Backend (2 min)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/vaibhaviimcal-web/medicore-emr-v2`
4. Click "Import"

**Configure:**
- Project Name: `medicore-backend`
- Framework: Other
- Root Directory: `backend`
- Build Command: `npm install && npx prisma generate && npm run build`

**Environment Variables** (click "Add"):
```
DATABASE_URL = [paste your Neon connection string]?sslmode=require
REDIS_URL = [paste your Upstash URL]
JWT_SECRET = medicore-secret-key-change-this-in-production-32chars
FRONTEND_URL = https://medicore-emr-v2.vercel.app
NODE_ENV = production
```

5. Click "Deploy"
6. Wait 2 minutes
7. **COPY** your backend URL (e.g., `https://medicore-backend.vercel.app`)

---

## Step 3: Deploy Frontend (1 min)

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Paste: `https://github.com/vaibhaviimcal-web/medicore-emr-v2`
4. Click "Import"

**Configure:**
- Project Name: `medicore-emr-v2`
- Framework: Next.js
- Root Directory: `frontend`

**Environment Variables:**
```
NEXT_PUBLIC_API_URL = [paste your backend URL from Step 2]
```

5. Click "Deploy"
6. Wait 2 minutes
7. **DONE!** 🎉

---

## ✅ Your App is Live!

**Frontend**: `https://medicore-emr-v2.vercel.app`
**Backend**: `https://medicore-backend.vercel.app`

---

## 🧪 Test It Now

### 1. Check Health
Open: `https://medicore-backend.vercel.app/health`

Should see:
```json
{"status": "healthy", ...}
```

### 2. Create First User

**Using curl:**
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

**Or use this online tool:**
1. Go to: https://reqbin.com
2. Method: POST
3. URL: `https://medicore-backend.vercel.app/api/auth/register`
4. Headers: `Content-Type: application/json`
5. Body:
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
6. Click "Send"

### 3. Login
1. Go to: `https://medicore-emr-v2.vercel.app/login`
2. Email: `doctor@medicore.com`
3. Password: `demo123456`
4. Click "Sign In"
5. **You're in!** 🎉

---

## 🎯 What You Get (Free)

✅ Full EMR system
✅ Patient management
✅ Appointments
✅ Prescriptions
✅ Billing
✅ Analytics dashboard
✅ Telemedicine (video calls)*
✅ AI features (GPT-4)*
✅ HTTPS/SSL
✅ Custom domain support
✅ Automatic backups

*Requires additional API keys (optional)

---

## 💰 Cost Breakdown

**Vercel**: $0/month (Free tier)
**Neon**: $0/month (Free 500MB)
**Upstash**: $0/month (Free 10K commands/day)

**Total**: **$0/month** 🎉

---

## 📊 Free Tier Limits

**Good for:**
- ✅ 1-5 doctors
- ✅ Up to 100 patients
- ✅ 1,000 appointments/month
- ✅ Testing & demos
- ✅ Small clinics

**Limits:**
- ⚠️ Database: 500MB storage
- ⚠️ Redis: 10K commands/day
- ⚠️ Serverless: 100 executions/day

---

## 🚀 Optional: Add AI Features

### OpenAI (for clinical suggestions)
1. Go to: https://platform.openai.com/api-keys
2. Create API key
3. Add to backend env vars:
```
OPENAI_API_KEY = sk-your-key
```
4. Redeploy backend

**Cost**: ~$0.002 per request (~$5-10/month)

### Agora (for video calls)
1. Go to: https://www.agora.io
2. Sign up (free 10,000 min/month)
3. Create project
4. Get App ID and Certificate
5. Add to backend env vars:
```
AGORA_APP_ID = your-app-id
AGORA_APP_CERTIFICATE = your-certificate
```
6. Redeploy backend

**Cost**: Free (10,000 minutes/month)

---

## 🔧 Troubleshooting

**Issue**: Can't login
- Make sure you created a user first (Step 3.2)
- Check backend logs in Vercel

**Issue**: Database error
- Verify DATABASE_URL has `?sslmode=require` at end
- Check Neon database is active

**Issue**: CORS error
- Update FRONTEND_URL in backend env vars
- Redeploy backend

---

## 📞 Need Help?

**Documentation:**
- Full guide: `FREE_TIER_DEPLOYMENT.md`
- Advanced: `DEPLOYMENT_INSTRUCTIONS.md`

**Support:**
- GitHub Issues: https://github.com/vaibhaviimcal-web/medicore-emr-v2/issues

---

## 🎉 You're Done!

Your enterprise-level EMR system is now live and running completely free!

**Share your deployment:**
- Frontend: `https://medicore-emr-v2.vercel.app`
- Give access to your team
- Start managing patients!

---

**Deployment Time**: ~5 minutes
**Total Cost**: $0/month
**Features**: Enterprise-level EMR

**Built with ❤️ for Healthcare Professionals**
