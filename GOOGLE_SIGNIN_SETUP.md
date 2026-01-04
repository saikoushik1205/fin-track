# 🔥 Quick Start: Enable Google Sign-In

## What I Changed

✅ **Installed Firebase** (already done)  
✅ **Created Firebase config** at `src/config/firebase.ts`  
✅ **Updated AuthContext** to use real Google OAuth  
✅ **Added error handling** for popup blocked/cancelled

## ⚡ What You Need To Do Now

### 1. Get Firebase Credentials (5 minutes)

1. **Go to**: https://console.firebase.google.com/
2. **Create project** or select existing
3. **Enable Authentication**:

   - Click "Authentication" in sidebar
   - Click "Get started"
   - Go to "Sign-in method" tab
   - Enable "Google" provider
   - Add your email as support email
   - Save

4. **Get your config**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "</>" (Web icon)
   - Register app with any name
   - Copy the config values

### 2. Update Your .env File

Replace the placeholder values in `.env` with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

### 3. Restart Dev Server

```bash
# Stop current server (Ctrl+C in terminal)
npm run dev
```

### 4. Test It!

1. Go to http://localhost:5173/login
2. Click "Sign in with Google"
3. **IMPORTANT**: Allow popups if browser blocks them
4. Choose your Google account
5. ✅ You're in!

## 🎯 Expected Behavior

**Before (Old)**:

- Click "Sign in with Google"
- Fake loading animation
- Logs in as "Google User" (dummy data)

**After (New)**:

- Click "Sign in with Google"
- **Popup appears** with real Google account selection
- Choose your actual Google account
- Logs in with your real name, email, and profile picture

## 🔧 Common Issues

### Popup Blocked

**Error**: "Popup blocked. Please allow popups for this site."  
**Fix**: Click the popup blocker icon in your browser's address bar and allow popups

### Configuration Error

**Error**: Firebase config errors in console  
**Fix**:

1. Double-check all values in `.env`
2. Make sure they start with `VITE_`
3. Restart dev server after changes

### "Domain not authorized"

**Fix**:

1. Go to Firebase Console
2. Authentication > Settings > Authorized domains
3. Verify `localhost` is listed (it should be by default)

## 📝 Full Documentation

See `FIREBASE_SETUP.md` for detailed step-by-step instructions with screenshots.

## 🚀 Production Deployment

When deploying:

1. Add your production domain to Firebase Authorized domains
2. Set the same environment variables in your hosting platform
3. Firebase API keys are safe to expose in frontend code
