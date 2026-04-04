# Kuraz AI - Deployment Guide

## Overview

This guide covers deploying the Kuraz AI Revenue Management System to production. The application consists of:
- **Frontend**: Next.js 14 (App Router) with TypeScript
- **Backend**: FastAPI Python server
- **Database**: PostgreSQL (recommended for production)

---

## Prerequisites

- Node.js 18+ and npm/pnpm
- Python 3.9+
- PostgreSQL database (or SQLite for testing)
- Docker (optional, for containerized deployment)

---

## Deployment Options

### Option 1: Vercel (Frontend) + Railway/Render (Backend)

#### Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Environment Variables**
   Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

5. **Production Deploy**
   ```bash
   vercel --prod
   ```

#### Backend Deployment (Railway)

1. **Create Railway Account**: https://railway.app

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

3. **Login**
   ```bash
   railway login
   ```

4. **Initialize Project**
   ```bash
   cd backend
   railway init
   ```

5. **Add PostgreSQL**
   - Go to Railway Dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the connection string

6. **Set Environment Variables**
   ```bash
   railway variables set DATABASE_URL="postgresql://..."
   railway variables set SECRET_KEY="your-secret-key"
   ```

7. **Deploy**
   ```bash
   railway up
   ```

---

### Option 2: Docker Deployment

#### Build Docker Images

1. **Frontend Dockerfile** (already exists)
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Backend Dockerfile** (create if not exists)
   ```dockerfile
   FROM python:3.11-slim
   
   WORKDIR /app
   
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt
   
   COPY . .
   
   EXPOSE 8000
   
   CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Docker Compose** (create docker-compose.yml)
   ```yaml
   version: '3.8'
   
   services:
     frontend:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NEXT_PUBLIC_API_URL=http://backend:8000
       depends_on:
         - backend
   
     backend:
       build: ./backend
       ports:
         - "8000:8000"
       environment:
         - DATABASE_URL=postgresql://user:password@db:5432/kuraz
       depends_on:
         - db
   
     db:
       image: postgres:15
       environment:
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=password
         - POSTGRES_DB=kuraz
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

4. **Deploy with Docker Compose**
   ```bash
   docker-compose up -d
   ```

---

### Option 3: AWS Deployment

#### Frontend (AWS Amplify)

1. **Connect Repository**
   - Go to AWS Amplify Console
   - Click "New App" → "Host web app"
   - Connect your GitHub/GitLab repository

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-gateway-url
   ```

#### Backend (AWS ECS + Fargate)

1. **Create ECR Repository**
   ```bash
   aws ecr create-repository --repository-name kuraz-backend
   ```

2. **Build and Push Docker Image**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   docker build -t kuraz-backend ./backend
   docker tag kuraz-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/kuraz-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/kuraz-backend:latest
   ```

3. **Create ECS Cluster and Service**
   - Use AWS Console or Terraform
   - Configure RDS PostgreSQL database
   - Set up Application Load Balancer
   - Configure environment variables

---

### Option 4: DigitalOcean App Platform

1. **Create Account**: https://digitalocean.com

2. **Create App**
   - Click "Create" → "Apps"
   - Connect GitHub repository

3. **Configure Components**

   **Frontend:**
   - Type: Web Service
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 3000

   **Backend:**
   - Type: Web Service
   - Build Command: `pip install -r requirements.txt`
   - Run Command: `uvicorn main:app --host 0.0.0.0 --port 8000`
   - Port: 8000

4. **Add Database**
   - Click "Add Resource" → "Database"
   - Select PostgreSQL
   - Connect to backend service

5. **Environment Variables**
   - Set `NEXT_PUBLIC_API_URL` for frontend
   - Set `DATABASE_URL` for backend

---

## Environment Variables

### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.kuraz-ai.com
```

### Backend
```env
DATABASE_URL=postgresql://user:password@host:5432/kuraz
SECRET_KEY=your-super-secret-key-change-this
CORS_ORIGINS=https://kuraz-ai.com,https://www.kuraz-ai.com
GEMINI_API_KEY=your-gemini-api-key
```

---

## Pre-Deployment Checklist

- [ ] Update API URLs in frontend
- [ ] Set secure SECRET_KEY for backend
- [ ] Configure CORS origins
- [ ] Set up PostgreSQL database
- [ ] Run database migrations
- [ ] Seed initial data
- [ ] Test API endpoints
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up backup strategy
- [ ] Configure rate limiting
- [ ] Review security headers

---

## Database Setup

### PostgreSQL Production Setup

1. **Create Database**
   ```sql
   CREATE DATABASE kuraz;
   CREATE USER kuraz_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE kuraz TO kuraz_user;
   ```

2. **Run Migrations**
   ```bash
   cd backend
   alembic upgrade head
   ```

3. **Seed Data**
   ```bash
   python seed_data.py
   ```

---

## Performance Optimization

### Frontend

1. **Enable Next.js Optimizations**
   ```javascript
   // next.config.mjs
   export default {
     output: 'standalone',
     compress: true,
     images: {
       domains: ['your-cdn.com'],
       formats: ['image/avif', 'image/webp'],
     },
   };
   ```

2. **Configure CDN**
   - Use Cloudflare or AWS CloudFront
   - Cache static assets
   - Enable HTTP/2

### Backend

1. **Enable Caching**
   ```python
   from fastapi_cache import FastAPICache
   from fastapi_cache.backends.redis import RedisBackend
   
   @app.on_event("startup")
   async def startup():
       redis = aioredis.from_url("redis://localhost")
       FastAPICache.init(RedisBackend(redis), prefix="kuraz-cache")
   ```

2. **Database Connection Pooling**
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=20,
       max_overflow=0,
       pool_pre_ping=True
   )
   ```

---

## Monitoring & Logging

### Frontend Monitoring

1. **Vercel Analytics** (if using Vercel)
   ```bash
   npm install @vercel/analytics
   ```

2. **Sentry**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

### Backend Monitoring

1. **Sentry**
   ```python
   import sentry_sdk
   
   sentry_sdk.init(
       dsn="your-sentry-dsn",
       traces_sample_rate=1.0,
   )
   ```

2. **Logging**
   ```python
   import logging
   
   logging.basicConfig(
       level=logging.INFO,
       format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
   )
   ```

---

## Security Considerations

1. **HTTPS Only**
   - Force HTTPS redirects
   - Use HSTS headers

2. **Environment Variables**
   - Never commit secrets to git
   - Use secret management services

3. **CORS Configuration**
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://kuraz-ai.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Rate Limiting**
   ```python
   from slowapi import Limiter
   
   limiter = Limiter(key_func=get_remote_address)
   app.state.limiter = limiter
   ```

---

## Backup Strategy

1. **Database Backups**
   ```bash
   # Daily automated backups
   pg_dump kuraz > backup_$(date +%Y%m%d).sql
   ```

2. **File Storage Backups**
   - Use S3 versioning
   - Configure lifecycle policies

---

## Rollback Plan

1. **Vercel**
   ```bash
   vercel rollback
   ```

2. **Docker**
   ```bash
   docker-compose down
   docker-compose up -d --build <previous-version>
   ```

---

## Support & Maintenance

- Monitor error rates daily
- Review performance metrics weekly
- Update dependencies monthly
- Security audits quarterly

---

## Quick Deploy Commands

### Development
```bash
# Frontend
npm run dev

# Backend
cd backend && uvicorn main:app --reload
```

### Production
```bash
# Frontend
npm run build && npm start

# Backend
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Docker
```bash
docker-compose up -d
```

---

## Troubleshooting

### Frontend Issues
- Check browser console for errors
- Verify API URL is correct
- Check network tab for failed requests

### Backend Issues
- Check logs: `docker logs <container-id>`
- Verify database connection
- Check environment variables

### Database Issues
- Verify connection string
- Check database permissions
- Review migration status

---

## Additional Resources

- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [PostgreSQL Best Practices](https://wiki.postgresql.org/wiki/Don%27t_Do_This)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
