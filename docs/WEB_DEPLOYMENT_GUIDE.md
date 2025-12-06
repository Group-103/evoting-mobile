# Web Frontend Deployment Guide
**E-Voting System - Deployment Instructions**

---

## Overview

This guide covers deploying the E-Voting web frontend to:
1. **GitHub Pages** (Static hosting - Free)
2. **Render** (Full-stack hosting - Free tier)

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- GitHub account
- Render account (for Render deployment)

---

## Option 1: GitHub Pages Deployment

### Step 1: Prepare the Frontend

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update API URL for production:
   - Edit `src/config/api.ts` or `src/services/api.ts`
   - Change API URL to your deployed backend URL:
   ```typescript
   const API_URL = 'https://your-backend.onrender.com/api';
   ```

### Step 2: Build for Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. This creates a `dist` folder with optimized production files

### Step 3: Deploy to GitHub Pages

**Method A: Using gh-pages package (Recommended)**

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Add deployment script to `package.json`:
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. Update `vite.config.ts` to set base path:
   ```typescript
   export default defineConfig({
     base: '/evoting-frontend/',  // Replace with your repo name
     plugins: [react()],
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

5. Enable GitHub Pages:
   - Go to your GitHub repository
   - Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/root`
   - Save

6. Access your site at:
   ```
   https://yourusername.github.io/evoting-frontend/
   ```

**Method B: Manual Deployment**

1. Build the project:
   ```bash
   npm run build
   ```

2. Create a new branch:
   ```bash
   git checkout --orphan gh-pages
   ```

3. Remove all files except dist:
   ```bash
   git rm -rf .
   ```

4. Copy dist contents to root:
   ```bash
   cp -r dist/* .
   rm -rf dist
   ```

5. Commit and push:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin gh-pages --force
   ```

6. Enable GitHub Pages (same as Method A, step 5)

---

## Option 2: Render Deployment

### Step 1: Prepare for Render

1. Ensure `server.cjs` exists in frontend root (already present)

2. Verify `package.json` has start script:
   ```json
   {
     "scripts": {
       "start": "node server.cjs"
     }
   }
   ```

3. Update API URL in code to use environment variable:
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```

### Step 2: Deploy to Render

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select the `evoting-frontend` repository

3. **Configure Service**
   - **Name**: `evoting-frontend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `frontend` (if monorepo)
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**
   - Click "Advanced"
   - Add environment variable:
     - Key: `VITE_API_URL`
     - Value: `https://your-backend.onrender.com/api`

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Wait for deployment to complete (~5-10 minutes)

6. **Access Your Site**
   - Your site will be available at:
   ```
   https://evoting-frontend.onrender.com
   ```

### Step 3: Configure Custom Domain (Optional)

1. **Add Custom Domain in Render**
   - Service Settings → Custom Domains
   - Add your domain (e.g., `evoting.yourdomain.com`)

2. **Update DNS Records**
   - Add CNAME record:
     - Name: `evoting` (or `@` for root domain)
     - Value: `evoting-frontend.onrender.com`

3. **Enable HTTPS**
   - Render automatically provisions SSL certificates
   - Wait for certificate to be issued (~5 minutes)

---

## Backend Deployment (Required First)

Before deploying the frontend, deploy your backend:

### Option A: Render (Recommended)

1. **Create New Web Service**
   - Dashboard → New → Web Service
   - Connect `evoting-backend` repository

2. **Configure Service**
   - **Name**: `evoting-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

3. **Add Environment Variables**
   ```
   DATABASE_URL=your-mysql-connection-string
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=24h
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   ```

4. **Database Setup**
   - Use Render's PostgreSQL (free tier) or
   - External MySQL service (PlanetScale, Railway)

5. **Deploy**
   - Click "Create Web Service"
   - Note your backend URL: `https://evoting-backend.onrender.com`

### Option B: Railway

1. **Create Account**: https://railway.app
2. **New Project** → Deploy from GitHub
3. **Select Repository**: `evoting-backend`
4. **Add Variables**: Same as Render
5. **Deploy**: Automatic

### Option C: Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create App**: `heroku create evoting-backend`
4. **Add Database**: `heroku addons:create jawsdb:kitefin`
5. **Set Variables**: `heroku config:set KEY=VALUE`
6. **Deploy**: `git push heroku main`

---

## Post-Deployment Checklist

