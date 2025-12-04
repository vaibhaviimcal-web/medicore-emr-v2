# MediCore EMR v2 - Deployment Instructions

## 🚀 Quick Deploy Options

### Option 1: Vercel (Recommended for Frontend)

#### Deploy Frontend to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy frontend
cd frontend
vercel --prod
```

**Environment Variables to Set in Vercel:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

#### Deploy Backend to Vercel
```bash
cd backend
vercel --prod
```

**Environment Variables to Set:**
```
DATABASE_URL=postgresql://user:pass@host:5432/medicore_emr
MONGODB_URI=mongodb://host:27017/medicore_emr
REDIS_URL=redis://host:6379
JWT_SECRET=your-secret-key
OPENAI_API_KEY=your-openai-key
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate
```

### Option 2: Railway (Full Stack)

#### Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Add Services:**
1. PostgreSQL Database
2. Redis
3. Frontend Service
4. Backend Service

### Option 3: Render (Free Tier Available)

#### Deploy Backend
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo: `medicore-emr-v2`
4. Root Directory: `backend`
5. Build Command: `npm install && npx prisma generate && npm run build`
6. Start Command: `npm start`

#### Deploy Frontend
1. New → Static Site
2. Connect GitHub repo: `medicore-emr-v2`
3. Root Directory: `frontend`
4. Build Command: `npm install && npm run build`
5. Publish Directory: `.next`

### Option 4: Docker Compose (Self-Hosted)

```bash
# Clone repository
git clone https://github.com/vaibhaviimcal-web/medicore-emr-v2.git
cd medicore-emr-v2

# Setup environment
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services Started:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

### Option 5: AWS (Production)

#### Prerequisites
- AWS Account
- AWS CLI configured
- Terraform installed

#### Deploy
```bash
cd infrastructure/terraform/aws

# Initialize
terraform init

# Plan
terraform plan

# Deploy
terraform apply

# Get outputs
terraform output
```

**Services Deployed:**
- ECS Fargate (Frontend & Backend)
- RDS PostgreSQL
- DocumentDB (MongoDB)
- ElastiCache (Redis)
- S3 (File Storage)
- CloudFront (CDN)
- Route53 (DNS)

### Option 6: DigitalOcean App Platform

1. Go to https://cloud.digitalocean.com/apps
2. Create App → GitHub
3. Select repository: `medicore-emr-v2`
4. Configure components:
   - **Frontend**: Next.js app from `/frontend`
   - **Backend**: Node.js app from `/backend`
5. Add databases:
   - PostgreSQL
   - Redis
6. Set environment variables
7. Deploy

## 🔧 Required Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

### Backend (.env)
```env
# Application
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/medicore_emr
MONGODB_URI=mongodb://host:27017/medicore_emr
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key

# Video (Agora)
AGORA_APP_ID=your-agora-app-id
AGORA_APP_CERTIFICATE=your-agora-certificate

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloud Storage (Optional)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=ap-south-1
AWS_S3_BUCKET=medicore-emr-files
```

## 📊 Database Setup

### PostgreSQL (Required)

**Option 1: Managed Service**
- Vercel Postgres
- Railway PostgreSQL
- Render PostgreSQL
- AWS RDS
- DigitalOcean Managed Database

**Option 2: Self-Hosted**
```bash
# Using Docker
docker run -d \
  --name medicore-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=medicore_emr \
  -p 5432:5432 \
  postgres:15
```

**Run Migrations:**
```bash
cd backend
npx prisma migrate deploy
```

### Redis (Required for Sessions)

**Option 1: Managed Service**
- Upstash Redis (Free tier)
- Railway Redis
- AWS ElastiCache
- DigitalOcean Managed Redis

**Option 2: Self-Hosted**
```bash
docker run -d \
  --name medicore-redis \
  -p 6379:6379 \
  redis:7-alpine
```

## 🔐 SSL/TLS Setup

### Using Vercel/Render/Railway
- Automatic SSL certificates
- No configuration needed

### Using Custom Domain
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## 🎯 Post-Deployment Checklist

- [ ] Frontend accessible at your domain
- [ ] Backend API responding at /health
- [ ] Database connected (check logs)
- [ ] Redis connected (check logs)
- [ ] Environment variables set
- [ ] SSL certificate active
- [ ] DNS configured
- [ ] CORS configured correctly
- [ ] Test login functionality
- [ ] Test patient creation
- [ ] Test AI features (if OpenAI key set)
- [ ] Test video call (if Agora configured)

## 🧪 Testing Deployment

```bash
# Test health endpoint
curl https://api.your-domain.com/health

# Test login
curl -X POST https://api.your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@medicore.com","password":"demo123456"}'

# Test frontend
open https://your-domain.com
```

## 📈 Monitoring

### Recommended Tools
- **Vercel Analytics** - Built-in for Vercel deployments
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **New Relic** - APM
- **DataDog** - Infrastructure monitoring

### Setup Sentry
```bash
npm install @sentry/nextjs @sentry/node

# Add to frontend/sentry.config.js
# Add to backend/src/utils/sentry.ts
```

## 🔄 CI/CD

GitHub Actions pipeline is already configured at `.github/workflows/ci-cd.yml`

**Automatic Deployment:**
- Push to `main` → Deploy to production
- Push to `develop` → Deploy to staging
- Pull requests → Run tests

## 💰 Cost Estimates

### Free Tier Options
- **Vercel**: Free for hobby projects
- **Render**: Free tier available
- **Railway**: $5 credit/month
- **Supabase**: Free PostgreSQL

### Production (Monthly)
- **Vercel Pro**: $20/month
- **Railway**: ~$20-50/month
- **AWS**: ~$50-200/month
- **DigitalOcean**: ~$30-100/month

## 🆘 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules .next
npm install
npm run build
```

### Database Connection Error
- Check DATABASE_URL format
- Verify database is accessible
- Check firewall rules
- Verify credentials

### API Not Responding
- Check backend logs
- Verify environment variables
- Check CORS configuration
- Verify port is open

## 📞 Support

- **Documentation**: See README.md
- **Issues**: https://github.com/vaibhaviimcal-web/medicore-emr-v2/issues
- **Deployment Help**: Create an issue with "deployment" label

---

**🎉 Your MediCore EMR is ready to deploy!**

Choose the option that best fits your needs and follow the instructions above.
