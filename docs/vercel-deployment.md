# Vercel Deployment Guide

Finova's frontend is a standard Next.js App Router application optimized natively for Vercel.

## Deployment Steps
1. Log into your Vercel account.
2. Click **Add New...** -> **Project**.
3. Import the `finova` repository you created on GitHub.
4. **CRITICAL:** Open the **Build and Output Settings** and set the **Root Directory** to `frontend`. 
   *(Note: Do NOT add a `vercel.json` file. Vercel automatically detects the Next.js App Router configuration and handles API rewrites via `next.config.ts` natively).*
5. Open the **Environment Variables** section and add the following:

### Required Frontend Environment Variables
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Backend Connection Variable
Wait until your Render backend is deployed before adding this (or add it and redeploy Vercel later):
```env
NEXT_PUBLIC_API_URL=https://finova-backend.onrender.com
```

6. Click **Deploy**. Vercel will automatically run `npm run build` inside the `frontend` folder and deploy your assets securely.