### Frontend
- [ ] Build completes without errors
- [ ] API URL points to deployed backend
- [ ] All routes are accessible
- [ ] Login works correctly
- [ ] Admin dashboard loads
- [ ] Results page displays
- [ ] Exports (CSV/PDF) work

### Backend
- [ ] Database connection successful
- [ ] All API endpoints respond
- [ ] Email sending works
- [ ] File uploads work
- [ ] CORS configured for frontend domain
- [ ] Environment variables set

### Testing
- [ ] Test voter login flow
- [ ] Test admin login
- [ ] Test candidate registration
- [ ] Test voting process
- [ ] Test results viewing
- [ ] Test report exports
- [ ] Check mobile responsiveness

---

## Troubleshooting

### Issue: "API Network Error"

**Solution:**
1. Check backend is running
2. Verify API URL in frontend code
3. Check CORS settings in backend:
   ```javascript
   app.use(cors({
     origin: ['https://your-frontend.onrender.com', 'https://yourusername.github.io'],
     credentials: true
   }));
   ```

### Issue: "Build Failed on Render"

**Solution:**
1. Check build logs for errors
2. Verify Node version compatibility
3. Ensure all dependencies are in `package.json`
4. Try building locally first: `npm run build`

### Issue: "Routes Not Found (404)"

**Solution:**
1. For GitHub Pages, ensure `base` is set in `vite.config.ts`
2. For Render, ensure `server.cjs` handles SPA routing:
   ```javascript
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'dist', 'index.html'));
   });
   ```

### Issue: "Environment Variables Not Working"

**Solution:**
1. For Vite, prefix with `VITE_`: `VITE_API_URL`
2. Access with: `import.meta.env.VITE_API_URL`
3. Rebuild after changing env vars

### Issue: "Database Connection Failed"

**Solution:**
1. Check `DATABASE_URL` format
2. Ensure database allows external connections
3. Verify SSL settings if required
4. Check firewall rules

---

## Performance Optimization

### 1. Enable Compression

Already configured in `server.cjs`:
```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Enable Caching

Add to `server.cjs`:
```javascript
app.use(express.static('dist', {
  maxAge: '1y',
  etag: false
}));
```

### 3. Optimize Build

In `vite.config.ts`:
```typescript
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    }
  }
})
```

---

## Monitoring & Maintenance

### Render
- View logs: Service → Logs
- Monitor metrics: Service → Metrics
- Set up alerts: Service → Settings → Notifications

### GitHub Pages
- Check deployment status: Actions tab
- View build logs: Click on workflow run

### Uptime Monitoring
- Use UptimeRobot (free): https://uptimerobot.com
- Monitor both frontend and backend
- Get alerts for downtime

---

## Security Best Practices

1. **HTTPS Only**
   - Both platforms provide free SSL
   - Enforce HTTPS in production

2. **Environment Variables**
   - Never commit `.env` files
   - Use platform's environment variable management

3. **CORS Configuration**
   - Only allow your frontend domain
   - Don't use `*` in production

4. **Rate Limiting**
   - Already implemented in backend
   - Monitor for abuse

5. **Database Security**
   - Use strong passwords
   - Enable SSL for database connections
   - Regular backups

---

## Continuous Deployment

### GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install and Build
        run: |
          cd frontend
          npm install
          npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

### Render (Automatic)
- Automatically deploys on git push to main
- No configuration needed

---

## Cost Estimate

### Free Tier (Recommended for Demo)
- **GitHub Pages**: Free
- **Render**: Free (with limitations)
  - 750 hours/month
  - Sleeps after 15 min inactivity
  - Wakes on request (~30 sec delay)

### Paid Tier (Production)
- **Render Starter**: $7/month
  - Always on
  - No sleep
  - Better performance
- **Database**: $7-15/month
  - Managed MySQL/PostgreSQL

---

## Quick Deploy Commands

### GitHub Pages
```bash
cd frontend
npm install
npm run build
npm run deploy
```

### Render
```bash
# Just push to GitHub
git add .
git commit -m "Deploy to Render"
git push origin main
# Render auto-deploys
```

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **GitHub Pages Docs**: https://docs.github.com/pages
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy
- **React Router**: https://reactrouter.com/en/main/guides/deploying

---

**Document Version:** 1.0  
**Last Updated:** December 2024  
**Maintained by:** E-Voting System Team
