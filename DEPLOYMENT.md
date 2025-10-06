# 🚀 VehicleDoc Pro - Deployment Guide

> **Quick setup to get your app online and share with friends!**

## 📋 What We're Deploying

- **Frontend (React)**: User interface → Netlify (Free)
- **Backend (Node.js)**: API server → Render (Free)
- **Database**: MongoDB → MongoDB Atlas (Free)

## 🌐 Live Links (After Deployment)

- **Frontend**: `https://qr-vehicle-docs.netlify.app`
- **Backend API**: `https://qr-vehicle-docs-backend.onrender.com`
- **GitHub Repo**: `https://github.com/narasimharaokandula8/qr-vehicle-docs`

---

## 🎯 Step 1: Push to GitHub

```bash
# Initialize git and push to your repo
git remote add origin https://github.com/narasimharaokandula8/qr-vehicle-docs.git
git add .
git commit -m "🎉 Initial commit - VehicleDoc Pro with Glassmorphism UI"
git branch -M main
git push -u origin main
```

---

## 🗄️ Step 2: Setup Database (MongoDB Atlas)

1. **Go to**: [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Sign up** for free account
3. **Create a cluster** (choose free tier)
4. **Create database user**:
   - Username: `vehicledoc-user`
   - Password: Generate strong password
5. **Whitelist IP addresses**: Add `0.0.0.0/0` (allow from anywhere)
6. **Get connection string**: 
   ```
   mongodb+srv://vehicledoc-user:<password>@cluster.mongodb.net/vehicledocs?retryWrites=true&w=majority
   ```

---

## 🖥️ Step 3: Deploy Backend (Render)

1. **Go to**: [Render.com](https://render.com)
2. **Sign up** with GitHub
3. **Create Web Service**:
   - Repository: `narasimharaokandula8/qr-vehicle-docs`
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Set Environment Variables**:
   ```bash
   NODE_ENV=production
   PORT=10000
   MONGO_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key-64-chars-long
   FILE_ENCRYPTION_KEY=base64:your-32-byte-base64-encoded-key
   PAYMENT_BASE_FEE=100
   ```

5. **Deploy** and wait for build to complete
6. **Note the URL**: `https://your-app-name.onrender.com`

---

## 🎨 Step 4: Deploy Frontend (Netlify)

1. **Go to**: [Netlify.com](https://netlify.com)
2. **Sign up** with GitHub
3. **New site from Git**:
   - Repository: `narasimharaokandula8/qr-vehicle-docs`
   - Build settings:
     - Build command: `npm run build:frontend`
     - Publish directory: `frontend/dist`

4. **Set Environment Variables**:
   ```bash
   VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
   VITE_APP_NAME=VehicleDoc Pro
   ```

5. **Deploy** and get your live URL!

---

## ✅ Step 5: Test Everything

### Test Backend API:
```bash
curl https://your-render-app.onrender.com/
# Should return: "Vehicle Docs Backend is running!"
```

### Test Frontend:
1. Open your Netlify URL
2. Should see beautiful glassmorphism homepage
3. Try login/signup (will connect to your backend)

---

## 📱 Step 6: Share with Friends

Send them these links:
- **App**: `https://your-app-name.netlify.app`
- **GitHub**: `https://github.com/narasimharaokandula8/qr-vehicle-docs`

---

## 🔧 Quick Environment Setup

### For Backend (.env):
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://vehicledoc-user:PASSWORD@cluster.mongodb.net/vehicledocs
JWT_SECRET=your-64-character-super-secure-jwt-secret-key-here-make-it-random
FILE_ENCRYPTION_KEY=base64:YWJjZGVmZ2hpams6bG1ub3BxcnN0dXZ3eHl6MTIzNDU2
PORT=10000
PAYMENT_BASE_FEE=100
PAYMENT_PROVIDER=demo
```

### For Frontend (.env):
```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=VehicleDoc Pro
VITE_ENABLE_QR_SCANNER_DEMO=true
VITE_THEME_PRIMARY_COLOR=#3366FF
```

---

## 🏃‍♂️ Quick Commands

```bash
# Local development
npm run setup              # Run setup script
npm run dev:backend        # Start backend server
npm run dev:frontend       # Start frontend server

# Building
npm run build             # Build frontend for production
npm run build:frontend    # Build frontend only

# Testing
npm test                  # Run all tests
```

---

## 🆘 Troubleshooting

### Common Issues:

**1. Backend won't start on Render:**
- Check environment variables are set
- Ensure MongoDB connection string is correct
- Check Render logs for errors

**2. Frontend can't connect to backend:**
- Verify `VITE_API_BASE_URL` points to your Render backend
- Check CORS settings in backend
- Ensure backend is running

**3. Database connection fails:**
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has proper permissions

**4. Build fails:**
- Check Node.js version (should be 16+)
- Verify all dependencies are installed
- Check for syntax errors

---

## 🔗 Useful Links

- **Frontend Demo**: [Netlify Deploy](https://app.netlify.com/drop)
- **Backend Deploy**: [Render Dashboard](https://dashboard.render.com)
- **Database**: [MongoDB Atlas](https://cloud.mongodb.com)
- **GitHub Repo**: [Your Repository](https://github.com/narasimharaokandula8/qr-vehicle-docs)

---

## 🎉 Success!

Once deployed, your friends can:
1. **Visit your app** and create accounts
2. **Upload vehicle documents** securely
3. **Generate QR codes** for verification
4. **Scan QR codes** (police officers)
5. **Experience the beautiful glassmorphism UI**

**Your app will be live at:**
- 🌐 **Frontend**: `https://qr-vehicle-docs.netlify.app`
- 🔌 **API**: `https://qr-vehicle-docs-backend.onrender.com`

---

<div align="center">
  <p><strong>🚗 Ready to revolutionize vehicle document management! 🚗</strong></p>
  <p>Built with ❤️ by Narasimha</p>
</div>