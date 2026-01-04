# Firebase Setup Guide for Google Authentication

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select an existing project
3. Enter project name (e.g., "FinTrack")
4. Follow the setup wizard (you can disable Google Analytics if you want)

## Step 2: Enable Google Authentication

1. In Firebase Console, go to **Authentication** from the left sidebar
2. Click **"Get started"** if it's your first time
3. Go to **"Sign-in method"** tab
4. Click on **"Google"** provider
5. Toggle the **Enable** switch
6. Add a support email (your email)
7. Click **"Save"**

## Step 3: Register Web App

1. Go to **Project Settings** (gear icon in sidebar)
2. Scroll down to **"Your apps"** section
3. Click the **"</>""** (Web) icon
4. Enter app nickname (e.g., "FinTrack Web")
5. Check **"Also set up Firebase Hosting"** (optional)
6. Click **"Register app"**

## Step 4: Copy Firebase Configuration

You'll see a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop",
};
```

## Step 5: Update .env File

Copy the values from Firebase config to your `.env` file:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

## Step 6: Add Authorized Domain (for localhost)

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. `localhost` should already be there by default
3. When you deploy, add your production domain here

## Step 7: Restart Development Server

After updating `.env`:

```bash
# Stop the current dev server (Ctrl+C)
npm run dev
```

## Step 8: Test Google Sign-In

1. Go to `http://localhost:5173/login` (or your port)
2. Click **"Sign in with Google"**
3. A popup should appear with your Google accounts
4. Select an account
5. You should be logged in! ✅

## Troubleshooting

### Popup Blocked

- Allow popups in your browser for localhost
- Check browser console for errors

### Configuration Error

- Make sure all env variables start with `VITE_`
- Restart dev server after changing `.env`
- Check Firebase config values are correct

### Domain Not Authorized

- Go to Firebase Console > Authentication > Settings > Authorized domains
- Add your domain (localhost is usually pre-authorized)

## Security Notes

- **Never commit your `.env` file to Git**
- The `.env` file is already in `.gitignore`
- Keep your Firebase API keys secure
- Firebase API keys are safe to expose in frontend (they're restricted by Firebase Security Rules)

## Next Steps

Once working locally, for production deployment:

1. Add your production domain to Firebase Authorized domains
2. Set environment variables in your hosting platform (Vercel, Netlify, etc.)
3. Test the authentication flow on production
