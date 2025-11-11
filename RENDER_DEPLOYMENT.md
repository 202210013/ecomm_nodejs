# Render Deployment Guide

## The Problem
Your Node.js backend is trying to connect to `localhost:3306` (local MySQL), but Render doesn't have access to your local database.

## Solutions

### Option 1: Use PlanetScale (Recommended - Free MySQL)

1. **Create PlanetScale Account**
   - Go to https://planetscale.com
   - Sign up for free account
   - Create a new database (e.g., "ecomm-db")

2. **Get Connection Details**
   - Click "Connect"
   - Select "Node.js" or "General"
   - Copy the connection string or individual credentials:
     - Host: `xxx.connect.psdb.cloud`
     - Username: `xxxxxxxxxx`
     - Password: `pscale_pw_xxxxx`
     - Database: `ecomm-db`
     - Port: `3306`
     - SSL: Required

3. **Update Render Environment Variables**
   - Go to your Render dashboard
   - Select your web service
   - Go to "Environment" tab
   - Add these variables:
     ```
     DB_HOST=xxx.connect.psdb.cloud
     DB_PORT=3306
     DB_NAME=ecomm-db
     DB_USER=xxxxxxxxxx
     DB_PASSWORD=pscale_pw_xxxxx
     DB_SSL=true
     NODE_ENV=production
     PORT=3000
     JWT_SECRET=your-production-jwt-secret-here
     SESSION_SECRET=your-production-session-secret-here
     ALLOWED_ORIGINS=https://localfit.store,https://api.localfit.store
     ```

### Option 2: Use Railway (Has MySQL)

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up
   - Create new project
   - Add MySQL database

2. **Get Connection Details** from Railway dashboard

3. **Update Render Environment Variables** (same as above)

### Option 3: Use Aiven (Free Tier Available)

1. Go to https://aiven.io
2. Create free MySQL database
3. Get connection details
4. Update Render environment variables

### Option 4: Use PostgreSQL Instead

If you're open to switching from MySQL to PostgreSQL:

1. **In Render Dashboard**
   - Create a PostgreSQL database (Render provides this)
   - Get connection string

2. **Update Your Code**
   - Install: `npm install pg`
   - Update `config/database.js` to use PostgreSQL
   - Slightly modify queries (MySQL → PostgreSQL syntax differences)

## After Setting Up Database

1. **Import Your Database Schema**
   - Export your local database: 
     ```bash
     mysqldump -u root e-comm > schema.sql
     ```
   - Import to remote database (method varies by provider)

2. **Test Connection Locally First**
   - Update your `.env` file with the remote database credentials
   - Run: `node server.js`
   - Verify connection works

3. **Deploy to Render**
   - Commit and push changes:
     ```bash
     git add .
     git commit -m "Add SSL support for production database"
     git push origin main
     ```
   - Render will auto-deploy

## Environment Variables Needed in Render

```
NODE_ENV=production
PORT=3000

# Database (from your chosen provider)
DB_HOST=your-db-host
DB_PORT=3306
DB_NAME=e-comm
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_SSL=true

# Security
JWT_SECRET=change-this-to-random-secret
SESSION_SECRET=change-this-to-random-secret

# CORS
ALLOWED_ORIGINS=https://localfit.store,https://api.localfit.store,http://localhost:4200

# WebSocket
WS_PORT=3002
```

## Quick Start: PlanetScale (Easiest)

1. Create account at https://planetscale.com
2. Create database: "ecomm-db"
3. Get connection details
4. Add to Render environment variables
5. Redeploy

## Common Issues

### "SSL connection error"
- Set `DB_SSL=true` in environment variables

### "Access denied"
- Double-check username and password
- Ensure IP whitelist allows connections (PlanetScale/Railway/Aiven settings)

### "Unknown database"
- Create the database first
- Import your schema

### "Too many connections"
- Adjust `connectionLimit` in `database.js`

## Local Development vs Production

Keep your `.env` file for local development:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
```

Render uses environment variables set in dashboard (not `.env` file).

## Need Help?

1. Check Render logs: Dashboard → Your Service → Logs
2. Test database connection separately
3. Verify all environment variables are set correctly
