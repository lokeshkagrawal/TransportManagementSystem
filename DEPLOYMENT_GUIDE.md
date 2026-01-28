# 🚀 TMS Application - Complete Deployment Guide

## 📋 Overview

This guide will help you deploy your Transportation Management System (TMS) application and get it running live on the internet. Follow these steps carefully to deploy both the backend (GraphQL API) and frontend (React app).

## ⏱️ Estimated Time: 30-45 minutes

## 🎯 What You'll Need

1. GitHub account (free)
2. Render.com account (free) for backend
3. Netlify account (free) for frontend
4. Terminal/Command Line access
5. Git installed on your computer

---

## 📝 Pre-Deployment Checklist

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] Render.com account created
- [ ] Netlify account created

---

## PART 1: Setup GitHub Repository

### Step 1: Initialize Git Repository

Open terminal in your tms-app folder:

```bash
cd tms-app
git init
git add .
git commit -m "Initial commit - TMS Application"
```

### Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `tms-app`
4. Description: "Transportation Management System"
5. Make it **Public**
6. Click "Create repository"

### Step 3: Push to GitHub

Copy the commands from GitHub (they look like this):

```bash
git remote add origin https://github.com/YOUR_USERNAME/tms-app.git
git branch -M main
git push -u origin main
```

✅ **Checkpoint**: Your code is now on GitHub!

---

## PART 2: Deploy Backend (GraphQL API)

### Option A: Render.com (Recommended - Free Tier)

#### Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Click "Get Started for Free"
3. Sign up with GitHub

#### Step 2: Create New Web Service
1. Click "New +" button
2. Select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Click "Next"

#### Step 3: Connect Repository
1. Find and select your `tms-app` repository
2. Click "Connect"

#### Step 4: Configure Service
Fill in the following:

- **Name**: `tms-backend` (or any name you prefer)
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Step 5: Select Plan
- Choose **Free** plan
- Click "Create Web Service"

#### Step 6: Wait for Deployment
- Render will start building your app
- This takes 2-5 minutes
- Watch the logs for any errors
- When you see "Server ready", you're good!

#### Step 7: Get Your Backend URL
1. At the top of the page, you'll see your service URL
2. Example: `https://tms-backend-xxx.onrender.com`
3. **Copy this URL** - you'll need it for the frontend

#### Step 8: Test Your Backend
1. Open your backend URL in browser
2. Add `/graphql` to the end
3. Example: `https://tms-backend-xxx.onrender.com/graphql`
4. You should see GraphQL Playground
5. Try this query:
```graphql
mutation {
  login(email: "admin@tms.com", password: "admin123") {
    token
    user {
      name
      role
    }
  }
}
```

✅ **Checkpoint**: Backend is live and working!

---

### Option B: Heroku (Alternative)

```bash
# Install Heroku CLI first
cd backend

# Login to Heroku
heroku login

# Create app
heroku create your-tms-backend

# Deploy
git subtree push --prefix backend heroku main

# Get URL
heroku open
```

---

## PART 3: Deploy Frontend (React App)

### Option A: Netlify (Recommended - Free Tier)

