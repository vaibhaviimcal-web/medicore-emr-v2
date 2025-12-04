# MediCore EMR - Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 7
- Docker (optional)

### 1. Clone Repository
```bash
git clone https://github.com/vaibhaviimcal-web/medicore-emr-v2.git
cd medicore-emr-v2
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Setup Environment Variables
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 4. Setup Database
```bash
# Run PostgreSQL migrations
cd backend
npm run prisma:generate
npm run migrate:dev

# Seed database (optional)
npm run seed
```

### 5. Start Development Servers
```bash
# From root directory
npm run dev

# Or start individually:
# Frontend: cd frontend && npm run dev
# Backend: cd backend && npm run dev
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/health

## Docker Deployment

### Using Docker Compose
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- MongoDB: localhost:27017
- Redis: localhost:6379

## Production Deployment

### Option 1: AWS Deployment

#### Prerequisites
- AWS Account
- AWS CLI configured
- Terraform installed

#### Steps
```bash
cd infrastructure/terraform/aws

# Initialize Terraform
terraform init

# Plan deployment
terraform plan

# Deploy
terraform apply

# Get outputs
terraform output
```

#### Services Deployed
- **ECS Fargate**: Frontend & Backend containers
- **RDS PostgreSQL**: Primary database
- **DocumentDB**: MongoDB-compatible database
- **ElastiCache Redis**: Caching layer
- **S3**: File storage
- **CloudFront**: CDN
- **Route53**: DNS management
- **ALB**: Load balancing
- **CloudWatch**: Monitoring & logs

### Option 2: Azure Deployment

```bash
cd infrastructure/terraform/azure

terraform init
terraform plan
terraform apply
```

#### Services Deployed
- **App Service**: Frontend & Backend
- **Azure Database for PostgreSQL**: Primary database
- **Cosmos DB**: MongoDB API
- **Azure Cache for Redis**: Caching
- **Blob Storage**: File storage
- **Azure CDN**: Content delivery
- **Application Insights**: Monitoring

### Option 3: GCP Deployment

```bash
cd infrastructure/terraform/gcp

terraform init
terraform plan
terraform apply
```

#### Services Deployed
- **Cloud Run**: Containerized apps
- **Cloud SQL**: PostgreSQL database
- **Firestore**: NoSQL database
- **Memorystore**: Redis caching
- **Cloud Storage**: File storage
- **Cloud CDN**: Content delivery
- **Cloud Monitoring**: Observability

### Option 4: Kubernetes Deployment

```bash
# Build Docker images
docker build -t medicore-frontend:latest ./frontend
docker build -t medicore-backend:latest ./backend

# Push to registry
docker push your-registry/medicore-frontend:latest
docker push your-registry/medicore-backend:latest

# Deploy to Kubernetes
kubectl apply -f infrastructure/kubernetes/

# Check deployment
kubectl get pods
kubectl get services
```

## Environment Variables

### Required Variables
```env
# Application
NODE_ENV=production
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Database
DATABASE_URL=postgresql://user:pass@host:5432/medicore_emr
MONGODB_URI=mongodb://host:27017/medicore_emr
REDIS_URL=redis://host:6379

# Authentication
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Cloud Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=medicore-emr-files

# AI Services
OPENAI_API_KEY=your-openai-api-key
```

## SSL/TLS Configuration

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot

# Get certificate
sudo certbot certonly --standalone -d your-domain.com -d api.your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Migrations

### Running Migrations
```bash
cd backend

# Development
npm run migrate:dev

# Production
npm run migrate
```

### Creating New Migration
```bash
# Make changes to schema.prisma
# Then run:
npx prisma migrate dev --name your_migration_name
```

## Monitoring & Logging

### Application Logs
```bash
# View backend logs
cd backend
tail -f logs/app.log

# View with Docker
docker-compose logs -f backend
```

### Health Checks
- Backend: `GET /health`
- Database: Check connection in logs
- Redis: Check connection in logs

### Monitoring Tools
- **Sentry**: Error tracking
- **New Relic**: APM
- **DataDog**: Infrastructure monitoring
- **CloudWatch/Azure Monitor/Stackdriver**: Cloud-native monitoring

## Backup & Recovery

### Database Backup
```bash
# PostgreSQL backup
pg_dump -h localhost -U postgres medicore_emr > backup_$(date +%Y%m%d).sql

# Restore
psql -h localhost -U postgres medicore_emr < backup_20250104.sql
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## Performance Optimization

### Frontend
- Enable Next.js production build
- Configure CDN for static assets
- Enable image optimization
- Implement code splitting

### Backend
- Enable Redis caching
- Configure database connection pooling
- Implement rate limiting
- Enable compression

### Database
- Create appropriate indexes
- Configure query optimization
- Set up read replicas
- Enable connection pooling

## Security Checklist

- [ ] SSL/TLS certificates configured
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Helmet.js security headers
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Regular security audits
- [ ] Dependency updates

## Scaling

### Horizontal Scaling
```bash
# Kubernetes
kubectl scale deployment medicore-backend --replicas=5

# Docker Swarm
docker service scale medicore-backend=5
```

### Vertical Scaling
- Increase container resources
- Upgrade database instance
- Increase Redis memory

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection string
echo $DATABASE_URL
```

**Redis Connection Failed**
```bash
# Check Redis is running
sudo systemctl status redis

# Test connection
redis-cli ping
```

**Port Already in Use**
```bash
# Find process using port
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

## Support

- Documentation: https://docs.medicore-emr.com
- Email: support@medicore-emr.com
- GitHub Issues: https://github.com/vaibhaviimcal-web/medicore-emr-v2/issues

---

**Last Updated**: December 2025
