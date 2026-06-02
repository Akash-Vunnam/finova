# Render Deployment Guide

The Finova backend is an Express.js server designed to act as the primary intermediary for business logic, protecting all secure Gemini and Firebase API keys.

## Deployment Steps
1. Log into your Render account.
2. Click **New** -> **Web Service**.
3. Connect your GitHub account and select the `finova-app` repository.
4. Render should automatically detect the `render.yaml` file in the root. If it doesn't, apply these settings manually:
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build` (Executed at monorepo root to link shared packages)
   - **Start Command:** `cd backend && npm start`

## Required Backend Environment Variables
Add these as Secret Environment Variables in the Render dashboard:
```env
# Google Gemini API Key for AI Insights
GEMINI_API_KEY=your_gemini_api_key

# Alpha Vantage API Key for Market Data
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_key

# Firebase Setup
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com

# Copy the entire contents of the Firebase Service Account JSON file as a single line string
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

Wait for the deployment to finish and go "Live". Note the external URL provided (e.g. `finova-backend-abc.onrender.com`).