#### Step 1: Sign Up for Netlify
1. Go to [netlify.com](https://netlify.com)
2. Click "Sign up"
3. Sign up with GitHub

#### Step 2: Create New Site
1. Click "Add new site"
2. Select "Import an existing project"
3. Choose "Deploy with GitHub"

#### Step 3: Authorize and Select
1. Authorize Netlify to access your GitHub
2. Find and select your `tms-app` repository
3. Click on it

#### Step 4: Configure Build Settings
Fill in the following:

- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

#### Step 5: Add Environment Variable
**IMPORTANT**: Before deploying, you need to add your backend URL

1. Click "Show advanced"
2. Click "New variable"
3. Add:
   - **Key**: `VITE_GRAPHQL_URL`
   - **Value**: `https://your-backend.onrender.com/graphql`
   (Replace with your actual backend URL from Part 2)

Example:
```
VITE_GRAPHQL_URL=https://tms-backend-xxx.onrender.com/graphql
```

#### Step 6: Deploy Site
1. Click "Deploy site"
2. Wait 2-5 minutes for build to complete
3. Watch the deploy logs

#### Step 7: Get Your Frontend URL
1. Once deployed, you'll see a randomly generated URL
2. Example: `https://random-name-12345.netlify.app`
3. You can customize this name:
   - Go to "Site settings"
   - Click "Change site name"
   - Enter your desired name (e.g., `my-tms-app`)
   - New URL: `https://my-tms-app.netlify.app`

#### Step 8: Test Your Frontend
1. Open your frontend URL in browser
2. You should see the login page
3. Login with:
   - Email: `admin@tms.com`
   - Password: `admin123`
4. Test all features:
   - View shipments in grid mode
   - Switch to tile view
   - Search for shipments
   - Click on a shipment to see details
   - Test filters

✅ **Checkpoint**: Frontend is live and connected to backend!

---

## PART 4: Final Testing

### Test Checklist

1. **Authentication**
   - [ ] Login as admin (admin@tms.com / admin123)
   - [ ] Login as employee (employee@tms.com / employee123)
   - [ ] Logout works correctly

2. **Views**
   - [ ] Grid view displays correctly
   - [ ] Tile view displays correctly
   - [ ] Can switch between views
   - [ ] All 12 dummy shipments are visible

3. **Features**
   - [ ] Search works (try searching "FedEx")
   - [ ] Status filter works
   - [ ] Carrier filter works
   - [ ] Clicking shipment opens detail modal
   - [ ] Modal close button works
   - [ ] Bun button menu appears

4. **Mobile**
   - [ ] Open on phone/tablet
   - [ ] Layout is responsive
   - [ ] All features work on mobile

5. **Admin Features** (login as admin)
   - [ ] Statistics cards appear
   - [ ] Can see all shipments
   - [ ] Can delete any shipment

6. **Employee Features** (login as employee)
   - [ ] Statistics cards don't appear
   - [ ] Can only see own shipments

---

## 📱 Share Your URLs

After successful deployment, you'll have two URLs to share:

1. **Frontend URL** (Main App):
   ```
   https://your-app.netlify.app
   ```

2. **Backend URL** (API):
   ```
   https://your-backend.onrender.com
   ```

3. **GraphQL Playground**:
   ```
   https://your-backend.onrender.com/graphql
   ```

---

## 🔧 Troubleshooting

### Issue: Frontend can't connect to backend

**Solution:**
1. Check your environment variable in Netlify
2. Make sure `VITE_GRAPHQL_URL` is correct
3. Verify your backend is running (visit backend URL)
4. Redeploy frontend after fixing

### Issue: Backend shows "Application Error"

**Solution:**
1. Check Render logs for errors
2. Verify all files are committed to GitHub
3. Check if `package.json` and `server.js` exist in backend folder
4. Try manual redeploy

### Issue: CORS errors in console

**Solution:**
- The backend is already configured for CORS
- If issues persist, check that frontend URL is using the correct backend URL
- Clear browser cache

### Issue: "Cannot GET /" on backend

**Solution:**
- This is normal! The backend is API-only
- Add `/graphql` to the URL to see GraphQL Playground
- Example: `https://your-backend.onrender.com/graphql`

### Issue: Netlify build fails

**Solution:**
1. Check build logs in Netlify
2. Verify `VITE_GRAPHQL_URL` environment variable is set
3. Make sure `frontend/package.json` exists
4. Try clearing cache and redeploying

---

## 🔄 Updating Your App

When you make changes:

### Update Backend:
```bash
cd backend
# Make your changes
git add .
git commit -m "Update backend"
git push origin main
```
Render will automatically redeploy!

### Update Frontend:
```bash
cd frontend
# Make your changes
git add .
git commit -m "Update frontend"
git push origin main
```
Netlify will automatically redeploy!

---

## 📊 Monitoring

### Check Backend Status
1. Go to Render dashboard
2. Click your service
3. View logs and metrics

### Check Frontend Status
1. Go to Netlify dashboard
2. Click your site
3. View deploy logs and analytics

---

## 💡 Tips for Success

1. **Test Locally First**: Always test changes locally before deploying
2. **Check Logs**: If something breaks, check the deployment logs
3. **Environment Variables**: Double-check they're set correctly
4. **Free Tier Limitations**: 
   - Render: Apps sleep after 15 min of inactivity (first request takes 30-60 seconds)
   - Netlify: Unlimited bandwidth for personal projects
5. **Custom Domain**: You can add a custom domain in Netlify settings if you have one

---

## 🎉 Success!

If you've completed all steps, your TMS application should be:

✅ Live on the internet
✅ Accessible from anywhere
✅ Backend API working
✅ Frontend connected to backend
✅ All features functional
✅ Ready to share with the hiring team

---

## 📧 Submission Checklist

When submitting to the hiring team, provide:

1. **Live Frontend URL**: https://your-app.netlify.app
2. **Backend API URL**: https://your-backend.onrender.com
3. **GitHub Repository**: https://github.com/your-username/tms-app
4. **Login Credentials**:
   ```
   Admin: admin@tms.com / admin123
   Employee: employee@tms.com / employee123
   ```

---

## 🆘 Need Help?

If you encounter issues:

1. Check the troubleshooting section above
2. Review the error messages in deployment logs
3. Verify all environment variables are set correctly
4. Make sure your GitHub repository is up to date
5. Try redeploying from scratch if needed

---

**Good luck with your deployment! 🚀**

The application is production-ready and should impress the hiring team with its professional design, comprehensive features, and smooth performance.
