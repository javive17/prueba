# Deployment Guide

This guide covers deployment options for the Utility Billing Web Application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Self-Hosted Deployment](#self-hosted-deployment)
3. [Web-Hosted Deployment](#web-hosted-deployment)
4. [Docker Installation](#docker-installation)

---

## Prerequisites

### Minimum System Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 core | 2+ cores |
| RAM | 1 GB | 2+ GB |
| Storage | 5 GB | 20+ GB |
| Node.js | 18.x | 20.x LTS |

### Required Software

- Node.js 18.x or higher
- npm 9.x or higher (comes with Node.js)
- Git (for cloning the repository)

### Environment Variables

Create a `.env` file in the root directory with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Production database (PostgreSQL)
# DATABASE_URL="postgresql://user:password@localhost:5432/utility_billing"
```

---

## Self-Hosted Deployment

### Requirements

| Component | Version/Specification |
|-----------|----------------------|
| Operating System | Ubuntu 20.04+, Debian 11+, CentOS 8+, or Windows Server 2019+ |
| Node.js | 18.x or 20.x LTS |
| Process Manager | PM2 (recommended) |
| Reverse Proxy | Nginx or Apache (recommended) |
| SSL Certificate | Let's Encrypt (recommended) |
| Database | SQLite (default) or PostgreSQL 14+ |

### Step-by-Step Installation

#### 1. Install Node.js

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**CentOS/RHEL:**
```bash
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
```

**Windows:**
Download and install from https://nodejs.org/

#### 2. Clone and Setup Application

```bash
# Clone the repository
git clone <your-repo-url>
cd utility-billing-app

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Generate Prisma client and setup database
npx prisma generate
npx prisma db push

# Seed database (optional)
npm run db:seed

# Build for production
npm run build
```

#### 3. Install PM2 Process Manager

```bash
sudo npm install -g pm2

# Start the application
pm2 start npm --name "utility-billing" -- start

# Enable startup on boot
pm2 startup
pm2 save
```

#### 4. Configure Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/utility-billing
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/utility-billing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

#### 6. PostgreSQL Setup (Optional - for production)

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE utility_billing;
CREATE USER billing_user WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE utility_billing TO billing_user;
\q

# Update .env
DATABASE_URL="postgresql://billing_user:your-password@localhost:5432/utility_billing"

# Re-run Prisma setup
npx prisma db push
```

---

## Web-Hosted Deployment

### Supported Platforms

| Platform | Database Support | Free Tier |
|----------|-----------------|-----------|
| Vercel | PostgreSQL (Vercel Postgres) | Yes |
| Netlify | External DB required | Yes |
| Railway | PostgreSQL, MySQL | Yes (limited) |
| Render | PostgreSQL | Yes |
| DigitalOcean App Platform | PostgreSQL | No |
| AWS Amplify | RDS PostgreSQL | Free tier |

### Vercel Deployment (Recommended)

#### Requirements
- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- Vercel Postgres or external PostgreSQL database

#### Steps

1. **Push to GitHub**
```bash
git remote add origin https://github.com/your-username/utility-billing-app.git
git push -u origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     ```
     DATABASE_URL=your-postgres-connection-string
     NEXTAUTH_SECRET=your-secret-key
     NEXTAUTH_URL=https://your-app.vercel.app
     ```

3. **Setup Vercel Postgres**
   - Go to your project dashboard
   - Click "Storage" → "Create Database" → "Postgres"
   - Copy the connection string to DATABASE_URL

4. **Deploy**
   - Vercel will automatically build and deploy
   - Run database migrations via Vercel CLI:
     ```bash
     npm i -g vercel
     vercel env pull
     npx prisma db push
     ```

### Railway Deployment

#### Requirements
- GitHub account
- Railway account

#### Steps

1. **Create Railway Project**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Add PostgreSQL**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the DATABASE_URL from the PostgreSQL service

3. **Configure Environment Variables**
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.up.railway.app
   ```

4. **Deploy**
   - Railway will automatically detect Next.js and deploy
   - Run: `railway run npx prisma db push`

### Render Deployment

#### Requirements
- GitHub account
- Render account

#### Steps

1. **Create Web Service**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your repository

2. **Configure Service**
   ```
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

3. **Add PostgreSQL**
   - Click "New" → "PostgreSQL"
   - Copy the Internal Database URL

4. **Environment Variables**
   ```
   DATABASE_URL=your-internal-postgres-url
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-app.onrender.com
   ```

---

## Docker Installation

### Requirements

| Component | Version |
|-----------|---------|
| Docker | 20.10+ |
| Docker Compose | 2.0+ |
| RAM | 2 GB minimum |
| Storage | 10 GB minimum |

### Docker Files

#### Dockerfile

Create `Dockerfile` in the project root:

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/utility_billing
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-your-secret-key-change-in-production}
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
    depends_on:
      db:
        condition: service_healthy
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=utility_billing
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # Optional: Database admin interface
  adminer:
    image: adminer
    ports:
      - "8080:8080"
    depends_on:
      - db
    restart: unless-stopped

volumes:
  postgres_data:
```

#### docker-compose.prod.yml (Production)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@db:5432/utility_billing
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      db:
        condition: service_healthy
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G

  db:
    image: postgres:15-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backups:/backups
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=utility_billing
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - app
    restart: always

volumes:
  postgres_data:
```

### Quick Start Commands

#### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Run database migrations
docker-compose exec app npx prisma db push

# Seed database
docker-compose exec app npm run db:seed

# Stop services
docker-compose down
```

#### Production
```bash
# Create .env file
cat > .env << EOF
DB_PASSWORD=your-secure-password
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://your-domain.com
EOF

# Build and start
docker-compose -f docker-compose.prod.yml up -d --build

# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma db push

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Docker with SQLite (Simpler Setup)

```yaml
# docker-compose.sqlite.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - sqlite_data:/app/prisma
    environment:
      - DATABASE_URL=file:/app/prisma/prod.db
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-change-me}
      - NEXTAUTH_URL=${NEXTAUTH_URL:-http://localhost:3000}
    restart: unless-stopped

volumes:
  sqlite_data:
```

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run (`npx prisma db push`)
- [ ] Database seeded (optional: `npm run db:seed`)
- [ ] SSL certificate installed (production)
- [ ] Firewall configured (ports 80, 443, 3000)
- [ ] Backup strategy implemented
- [ ] Monitoring setup (optional)
- [ ] Test login with demo credentials

## Default Credentials

After seeding the database:
- **Email**: admin@example.com
- **Password**: password123

**Important**: Change the default password immediately after first login in production!

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Database connection failed | Check DATABASE_URL format and credentials |
| Prisma client not found | Run `npx prisma generate` |
| Port already in use | Change port in docker-compose or use different port |
| Build fails | Clear `.next` folder and rebuild |
| Auth not working | Verify NEXTAUTH_SECRET and NEXTAUTH_URL |

### Logs

```bash
# Docker logs
docker-compose logs -f app

# PM2 logs
pm2 logs utility-billing

# Next.js logs (self-hosted)
tail -f ~/.pm2/logs/utility-billing-out.log
```
